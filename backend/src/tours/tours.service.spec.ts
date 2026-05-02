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
  alt: 'Basket boats in coconut forest',
  heroImage: 'https://images.unsplash.com/photo-2',
  heroAlt: 'Aerial coconut forest',
  curatorImage: 'https://images.unsplash.com/photo-3',
  curatorImageAlt: 'Local tour curator',
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
      alt: 'Fisherman',
      layout: 'portrait',
    },
  ],
  inclusions: ['Guide'],
  exclusions: ['Personal expenses'],
  destinations: [
    {
      id: 'destination_1',
      slug: 'hoi-an',
      title: 'Hoi An Ancient Town',
      description: 'Lantern-lit lanes and riverside cafes.',
      href: '/destinations/hoi-an',
      image: 'https://images.unsplash.com/photo-5',
      alt: 'Lanterns glowing in Hoi An Ancient Town',
      price: 'From $75',
      rating: 4.9,
      market: 'Vietnam',
      status: 'published',
      heroImage: 'https://images.unsplash.com/photo-6',
      heroAlt: 'Hoi An riverside at golden hour',
      summary: 'A heritage town for food walks.',
      intro: [],
      facts: [],
      spotlight: [],
      relatedTours: [],
      relatedHotels: [],
      createdAt: new Date('2026-04-30T00:00:00.000Z'),
      updatedAt: new Date('2026-04-30T00:00:00.000Z'),
    },
  ],
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
      score: 9.4,
      scoreLabel: 'Exceptional',
      scoreSummary: 'Loved for calm riverside views.',
      status: 'published',
      listingImage: 'https://images.unsplash.com/photo-7',
      listingAlt: 'Boutique hotel pool',
      heroImage: 'https://images.unsplash.com/photo-8',
      heroAlt: 'Riverside suite',
      description: [],
      amenities: [],
      suites: [],
      gallery: [],
      reviewScores: [],
      reviews: [],
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
      expect.arrayContaining([
        expect.objectContaining({ property: 'date' }),
      ]),
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
        alt: 'Basket boats in coconut forest',
        destinations: [
          {
            slug: 'hoi-an',
            title: 'Hoi An Ancient Town',
            href: '/destinations/hoi-an',
            market: 'Vietnam',
          },
        ],
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
    prisma.tourDeparture.findUnique.mockResolvedValueOnce({
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      capacity: 12,
      booked: 4,
      status: 'open',
    });
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          { id: 'departure_1', date: '2026-06-12', capacity: 3, status: 'open' },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException('Capacity cannot be lower than current bookings.'),
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
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [{ date: '2026-06-12', capacity: 3, status: 'open' }],
      }),
    ).rejects.toThrow(
      new BadRequestException('Capacity cannot be lower than current bookings.'),
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
          .mockResolvedValueOnce({
            id: 'departure_2',
            tourId: 'tour_1',
            date: new Date('2026-06-13T00:00:00.000Z'),
            capacity: 12,
            booked: 6,
            status: 'open',
          }),
        update: jest.fn().mockImplementation((args) => {
          writes.push(args);
          return Promise.resolve({});
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
          { id: 'departure_1', date: '2026-06-12', capacity: 16, status: 'open' },
          { id: 'departure_2', date: '2026-06-13', capacity: 5, status: 'open' },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException('Capacity cannot be lower than current bookings.'),
    );
    expect(tx.tourDeparture.update).toHaveBeenCalledTimes(1);
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
        { date: '2026-06-13', capacity: 12, status: 'open', booked: 9 } as never,
      ],
    });

    expect(prisma.tourDeparture.create).toHaveBeenCalledWith({
      data: expect.not.objectContaining({ booked: 9 }),
    });
    expect(prisma.tourDeparture.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ booked: 0 }),
    });
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
    prisma.tourDeparture.findUnique.mockResolvedValueOnce({
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      capacity: 12,
      booked: 4,
      status: 'open',
    });
    prisma.tourDeparture.update.mockResolvedValueOnce({});
    const service = new ToursService(prisma as never);

    await expect(
      service.upsertDepartures('bay-mau-coconut-forest', {
        departures: [
          { id: 'departure_1', date: '2026-06-12', capacity: 16, status: 'open' },
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

  it('returns tour detail by slug', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    const service = new ToursService(prisma as never);

    await expect(
      service.findOne('bay-mau-coconut-forest'),
    ).resolves.toMatchObject({
      slug: 'bay-mau-coconut-forest',
      description: ['Travel through Cam Thanh waterways.'],
      highlights: [
        {
          icon: 'boat',
          title: 'Bamboo Basket Boat',
          description: 'Navigate waterways.',
        },
      ],
      destinations: [
        {
          slug: 'hoi-an',
          title: 'Hoi An Ancient Town',
          href: '/destinations/hoi-an',
          market: 'Vietnam',
        },
      ],
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
        alt: tourRecord.alt,
        heroImage: tourRecord.heroImage,
        heroAlt: tourRecord.heroAlt,
        curatorImage: tourRecord.curatorImage,
        curatorImageAlt: tourRecord.curatorImageAlt,
        subtitle: tourRecord.subtitle,
        highlights: tourRecord.highlights,
        itinerary: tourRecord.itinerary,
        gallery: tourRecord.gallery,
        inclusions: tourRecord.inclusions,
        exclusions: tourRecord.exclusions,
      }),
    ).resolves.toMatchObject({
      slug: tourRecord.slug,
      title: tourRecord.title,
    });
  });
});
