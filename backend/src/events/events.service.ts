import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return events.map((event) => this.toResponse(event));
  }

  async create(dto: CreateEventDto) {
    if (dto.isPopup) {
      await this.prisma.event.updateMany({
        data: { isPopup: false },
      });
    }
    const event = await this.prisma.event.create({ data: dto });
    this.notifyNewsletterAboutEvent(event).catch((error: unknown) => {
      this.logger.error('Failed to send event announcement', error);
    });
    return this.toResponse(event);
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findExisting(id);
    if (dto.isPopup) {
      await this.prisma.event.updateMany({
        where: { id: { not: id } },
        data: { isPopup: false },
      });
    }
    const event = await this.prisma.event.update({ data: dto, where: { id } });
    return this.toResponse(event);
  }

  async remove(id: string) {
    await this.findExisting(id);
    await this.prisma.event.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async findExisting(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event ${id} was not found.`);
    }

    return event;
  }

  private toResponse(event: Awaited<ReturnType<PrismaService['event']['findUnique']>>) {
    if (!event) {
      throw new NotFoundException('Event was not found.');
    }

    return {
      alt: event.alt,
      badge: event.badge,
      date: event.date,
      description: event.description,
      href: event.href,
      id: event.id,
      image: event.image,
      location: event.location,
      sortOrder: event.sortOrder,
      title: event.title,
      isPopup: event.isPopup,
    };
  }

  private async notifyNewsletterAboutEvent(event: {
    title: string;
    badge: string;
    date: string;
    location: string;
    description: string;
    href: string;
  }) {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return;
    }

    const siteUrl = process.env.FRONTEND_ORIGIN ?? undefined;

    const results = await Promise.allSettled(
      subscribers.map((subscriber) =>
        this.mailService.sendEventAnnouncement(subscriber.email, event, siteUrl),
      ),
    );

    const failed = results.filter((result) => result.status === 'rejected').length;
    if (failed > 0) {
      this.logger.warn(
        `Sent event "${event.title}" to ${results.length - failed}/${results.length} subscribers (${failed} failed)`,
      );
    } else {
      this.logger.log(
        `Sent event "${event.title}" to ${results.length} subscribers`,
      );
    }
  }
}
