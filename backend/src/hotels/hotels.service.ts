import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { isValidDateOnly } from '../tours/dto/is-valid-date-only.validator';
import { UpsertHotelInventoryDto } from './dto/upsert-hotel-inventory.dto';

const CAPACITY_ERROR = 'Capacity cannot be lower than current bookings.';

const hotelDetailInclude = {
  destinations: true,
  tours: true,
  inventoryDays: { orderBy: { date: 'asc' as const } },
};

type HotelCardRecord = Prisma.HotelGetPayload<{
  include: { destinations: true; tours: true };
}>;

type HotelRecord = Prisma.HotelGetPayload<{
  include: typeof hotelDetailInclude;
}>;

type RelationInput = {
  destinationSlugs?: string[];
  tourSlugs?: string[];
};

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: {
      location?: string;
      destination?: string;
      tour?: string;
      search?: string;
      perPage?: number;
    } = {},
  ) {
    const hotels = await this.prisma.hotel.findMany({
      where: this.buildPublicWhere(filters),
      include: { destinations: true, tours: true },
      orderBy: { createdAt: 'desc' },
      take: filters.perPage,
    });

    return hotels.map((hotel) => this.toCardResponse(hotel));
  }

  async findOne(slug: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { slug, status: 'published' },
      include: hotelDetailInclude,
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel ${slug} was not found.`);
    }

    return this.toDetailResponse(hotel);
  }

  async create(dto: CreateHotelDto) {
    const { destinationSlugs, tourSlugs, ...data } = dto;
    const hotel = await this.prisma.hotel.create({
      data: {
        ...data,
        ...this.toRelationData({ destinationSlugs, tourSlugs }),
      },
      include: hotelDetailInclude,
    });

    return this.toDetailResponse(hotel);
  }

  async update(slug: string, dto: UpdateHotelDto) {
    await this.findEditableHotel(slug);
    const { destinationSlugs, tourSlugs, ...data } = dto;
    const hotel = await this.prisma.hotel.update({
      where: { slug },
      data: {
        ...data,
        ...this.toRelationData({ destinationSlugs, tourSlugs }, true),
      },
      include: hotelDetailInclude,
    });

    return this.toDetailResponse(hotel);
  }

  async remove(slug: string) {
    await this.findEditableHotel(slug);
    await this.prisma.hotel.delete({ where: { slug } });
    return { deleted: true, slug };
  }

  async upsertInventory(slug: string, dto: UpsertHotelInventoryDto) {
    this.validateUniquePayload(dto.inventory);

    await this.prisma.$transaction(async (tx) => {
      const hotel = await this.findEditableHotelInTransaction(tx, slug);

      for (const inventoryDay of dto.inventory) {
        const date = this.toInventoryDate(inventoryDay.date);

        if (inventoryDay.id) {
          const existing = await tx.hotelInventoryDay.findUnique({
            where: { id: inventoryDay.id },
          });

          if (!existing || existing.hotelId !== hotel.id) {
            throw new NotFoundException(
              `Hotel inventory day ${inventoryDay.id} was not found.`,
            );
          }

          const dateConflict = await tx.hotelInventoryDay.findUnique({
            where: { hotelId_date: { hotelId: hotel.id, date } },
          });

          if (dateConflict && dateConflict.id !== inventoryDay.id) {
            throw new BadRequestException('Inventory date already exists.');
          }

          const result = await tx.hotelInventoryDay.updateMany({
            where: {
              id: inventoryDay.id,
              hotelId: hotel.id,
              bookedRooms: { lte: inventoryDay.totalRooms },
            },
            data: {
              date,
              totalRooms: inventoryDay.totalRooms,
              status: inventoryDay.status,
            },
          });

          if (result.count !== 1) {
            throw new BadRequestException(CAPACITY_ERROR);
          }
          continue;
        }

        const existing = await tx.hotelInventoryDay.findUnique({
          where: { hotelId_date: { hotelId: hotel.id, date } },
        });

        if (existing) {
          const result = await tx.hotelInventoryDay.updateMany({
            where: {
              id: existing.id,
              hotelId: hotel.id,
              bookedRooms: { lte: inventoryDay.totalRooms },
            },
            data: {
              totalRooms: inventoryDay.totalRooms,
              status: inventoryDay.status,
            },
          });

          if (result.count !== 1) {
            throw new BadRequestException(CAPACITY_ERROR);
          }
          continue;
        }

        await tx.hotelInventoryDay.create({
          data: {
            hotelId: hotel.id,
            date,
            totalRooms: inventoryDay.totalRooms,
            status: inventoryDay.status,
            bookedRooms: 0,
          },
        });
      }
    });

    return this.findEditableHotelDetail(slug);
  }

  private buildPublicWhere(filters: {
    location?: string;
    destination?: string;
    tour?: string;
    search?: string;
  }) {
    return {
      status: 'published',
      ...(filters.location
        ? {
            location: {
              contains: filters.location,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(filters.destination
        ? { destinations: { some: { slug: filters.destination } } }
        : {}),
      ...(filters.tour ? { tours: { some: { slug: filters.tour } } } : {}),
      ...(filters.search
        ? {
            OR: [
              {
                name: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                location: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                address: {
                  contains: filters.search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    } satisfies Prisma.HotelWhereInput;
  }

  private async findEditableHotel(slug: string) {
    return this.findEditableHotelInTransaction(this.prisma, slug);
  }

  private async findEditableHotelDetail(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug },
      include: hotelDetailInclude,
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel ${slug} was not found.`);
    }

    return this.toDetailResponse(hotel);
  }

  private async findEditableHotelInTransaction(
    tx: Pick<PrismaService, 'hotel'>,
    slug: string,
  ) {
    const hotel = await tx.hotel.findUnique({ where: { slug } });

    if (!hotel) {
      throw new NotFoundException(`Hotel ${slug} was not found.`);
    }

    return hotel;
  }

  private toRelationData(input: RelationInput, replace = false) {
    return {
      ...(input.destinationSlugs
        ? {
            destinations: {
              [replace ? 'set' : 'connect']: input.destinationSlugs.map(
                (slug) => ({ slug }),
              ),
            },
          }
        : {}),
      ...(input.tourSlugs
        ? {
            tours: {
              [replace ? 'set' : 'connect']: input.tourSlugs.map((slug) => ({
                slug,
              })),
            },
          }
        : {}),
    };
  }

  private toDestinationResponse(
    destination: HotelRecord['destinations'][number],
  ) {
    return {
      slug: destination.slug,
      title: destination.title,
      href: `/destinations/${destination.slug}`,
    };
  }

  private toTourResponse(tour: HotelRecord['tours'][number]) {
    return {
      slug: tour.slug,
      title: tour.title,
      href: `/tours/${tour.slug}`,
      type: tour.type,
      duration: tour.duration,
    };
  }

  private toCardResponse(hotel: HotelCardRecord) {
    return {
      slug: hotel.slug,
      amenities: hotel.amenities,
      alt: hotel.listingAlt,
      badge: hotel.badge ?? undefined,
      image: hotel.listingImage,
      location: hotel.location,
      name: hotel.name,
      price: hotel.price,
      score: hotel.score,
      destinations: hotel.destinations.map((destination) =>
        this.toDestinationResponse(destination),
      ),
      tours: hotel.tours.map((tour) => this.toTourResponse(tour)),
    };
  }

  private toDetailResponse(hotel: HotelRecord) {
    return {
      slug: hotel.slug,
      title: hotel.name,
      name: hotel.name,
      location: hotel.location,
      address: hotel.address,
      price: hotel.price,
      badge: hotel.badge ?? undefined,
      heroImage: hotel.heroImage,
      heroAlt: hotel.heroAlt,
      description: hotel.description,
      gallery: hotel.gallery,
      amenities: hotel.amenities,
      suites: hotel.suites,
      score: hotel.score,
      scoreLabel: hotel.scoreLabel,
      scoreSummary: hotel.scoreSummary,
      reviewScores: hotel.reviewScores,
      reviews: hotel.reviews,
      booking: hotel.booking,
      destinations: hotel.destinations.map((destination) =>
        this.toDestinationResponse(destination),
      ),
      tours: hotel.tours.map((tour) => this.toTourResponse(tour)),
      inventory: hotel.inventoryDays.map((inventoryDay) => ({
        id: inventoryDay.id,
        date: this.toDateString(inventoryDay.date),
        totalRooms: inventoryDay.totalRooms,
        bookedRooms: inventoryDay.bookedRooms,
        remaining: inventoryDay.totalRooms - inventoryDay.bookedRooms,
        status: inventoryDay.status,
      })),
    };
  }

  private validateUniquePayload(
    inventory: UpsertHotelInventoryDto['inventory'],
  ) {
    const ids = new Set<string>();
    const dates = new Set<string>();

    for (const inventoryDay of inventory) {
      if (inventoryDay.id) {
        if (ids.has(inventoryDay.id)) {
          throw new BadRequestException('Duplicate inventory id in payload.');
        }
        ids.add(inventoryDay.id);
      }

      if (dates.has(inventoryDay.date)) {
        throw new BadRequestException('Duplicate inventory date in payload.');
      }
      dates.add(inventoryDay.date);
    }
  }

  private toInventoryDate(date: string) {
    if (!isValidDateOnly(date)) {
      throw new BadRequestException(
        'date must be a valid date in YYYY-MM-DD format',
      );
    }

    return new Date(`${date}T00:00:00.000Z`);
  }

  private toDateString(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
