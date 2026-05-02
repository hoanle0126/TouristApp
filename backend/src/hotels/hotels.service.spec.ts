import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HotelsService } from './hotels.service';

const destinationRecord = {
  id: 'destination_1',
  slug: 'hoi-an',
  title: 'Hoi An Ancient Town',
  description: 'Lantern-lit lanes.',
  href: '/destinations/hoi-an',
  image: 'https://images.unsplash.com/photo-1',
  alt: 'Hoi An lanterns',
  price: 'From $75',
  rating: 4.9,
  market: 'Vietnam',
  status: 'published',
  heroImage: 'https://images.unsplash.com/photo-2',
  heroAlt: 'Hoi An riverside',
  summary: 'A heritage town.',
  intro: [],
  facts: [],
  spotlight: [],
  relatedTours: [],
  relatedHotels: [],
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

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
  image: 'https://images.unsplash.com/photo-3',
  alt: 'Basket boats in coconut forest',
  heroImage: 'https://images.unsplash.com/photo-4',
  heroAlt: 'Aerial coconut forest',
  curatorImage: 'https://images.unsplash.com/photo-5',
  curatorImageAlt: 'Local tour curator',
  subtitle: 'Discover Hoi An hidden water world.',
  highlights: [],
  itinerary: [],
  gallery: [],
  inclusions: [],
  exclusions: [],
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

const hotelRecord = {
  id: 'hotel_1',
  slug: 'shining-riverside-hoi-an',
  name: 'Shining Riverside Hoi An',
  location: 'Hoi An, Vietnam',
  address: '08 Nguyen Phuc Chu, Minh An Ward, Hoi An',
  price: 'From $145',
  badge: 'Boutique stay',
  score: 9.4,
  scoreLabel: 'Exceptional',
  scoreSummary: 'Loved for calm riverside views.',
  status: 'published',
  listingImage: 'https://images.unsplash.com/photo-6',
  listingAlt: 'Boutique hotel pool',
  heroImage: 'https://images.unsplash.com/photo-7',
  heroAlt: 'Riverside boutique hotel suite',
  description: ['A polished riverside base.'],
  amenities: [{ icon: 'pool', title: 'Riverside pool' }],
  suites: [
    {
      name: 'River View Suite',
      price: '$185/night',
      description: 'River views.',
      image: 'https://images.unsplash.com/photo-8',
      alt: 'River view suite',
    },
  ],
  gallery: [
    { image: 'https://images.unsplash.com/photo-9', alt: 'Hotel pool' },
  ],
  reviewScores: [{ label: 'Cleanliness', score: 9.6 }],
  reviews: [
    {
      author: 'Maya Tran',
      initials: 'MT',
      quote: 'Wonderful stay.',
      stayed: 'Stayed 3 nights',
    },
  ],
  booking: {
    checkIn: '2026-06-12',
    checkOut: '2026-06-15',
    fee: '$18 taxes & fees',
    nightlyTotal: '$145/night',
    nights: 3,
    rating: 4.9,
    travelers: '2 travelers',
    total: '$453 total',
  },
  inventoryDays: [
    {
      id: 'inventory_1',
      hotelId: 'hotel_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      totalRooms: 10,
      bookedRooms: 3,
      status: 'open',
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
      updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    },
  ],
  destinations: [destinationRecord],
  tours: [tourRecord],
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function createPrismaMock() {
  const prisma = {
    hotel: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    hotelInventoryDay: {
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation((callback) => callback(prisma));
  return prisma;
}

describe('HotelsService', () => {
  it('returns published hotel cards with relation summaries', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findMany.mockResolvedValue([hotelRecord]);
    const service = new HotelsService(prisma as never);

    await expect(service.findAll()).resolves.toEqual([
      expect.objectContaining({
        slug: 'shining-riverside-hoi-an',
        amenities: [{ icon: 'pool', title: 'Riverside pool' }],
        alt: 'Boutique hotel pool',
        image: 'https://images.unsplash.com/photo-6',
        destinations: [
          {
            slug: 'hoi-an',
            title: 'Hoi An Ancient Town',
            href: '/destinations/hoi-an',
            market: 'Vietnam',
          },
        ],
        tours: [
          {
            slug: 'bay-mau-coconut-forest',
            title: 'Traveling to Bay Mau Coconut Forest',
            href: '/tours/bay-mau-coconut-forest',
            type: 'Small Group',
            duration: '4.5 Hours',
          },
        ],
      }),
    ]);
  });

  it('rejects updating totalRooms lower than existing bookedRooms', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findUnique.mockResolvedValueOnce(hotelRecord);
    prisma.hotelInventoryDay.findUnique.mockResolvedValueOnce({
      id: 'inventory_1',
      hotelId: 'hotel_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      totalRooms: 10,
      bookedRooms: 3,
      status: 'open',
    });
    const service = new HotelsService(prisma as never);

    await expect(
      service.upsertInventory('shining-riverside-hoi-an', {
        inventory: [
          { id: 'inventory_1', date: '2026-06-12', totalRooms: 2, status: 'open' },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException('Capacity cannot be lower than current bookings.'),
    );
    expect(prisma.hotelInventoryDay.update).not.toHaveBeenCalled();
    expect(prisma.hotelInventoryDay.upsert).not.toHaveBeenCalled();
  });

  it('rejects an inventory day id that belongs to another hotel without writing', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findUnique.mockResolvedValueOnce(hotelRecord);
    prisma.hotelInventoryDay.findUnique.mockResolvedValueOnce({
      id: 'inventory_other',
      hotelId: 'hotel_other',
      date: new Date('2026-06-13T00:00:00.000Z'),
      totalRooms: 10,
      bookedRooms: 0,
      status: 'open',
    });
    const service = new HotelsService(prisma as never);

    await expect(
      service.upsertInventory('shining-riverside-hoi-an', {
        inventory: [
          {
            id: 'inventory_other',
            date: '2026-06-13',
            totalRooms: 10,
            status: 'open',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.hotelInventoryDay.update).not.toHaveBeenCalled();
    expect(prisma.hotelInventoryDay.upsert).not.toHaveBeenCalled();
  });

  it('rolls back batch inventory updates when a later row is invalid', async () => {
    const prisma = createPrismaMock();
    const writes: unknown[] = [];
    const tx = {
      hotel: { findUnique: jest.fn().mockResolvedValue(hotelRecord) },
      hotelInventoryDay: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce({
            id: 'inventory_1',
            hotelId: 'hotel_1',
            date: new Date('2026-06-12T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 3,
            status: 'open',
          })
          .mockResolvedValueOnce({
            id: 'inventory_2',
            hotelId: 'hotel_1',
            date: new Date('2026-06-13T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 6,
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
    const service = new HotelsService(prisma as never);

    await expect(
      service.upsertInventory('shining-riverside-hoi-an', {
        inventory: [
          { id: 'inventory_1', date: '2026-06-12', totalRooms: 12, status: 'open' },
          { id: 'inventory_2', date: '2026-06-13', totalRooms: 5, status: 'open' },
        ],
      }),
    ).rejects.toThrow(
      new BadRequestException('Capacity cannot be lower than current bookings.'),
    );
    expect(tx.hotelInventoryDay.update).toHaveBeenCalledTimes(1);
    expect(writes).toEqual([]);
    expect(prisma.hotel.findFirst).not.toHaveBeenCalled();
  });

  it('upserts inventory and returns detail with remaining rooms', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findUnique.mockResolvedValueOnce(hotelRecord);
    prisma.hotelInventoryDay.findUnique.mockResolvedValueOnce({
      id: 'inventory_1',
      hotelId: 'hotel_1',
      date: new Date('2026-06-12T00:00:00.000Z'),
      totalRooms: 10,
      bookedRooms: 3,
      status: 'open',
    });
    prisma.hotelInventoryDay.update.mockResolvedValueOnce({});
    prisma.hotel.findFirst.mockResolvedValueOnce({
      ...hotelRecord,
      inventoryDays: [
        {
          id: 'inventory_1',
          hotelId: 'hotel_1',
          date: new Date('2026-06-12T00:00:00.000Z'),
          totalRooms: 12,
          bookedRooms: 3,
          status: 'open',
          createdAt: new Date('2026-05-01T00:00:00.000Z'),
          updatedAt: new Date('2026-05-01T00:00:00.000Z'),
        },
      ],
    });
    const service = new HotelsService(prisma as never);

    await expect(
      service.upsertInventory('shining-riverside-hoi-an', {
        inventory: [
          { id: 'inventory_1', date: '2026-06-12', totalRooms: 12, status: 'open' },
        ],
      }),
    ).resolves.toMatchObject({
      inventory: [
        {
          id: 'inventory_1',
          date: '2026-06-12',
          totalRooms: 12,
          bookedRooms: 3,
          remaining: 9,
          status: 'open',
        },
      ],
    });
  });

  it('applies listing filters', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findMany.mockResolvedValue([hotelRecord]);
    const service = new HotelsService(prisma as never);

    await service.findAll({
      location: 'Hoi An',
      destination: 'hoi-an',
      tour: 'bay-mau-coconut-forest',
      search: 'Riverside',
      perPage: 5,
    });

    expect(prisma.hotel.findMany).toHaveBeenCalledWith({
      where: {
        status: 'published',
        location: { contains: 'Hoi An', mode: 'insensitive' },
        destinations: { some: { slug: 'hoi-an' } },
        tours: { some: { slug: 'bay-mau-coconut-forest' } },
        OR: [
          { name: { contains: 'Riverside', mode: 'insensitive' } },
          { location: { contains: 'Riverside', mode: 'insensitive' } },
          { address: { contains: 'Riverside', mode: 'insensitive' } },
        ],
      },
      include: { destinations: true, tours: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });

  it('returns hotel detail by slug', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    const service = new HotelsService(prisma as never);

    await expect(
      service.findOne('shining-riverside-hoi-an'),
    ).resolves.toMatchObject({
      slug: 'shining-riverside-hoi-an',
      title: 'Shining Riverside Hoi An',
      booking: expect.objectContaining({ nights: 3 }),
      destinations: [
        {
          slug: 'hoi-an',
          title: 'Hoi An Ancient Town',
          href: '/destinations/hoi-an',
          market: 'Vietnam',
        },
      ],
    });
  });

  it('throws NotFoundException when hotel is missing or unpublished', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(null);
    const service = new HotelsService(prisma as never);

    await expect(service.findOne('missing-hotel')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a hotel and connects relations by slug', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.create.mockResolvedValue(hotelRecord);
    const service = new HotelsService(prisma as never);

    await service.create({
      slug: hotelRecord.slug,
      name: hotelRecord.name,
      location: hotelRecord.location,
      address: hotelRecord.address,
      price: hotelRecord.price,
      badge: hotelRecord.badge,
      score: hotelRecord.score,
      scoreLabel: hotelRecord.scoreLabel,
      scoreSummary: hotelRecord.scoreSummary,
      status: 'published',
      listingImage: hotelRecord.listingImage,
      listingAlt: hotelRecord.listingAlt,
      heroImage: hotelRecord.heroImage,
      heroAlt: hotelRecord.heroAlt,
      description: hotelRecord.description,
      amenities: hotelRecord.amenities,
      suites: hotelRecord.suites,
      gallery: hotelRecord.gallery,
      reviewScores: hotelRecord.reviewScores,
      reviews: hotelRecord.reviews,
      booking: hotelRecord.booking,
      destinationSlugs: ['hoi-an'],
      tourSlugs: ['bay-mau-coconut-forest'],
    });

    expect(prisma.hotel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          destinations: { connect: [{ slug: 'hoi-an' }] },
          tours: { connect: [{ slug: 'bay-mau-coconut-forest' }] },
        }),
      }),
    );
  });
});
