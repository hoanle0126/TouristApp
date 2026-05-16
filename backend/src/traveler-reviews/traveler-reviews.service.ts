import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTravelerReviewDto } from './dto/create-traveler-review.dto';
import { UpdateTravelerReviewDto } from './dto/update-traveler-review.dto';

@Injectable()
export class TravelerReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const reviews = await this.prisma.travelerReview.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return reviews.map((review) => this.toResponse(review));
  }

  async create(dto: CreateTravelerReviewDto) {
    const review = await this.prisma.travelerReview.create({ data: dto });
    return this.toResponse(review);
  }

  async update(id: string, dto: UpdateTravelerReviewDto) {
    await this.findExisting(id);
    const review = await this.prisma.travelerReview.update({
      data: dto,
      where: { id },
    });
    return this.toResponse(review);
  }

  async remove(id: string) {
    await this.findExisting(id);
    await this.prisma.travelerReview.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async findExisting(id: string) {
    const review = await this.prisma.travelerReview.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Traveler review ${id} was not found.`);
    }

    return review;
  }

  private toResponse(
    review: Awaited<ReturnType<PrismaService['travelerReview']['findUnique']>>,
  ) {
    if (!review) {
      throw new NotFoundException('Traveler review was not found.');
    }

    return {
      id: review.id,
      name: review.name,
      quote: review.quote,
      role: review.role,
      sortOrder: review.sortOrder,
      trip: review.trip,
    };
  }
}
