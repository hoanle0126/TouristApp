import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { isValidDateOnly } from './dto/is-valid-date-only.validator';
import { UpsertTourDeparturesDto } from './dto/upsert-tour-departures.dto';

const CAPACITY_ERROR = 'Capacity cannot be lower than current bookings.';

const tourDetailInclude = {
  destinations: true,
  hotels: true,
  departures: { orderBy: { date: 'asc' as const } },
};

type TourCardRecord = Prisma.TourGetPayload<{
  include: { destinations: true; hotels: true };
}>;

type TourRecord = Prisma.TourGetPayload<{
  include: typeof tourDetailInclude;
}>;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: { search?: string } = {}) {
    const tours = await this.prisma.tour.findMany({
      include: { destinations: true, hotels: true },
      orderBy: { createdAt: 'desc' },
      where: filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' } },
              { shortDescription: { contains: filters.search, mode: 'insensitive' } },
              { duration: { contains: filters.search, mode: 'insensitive' } },
              { type: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    });
    return tours.map((tour) => this.toCardResponse(tour));
  }

  async findOne(slug: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { slug },
      include: tourDetailInclude,
    });

    if (!tour) {
      throw new NotFoundException(`Tour ${slug} was not found.`);
    }

    return this.toDetailResponse(tour);
  }

  async create(dto: CreateTourDto) {
    const tour = await this.prisma.tour.create({
      data: dto,
      include: tourDetailInclude,
    });
    return this.toDetailResponse(tour);
  }

  async update(slug: string, dto: UpdateTourDto) {
    await this.findOne(slug);
    const tour = await this.prisma.tour.update({
      where: { slug },
      data: dto,
      include: tourDetailInclude,
    });
    return this.toDetailResponse(tour);
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.tour.delete({ where: { slug } });
    return { deleted: true, slug };
  }

  async upsertDepartures(slug: string, dto: UpsertTourDeparturesDto) {
    this.validateUniquePayload(dto.departures);

    await this.prisma.$transaction(async (tx) => {
      const tour = await tx.tour.findUnique({ where: { slug } });

      if (!tour) {
        throw new NotFoundException(`Tour ${slug} was not found.`);
      }

      for (const departure of dto.departures) {
        const date = this.toInventoryDate(departure.date);

        if (departure.id) {
          const existing = await tx.tourDeparture.findUnique({
            where: { id: departure.id },
          });

          if (!existing || existing.tourId !== tour.id) {
            throw new NotFoundException(`Tour departure ${departure.id} was not found.`);
          }

          const dateConflict = await tx.tourDeparture.findUnique({
            where: { tourId_date: { tourId: tour.id, date } },
          });

          if (dateConflict && dateConflict.id !== departure.id) {
            throw new BadRequestException('Inventory date already exists.');
          }

          const result = await tx.tourDeparture.updateMany({
            where: {
              id: departure.id,
              tourId: tour.id,
              booked: { lte: departure.capacity },
            },
            data: {
              date,
              capacity: departure.capacity,
              status: departure.status,
            },
          });

          if (result.count !== 1) {
            throw new BadRequestException(CAPACITY_ERROR);
          }
          continue;
        }

        const existing = await tx.tourDeparture.findUnique({
          where: { tourId_date: { tourId: tour.id, date } },
        });

        if (existing) {
          const result = await tx.tourDeparture.updateMany({
            where: {
              id: existing.id,
              tourId: tour.id,
              booked: { lte: departure.capacity },
            },
            data: {
              capacity: departure.capacity,
              status: departure.status,
            },
          });

          if (result.count !== 1) {
            throw new BadRequestException(CAPACITY_ERROR);
          }
          continue;
        }

        await tx.tourDeparture.create({
          data: {
            tourId: tour.id,
            date,
            capacity: departure.capacity,
            status: departure.status,
            booked: 0,
          },
        });
      }
    });

    return this.findOne(slug);
  }

  private toCardResponse(tour: TourCardRecord) {
    return {
      slug: tour.slug,
      title: tour.title,
      badge: tour.badge ?? undefined,
      duration: tour.duration,
      guests: tour.guests,
      price: tour.price,
      description: tour.shortDescription,
      image: tour.image,
      alt: tour.alt,
      destinations: tour.destinations.map((destination) =>
        this.toDestinationResponse(destination),
      ),
      hotels: tour.hotels.map((hotel) => this.toHotelResponse(hotel)),
    };
  }

  private toDestinationResponse(
    destination: TourRecord['destinations'][number],
  ) {
    return {
      slug: destination.slug,
      title: destination.title,
      href: destination.href,
      market: destination.market,
    };
  }

  private toHotelResponse(hotel: TourRecord['hotels'][number]) {
    return {
      slug: hotel.slug,
      name: hotel.name,
      href: `/hotels/${hotel.slug}`,
      location: hotel.location,
      price: hotel.price,
    };
  }

  private toDetailResponse(tour: TourRecord) {
    return {
      slug: tour.slug,
      title: tour.title,
      badge: tour.badge ?? undefined,
      type: tour.type,
      duration: tour.duration,
      guests: tour.guests,
      price: tour.price,
      availability: tour.availability,
      description: tour.description,
      shortDescription: tour.shortDescription,
      image: tour.image,
      alt: tour.alt,
      heroImage: tour.heroImage,
      heroAlt: tour.heroAlt,
      curatorImage: tour.curatorImage,
      curatorImageAlt: tour.curatorImageAlt,
      subtitle: tour.subtitle,
      highlights: tour.highlights,
      itinerary: tour.itinerary,
      gallery: tour.gallery,
      inclusions: tour.inclusions,
      exclusions: tour.exclusions,
      destinations: tour.destinations.map((destination) =>
        this.toDestinationResponse(destination),
      ),
      hotels: tour.hotels.map((hotel) => this.toHotelResponse(hotel)),
      departures: tour.departures.map((departure) => ({
        id: departure.id,
        date: this.toDateString(departure.date),
        capacity: departure.capacity,
        booked: departure.booked,
        remaining: departure.capacity - departure.booked,
        status: departure.status,
      })),
    };
  }

  private validateUniquePayload(
    departures: UpsertTourDeparturesDto['departures'],
  ) {
    const ids = new Set<string>();
    const dates = new Set<string>();

    for (const departure of departures) {
      if (departure.id) {
        if (ids.has(departure.id)) {
          throw new BadRequestException('Duplicate inventory id in payload.');
        }
        ids.add(departure.id);
      }

      if (dates.has(departure.date)) {
        throw new BadRequestException('Duplicate inventory date in payload.');
      }
      dates.add(departure.date);
    }
  }

  private toInventoryDate(date: string) {
    if (!isValidDateOnly(date)) {
      throw new BadRequestException('date must be a valid date in YYYY-MM-DD format');
    }

    return new Date(`${date}T00:00:00.000Z`);
  }

  private toDateString(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
