import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return events.map((event) => this.toResponse(event));
  }

  async create(dto: CreateEventDto) {
    const event = await this.prisma.event.create({ data: dto });
    return this.toResponse(event);
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findExisting(id);
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
    };
  }
}
