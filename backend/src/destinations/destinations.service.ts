import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

type DestinationRecord = Prisma.DestinationGetPayload<{
  include: { hotels: true; tours: true };
}>;

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters: { market?: string; search?: string; perPage?: number } = {},
  ) {
    const where: Prisma.DestinationWhereInput = {
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' } },
              {
                description: { contains: filters.search, mode: 'insensitive' },
              },
              { summary: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const destinations = await this.prisma.destination.findMany({
      where,
      include: { hotels: true, tours: true },
      orderBy: { createdAt: 'desc' },
      take: filters.perPage,
    });

    return destinations.map((destination) => this.toResponse(destination));
  }

  async findOne(slug: string) {
    const destination = await this.prisma.destination.findFirst({
      where: { slug },
      include: { hotels: true, tours: true },
    });

    if (!destination) {
      throw new NotFoundException(`Destination ${slug} was not found.`);
    }

    return this.toResponse(destination);
  }

  async create(dto: CreateDestinationDto) {
    const destination = await this.prisma.destination.create({
      data: dto,
      include: { hotels: true, tours: true },
    });
    return this.toResponse(destination);
  }

  async update(slug: string, dto: UpdateDestinationDto) {
    await this.findEditableDestination(slug);
    const destination = await this.prisma.destination.update({
      where: { slug },
      data: dto,
      include: { hotels: true, tours: true },
    });
    return this.toResponse(destination);
  }

  async remove(slug: string) {
    await this.findEditableDestination(slug);
    await this.prisma.destination.delete({ where: { slug } });
    return { deleted: true, slug };
  }

  private async findEditableDestination(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
    });

    if (!destination) {
      throw new NotFoundException(`Destination ${slug} was not found.`);
    }

    return destination;
  }

  private toRelatedTourResponse(tour: DestinationRecord['tours'][number]) {
    return {
      href: `/tours/${tour.slug}`,
      label: tour.type,
      meta: tour.duration,
      title: tour.title,
    };
  }

  private toRelatedHotelResponse(hotel: DestinationRecord['hotels'][number]) {
    return {
      href: `/hotels/${hotel.slug}`,
      label: hotel.badge ?? 'Hotel',
      meta: hotel.location,
      title: hotel.name,
    };
  }

  private toResponse(destination: DestinationRecord) {
    return {
      slug: destination.slug,
      title: destination.title,
      description: destination.description,
      image: destination.image,
      heroImage: destination.heroImage,
      summary: destination.summary,
      intro: destination.intro ?? [],
      facts: destination.facts ?? [],
      spotlight: destination.spotlight ?? [],
      gallery: destination.gallery ?? [],
      relatedTours: destination.tours.map((tour) =>
        this.toRelatedTourResponse(tour),
      ),
      relatedHotels: destination.hotels.map((hotel) =>
        this.toRelatedHotelResponse(hotel),
      ),
    };
  }
}
