import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { TourDepartureInputDto } from './dto/upsert-tour-departures.dto';
import { ToursService } from './tours.service';

const tourRecord = {
  id: 'tour_1',
  slug: 'bay-mau-coconut-forest',
  title: 'Traveling to Bay Mau Coconut Forest',
  badge: 'Featured',
  type: 'Small Group',
  duration: '4.5 Hours',
  guests: 'Max 12 Guests',
  price: '$45',
  availability: 'Daily',
  description: ['Travel through Cam Thanh waterways.'],
  shortDescription: 'Glide through Hoi An coconut waterways.',
  image: 'https://images.unsplash.com/photo-1',
  heroImage: 'https://images.unsplash.com/photo-2',
  subtitle: 'Discover Hoi An hidden water world.',
  highlights: [
    {
      icon: 'boat',
      title: 'Bamboo Basket Boat',
      description: 'Navigate waterways.',
    },
  ],
  itinerary: [
    { title: 'Pick-up & Arrival', description: 'Depart from hotel.' },
  ],
  gallery: [
    {
      image: 'https://images.unsplash.com/photo-4',
      layout: 'portrait',
    },
  ],
  inclusions: ['Guide'],
  exclusions: ['Personal expenses'],
  destinationId: 'destination_1',
  destination: {
    id: 'destination_1',
    slug: 'hoi-an',
    title: 'Hoi An Ancient Town',
    description: 'Lantern-lit lanes and riverside cafes.',
    image: 'https://images.unsplash.com/photo-5',
    heroImage: 'https://images.unsplash.com/photo-6',
    summary: 'A heritage town for food walks.',
    intro: [],
    facts: [],
    spotlight: [],
    createdAt: new Date('2026-04-30T00:00:00.000Z'),
    updatedAt: new Date('2026-04-30T00:00:00.000Z'),
  },
  departures: [
    {
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      capacity: 12,
      booked: 4,
      status: 'open',
      createdAt: new Date('2026-04-30T00:00:00.000Z'),
      updatedAt: new Date('2026-04-30T00:00:00.000Z'),
    },
  ],
  hotels: [
    {
      id: 'hotel_1',
      slug: 'shining-riverside-hoi-an',
      name: 'Shining Riverside Hoi An',
      location: 'Hoi An, Vietnam',
      address: '08 Nguyen Phuc Chu',
      price: 'From $145',
      badge: 'Boutique stay',
      status: 'published',
      listingImage: 'https://images.unsplash.com/photo-7',
      heroImage: 'https://images.unsplash.com/photo-8',
      description: [],
      amenities: [],
      suites: [],
      gallery: [],
      booking: {},
      createdAt: new Date('2026-04-30T00:00:00.000Z'),
      updatedAt: new Date('2026-04-30T00:00:00.000Z'),
    },
  ],
  createdAt: new Date('2026-04-30T00:00:00.000Z'),
  updatedAt: new Date('2026-04-30T00:00:00.000Z'),
};

function createPrismaMock() {
  const prisma = {
    tour: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tourDeparture: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation((callback) => callback(prisma));
  return prisma;
}

describe('ToursService', () => {
  it('rejects invalid calendar departure dates at DTO validation', async () => {
    const dto = Object.assign(new TourDepartureInputDto(), {
      date: '2026-02-31',
      capacity: 12,
      status: 'open',
    });

    await expect(validate(dto)).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'date' })]),
    );
  });

  it('returns frontend-friendly tour cards', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([tourRecord]);
    const service = new ToursService(prisma as never);

    await expect(service.findAll()).resolves.toEqual([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Traveling to Bay Mau Coconut Forest',
        badge: 'Featured',
        duration: '4.5 Hours',
        guests: 'Max 12 Guests',
        price: '$45',
        description: 'Glide through Hoi An coconut waterways.',
        image: 'https://images.unsplash.com/photo-1',
              destination: {
          slug: 'hoi-an',
          title: 'Hoi An Ancient Town',
          href: '/destinations/hoi-an',
        },
        hotels: [
          {
            slug: 'shining-riverside-hoi-an',
            name: 'Shining Riverside Hoi An',
            href: '/hotels/shining-riverside-hoi-an',
            location: 'Hoi An, Vietnam',
            price: 'From $145',
          },
        ],
      },
    ]);
  });

  it('rejects updating a departure capacity lower than existing booked seats', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValueOnce(tourRecord);
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({
        id: 'departure_1',
        tourId: 'tour_1',
        date: new Date('2026-06-12T00:00:00.000Z'),
        capacity: 12,
        booked: 4,
        status: 'open',
      })
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1' });
    prisma.tourDeparture.updateMany.mockResolvedValueOnce({ count: 0 });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          {
            id: 'departure_1',
            date: '2026-06-12',
            capacity: 3,
            status: 'open',
          },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'Capacity cannot be lower than current bookings.',
      ),
    );
    expect(prisma.tourDeparture.update).not.toHaveBeenCalled();
    expect(prisma.tourDeparture.upsert).not.toHaveBeenCalled();
  });

  it('rejects no-id departure date update when capacity is lower than existing booked seats', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValueOnce(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValueOnce({
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      capacity: 12,
      booked: 4,
      status: 'open',
    });
    prisma.tourDeparture.updateMany.mockResolvedValueOnce({ count: 0 });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [{ date: '2026-06-12', capacity: 3, status: 'open' }],
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'Capacity cannot be lower than current bookings.',
      ),
    );
    expect(prisma.tourDeparture.update).not.toHaveBeenCalled();
    expect(prisma.tourDeparture.create).not.toHaveBeenCalled();
    expect(prisma.tourDeparture.upsert).not.toHaveBeenCalled();
  });

  it('rejects a departure id that belongs to another tour without writing', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValueOnce(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValueOnce({
      id: 'departure_other',
      tourId: 'tour_other',
      date: new Date('2026-06-13T00:00:00.000Z'),
      capacity: 12,
      booked: 0,
      status: 'open',
    });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          {
            id: 'departure_other',
            date: '2026-06-13',
            capacity: 12,
            status: 'open',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.tourDeparture.update).not.toHaveBeenCalled();
    expect(prisma.tourDeparture.upsert).not.toHaveBeenCalled();
  });

  it('rolls back batch departure updates when a later row is invalid', async () => {
    const prisma = createPrismaMock();
    const writes: unknown[] = [];
    const tx = {
      tour: { findUnique: jest.fn().mockResolvedValue(tourRecord) },
      tourDeparture: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce({
            id: 'departure_1',
            tourId: 'tour_1',
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          })
          .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1' })
          .mockResolvedValueOnce({
            id: 'departure_2',
            tourId: 'tour_1',
            date: new Date('2026-06-13T00:00:00.000Z'),
            capacity: 12,
            booked: 6,
            status: 'open',
          })
          .mockResolvedValueOnce({ id: 'departure_2', tourId: 'tour_1' }),
        update: jest.fn(),
        updateMany: jest.fn().mockImplementation((args) => {
          writes.push(args);
          return Promise.resolve({
            count: args.where.id === 'departure_1' ? 1 : 0,
          });
        }),
        upsert: jest.fn(),
      },
    };
    prisma.$transaction.mockImplementationOnce(async (callback) => {
      writes.length = 0;
      try {
        return await callback(tx);
      } catch (error) {
        writes.length = 0;
        throw error;
      }
    });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          {
            id: 'departure_1',
            date: '2026-06-12',
            capacity: 16,
            status: 'open',
          },
          {
            id: 'departure_2',
            date: '2026-06-13',
            capacity: 5,
            status: 'open',
          },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'Capacity cannot be lower than current bookings.',
      ),
    );
    expect(tx.tourDeparture.updateMany).toHaveBeenCalledTimes(2);
    expect(writes).toEqual([]);
    expect(prisma.tour.findUnique).not.toHaveBeenCalledTimes(2);
  });

  it('rejects invalid calendar departure dates before writing', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValueOnce(tourRecord);
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [{ date: '2026-02-31', capacity: 12, status: 'open' }],
      }),
    ).rejects.toThrow(
      new BadRequestException('date must be a valid date in YYYY-MM-DD format'),
    );
    expect(prisma.tourDeparture.findUnique).not.toHaveBeenCalled();
    expect(prisma.tourDeparture.create).not.toHaveBeenCalled();
    expect(prisma.tourDeparture.update).not.toHaveBeenCalled();
  });

  it('does not allow payload booked seats to affect departure writes', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique
      .mockResolvedValueOnce(tourRecord)
      .mockResolvedValueOnce({
        ...tourRecord,
        departures: [
          {
            id: 'departure_2',
            tourId: 'tour_1',
            date: new Date('2026-06-13T00:00:00.000Z'),
            capacity: 12,
            booked: 0,
            status: 'open',
            createdAt: new Date('2026-04-30T00:00:00.000Z'),
            updatedAt: new Date('2026-04-30T00:00:00.000Z'),
          },
        ],
      });
    prisma.tourDeparture.findUnique.mockResolvedValueOnce(null);
    prisma.tourDeparture.create.mockResolvedValueOnce({});
    const service = new ToursService(prisma as never);

    await service.upsertDepartures('bay-mau-coconut-forest', {
      departures: [
        {
          date: '2026-06-13',
          capacity: 12,
          status: 'open',
          booked: 9,
        } as never,
      ],
    });

    expect(prisma.tourDeparture.create).toHaveBeenCalledWith({
      data: expect.not.objectContaining({ booked: 9 }),
    });
    expect(prisma.tourDeparture.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ booked: 0 }),
    });
  });

  it('rejects concurrent id capacity reductions below current bookings', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValueOnce(tourRecord);
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({
        id: 'departure_1',
        tourId: 'tour_1',
        date: new Date('2026-06-12T00:00:00.000Z'),
        capacity: 12,
        booked: 4,
        status: 'open',
      })
      .mockResolvedValueOnce(null);
    prisma.tourDeparture.updateMany.mockResolvedValueOnce({ count: 0 });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          {
            id: 'departure_1',
            date: '2026-06-12',
            capacity: 4,
            status: 'open',
          },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'Capacity cannot be lower than current bookings.',
      ),
    );
  });

  it('rejects id departure updates to an existing date for the same tour', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValueOnce(tourRecord);
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({
        id: 'departure_1',
        tourId: 'tour_1',
        date: new Date('2026-06-12T00:00:00.000Z'),
        capacity: 12,
        booked: 4,
        status: 'open',
      })
      .mockResolvedValueOnce({ id: 'departure_2', tourId: 'tour_1' });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          {
            id: 'departure_1',
            date: '2026-06-13',
            capacity: 12,
            status: 'open',
          },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException('Inventory date already exists.'),
    );
    expect(prisma.tourDeparture.update).not.toHaveBeenCalled();
  });

  it('rejects duplicate departure dates before writing', async () => {
    const prisma = createPrismaMock();
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          { date: '2026-06-12', capacity: 12, status: 'open' },
          { date: '2026-06-12', capacity: 14, status: 'open' },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException('Duplicate inventory date in payload.'),
    );
    expect(prisma.tour.findUnique).not.toHaveBeenCalled();
  });

  it('upserts departures and returns detail with remaining seats', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique
      .mockResolvedValueOnce(tourRecord)
      .mockResolvedValueOnce({
        ...tourRecord,
        departures: [
          {
            id: 'departure_1',
            tourId: 'tour_1',
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 16,
            booked: 4,
            status: 'open',
            createdAt: new Date('2026-04-30T00:00:00.000Z'),
            updatedAt: new Date('2026-04-30T00:00:00.000Z'),
          },
        ],
      });
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({
        id: 'departure_1',
        tourId: 'tour_1',
        date: new Date('2026-06-12T00:00:00.000Z'),
        capacity: 12,
        booked: 4,
        status: 'open',
      })
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1' });
    prisma.tourDeparture.updateMany.mockResolvedValueOnce({ count: 1 });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          {
            id: 'departure_1',
            date: '2026-06-12',
            capacity: 16,
            status: 'open',
          },
        ],
      }),
    ).resolves.toMatchObject({
      departures: [
        {
          id: 'departure_1',
          date: '2026-06-12',
          capacity: 16,
          booked: 4,
          remaining: 12,
          status: 'open',
        },
      ],
    });
  });

  it('filters tours by destination, hotel, type, duration, and query', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([tourRecord]);
    const service = new ToursService(prisma as never);

    await service.findAll({
      destination: 'hoi-an',
      hotel: 'shining-riverside-hoi-an',
      type: 'Small Group',
      duration: 'Hours',
      search: 'coconut',
      perPage: 5,
      sort: 'newest',
    });

    expect(prisma.tour.findMany).toHaveBeenCalledWith({
      where: {
        destination: { slug: 'hoi-an' },
        hotels: { some: { slug: 'shining-riverside-hoi-an' } },
        type: { contains: 'Small Group', mode: 'insensitive' },
        duration: { contains: 'Hours', mode: 'insensitive' },
        OR: [
          { title: { contains: 'coconut', mode: 'insensitive' } },
          { shortDescription: { contains: 'coconut', mode: 'insensitive' } },
          { subtitle: { contains: 'coconut', mode: 'insensitive' } },
        ],
      },
      include: { destination: true, hotels: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });

  it('returns tour detail by slug', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    const service = new ToursService(prisma as never);

    const detail = await service.findOne('bay-mau-coconut-forest');

    expect(detail).not.toHaveProperty('curatorImage');
    expect(detail).toMatchObject({
      slug: 'bay-mau-coconut-forest',
      description: ['Travel through Cam Thanh waterways.'],
      highlights: [
        {
          icon: 'boat',
          title: 'Bamboo Basket Boat',
          description: 'Navigate waterways.',
        },
      ],
      destination: {
        slug: 'hoi-an',
        title: 'Hoi An Ancient Town',
        href: '/destinations/hoi-an',
      },
      hotels: [
        {
          slug: 'shining-riverside-hoi-an',
          name: 'Shining Riverside Hoi An',
          href: '/hotels/shining-riverside-hoi-an',
          location: 'Hoi An, Vietnam',
          price: 'From $145',
        },
      ],
    });
  });

  it('creates a tour by connecting one destination slug', async () => {
    const prisma = createPrismaMock();
    prisma.tour.create.mockResolvedValue(tourRecord);
    const service = new ToursService(prisma as never);

    await service.create({
      slug: 'bay-mau-coconut-forest',
      title: 'Traveling to Bay Mau Coconut Forest',
      badge: 'Featured',
      type: 'Small Group',
      duration: '4.5 Hours',
      guests: 'Max 12 Guests',
      price: '$45',
      availability: 'Daily',
      description: ['Travel through Cam Thanh waterways.'],
      shortDescription: 'Glide through Hoi An coconut waterways.',
      image: 'https://images.unsplash.com/photo-1',
          heroImage: 'https://images.unsplash.com/photo-2',
                  subtitle: 'Discover Hoi An hidden water world.',
      highlights: [
        {
          icon: 'boat',
          title: 'Bamboo Basket Boat',
          description: 'Navigate waterways.',
        },
      ],
      itinerary: [
        { title: 'Pick-up & Arrival', description: 'Depart from hotel.' },
      ],
      gallery: [
        {
          image: 'https://images.unsplash.com/photo-4',
              layout: 'portrait',
        },
      ],
      inclusions: ['Guide'],
      exclusions: ['Personal expenses'],
      destinationSlug: 'hoi-an',
    });

    expect(prisma.tour.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        destination: { connect: { slug: 'hoi-an' } },
      }),
      include: expect.any(Object),
    });
  });

  it('updates a tour by replacing its destination connection', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tour.update.mockResolvedValue({
      ...tourRecord,
      destination: {
        ...tourRecord.destination,
        slug: 'da-nang',
        title: 'Da Nang',
      },
    });
    const service = new ToursService(prisma as never);

    await service.update('bay-mau-coconut-forest', {
      destinationSlug: 'da-nang',
    });

    expect(prisma.tour.update).toHaveBeenCalledWith({
      where: { slug: 'bay-mau-coconut-forest' },
      data: expect.objectContaining({
        destination: { connect: { slug: 'da-nang' } },
      }),
      include: expect.any(Object),
    });
  });

  it('throws NotFoundException when tour is missing', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(null);
    const service = new ToursService(prisma as never);

    await expect(service.findOne('missing-tour')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a tour', async () => {
    const prisma = createPrismaMock();
    prisma.tour.create.mockResolvedValue(tourRecord);
    const service = new ToursService(prisma as never);

    await expect(
      service.create({
        slug: tourRecord.slug,
        title: tourRecord.title,
        badge: 'Featured',
        type: tourRecord.type,
        duration: tourRecord.duration,
        guests: tourRecord.guests,
        price: tourRecord.price,
        availability: tourRecord.availability,
        description: tourRecord.description,
        shortDescription: tourRecord.shortDescription,
        image: tourRecord.image,
        heroImage: tourRecord.heroImage,
        subtitle: tourRecord.subtitle,
        highlights: tourRecord.highlights,
        itinerary: tourRecord.itinerary,
        gallery: tourRecord.gallery,
        inclusions: tourRecord.inclusions,
        exclusions: tourRecord.exclusions,
        destinationSlug: tourRecord.destination.slug,
      }),
    ).resolves.toMatchObject({
      slug: tourRecord.slug,
      title: tourRecord.title,
    });
  });
});
