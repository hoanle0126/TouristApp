import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

type HotelRecord = Prisma.HotelGetPayload<{
  include: { destinations: true; tours: true };
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
      include: { destinations: true, tours: true },
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
      include: { destinations: true, tours: true },
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
      include: { destinations: true, tours: true },
    });

    return this.toDetailResponse(hotel);
  }

  async remove(slug: string) {
    await this.findEditableHotel(slug);
    await this.prisma.hotel.delete({ where: { slug } });
    return { deleted: true, slug };
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
    const hotel = await this.prisma.hotel.findUnique({ where: { slug } });

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
      href: destination.href,
      market: destination.market,
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

  private toCardResponse(hotel: HotelRecord) {
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
    };
  }
}
