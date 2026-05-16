import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';

const eventRecord = {
  id: 'event_1',
  title: 'Heritage Weekend Escape',
  badge: 'Coming up',
  date: 'This weekend',
  location: 'Hoi An',
  description: 'A short escape blending food, culture, and relaxed comfort for couples or families.',
  href: '/tours',
  image: 'https://images.unsplash.com/photo-1528127269322-539801943592',
  alt: 'Hoi An ancient town glowing with lanterns in the evening',
  sortOrder: 10,
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function createPrismaMock() {
  return {
    event: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('EventsService', () => {
  it('returns homepage events ordered for display', async () => {
    const prisma = createPrismaMock();
    prisma.event.findMany.mockResolvedValue([eventRecord]);
    const service = new EventsService(prisma as never);

    await expect(service.findAll()).resolves.toEqual([
      {
        alt: eventRecord.alt,
        badge: eventRecord.badge,
        date: eventRecord.date,
        description: eventRecord.description,
        href: eventRecord.href,
        id: eventRecord.id,
        image: eventRecord.image,
        location: eventRecord.location,
        sortOrder: eventRecord.sortOrder,
        title: eventRecord.title,
      },
    ]);
    expect(prisma.event.findMany).toHaveBeenCalledWith({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  });

  it('creates a new event', async () => {
    const prisma = createPrismaMock();
    prisma.event.create.mockResolvedValue(eventRecord);
    const service = new EventsService(prisma as never);

    await expect(
      service.create({
        alt: eventRecord.alt,
        badge: eventRecord.badge,
        date: eventRecord.date,
        description: eventRecord.description,
        href: eventRecord.href,
        image: eventRecord.image,
        location: eventRecord.location,
        sortOrder: eventRecord.sortOrder,
        title: eventRecord.title,
      }),
    ).resolves.toMatchObject({ id: eventRecord.id, title: eventRecord.title });
  });

  it('updates an existing event', async () => {
    const prisma = createPrismaMock();
    prisma.event.findUnique.mockResolvedValue(eventRecord);
    prisma.event.update.mockResolvedValue({ ...eventRecord, badge: 'Featured', sortOrder: 20 });
    const service = new EventsService(prisma as never);

    await expect(service.update(eventRecord.id, { badge: 'Featured', sortOrder: 20 })).resolves.toMatchObject({
      badge: 'Featured',
      id: eventRecord.id,
      sortOrder: 20,
    });
  });

  it('rejects updating an unknown event', async () => {
    const prisma = createPrismaMock();
    prisma.event.findUnique.mockResolvedValue(null);
    const service = new EventsService(prisma as never);

    await expect(service.update('missing', { title: 'Missing' })).rejects.toThrow(
      new NotFoundException('Event missing was not found.'),
    );
    expect(prisma.event.update).not.toHaveBeenCalled();
  });

  it('deletes an existing event', async () => {
    const prisma = createPrismaMock();
    prisma.event.findUnique.mockResolvedValue(eventRecord);
    const service = new EventsService(prisma as never);

    await expect(service.remove(eventRecord.id)).resolves.toEqual({ deleted: true, id: eventRecord.id });
    expect(prisma.event.delete).toHaveBeenCalledWith({ where: { id: eventRecord.id } });
  });
});
