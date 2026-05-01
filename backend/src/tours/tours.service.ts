import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

type TourRecord = Prisma.TourGetPayload<{
  include: { destinations: true; hotels: true };
}>;

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const tours = await this.prisma.tour.findMany({
      include: { destinations: true, hotels: true },
      orderBy: { createdAt: 'desc' },
    });
    return tours.map((tour) => this.toCardResponse(tour));
  }

  async findOne(slug: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { slug },
      include: { destinations: true, hotels: true },
    });

    if (!tour) {
      throw new NotFoundException(`Tour ${slug} was not found.`);
    }

    return this.toDetailResponse(tour);
  }

  async create(dto: CreateTourDto) {
    const tour = await this.prisma.tour.create({
      data: dto,
      include: { destinations: true, hotels: true },
    });
    return this.toDetailResponse(tour);
  }

  async update(slug: string, dto: UpdateTourDto) {
    await this.findOne(slug);
    const tour = await this.prisma.tour.update({
      where: { slug },
      data: dto,
      include: { destinations: true, hotels: true },
    });
    return this.toDetailResponse(tour);
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.tour.delete({ where: { slug } });
    return { deleted: true, slug };
  }

  private toCardResponse(tour: TourRecord) {
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
    };
  }
}
