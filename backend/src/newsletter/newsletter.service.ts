import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsletterSubscriberDto } from './dto/create-newsletter-subscriber.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(dto: CreateNewsletterSubscriberDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('This email is already subscribed.');
    }

    const subscriber = await this.prisma.newsletterSubscriber.create({
      data: { email },
    });

    return this.toResponse(subscriber);
  }

  async findAll(query?: string) {
    const trimmed = query?.trim();
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: trimmed
        ? { email: { contains: trimmed, mode: 'insensitive' } }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return subscribers.map((subscriber) => this.toResponse(subscriber));
  }

  async remove(id: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Subscriber ${id} was not found.`);
    }

    await this.prisma.newsletterSubscriber.delete({ where: { id } });
    return { deleted: true, id };
  }

  private toResponse(subscriber: {
    id: string;
    email: string;
    createdAt: Date;
  }) {
    return {
      id: subscriber.id,
      email: subscriber.email,
      createdAt: subscriber.createdAt.toISOString(),
    };
  }
}
