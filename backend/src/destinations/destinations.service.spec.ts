import { NotFoundException } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

const destinationRecord = {
  id: 'destination_1',
  slug: 'ha-long-bay',
  title: 'Ha Long Bay',
  description: 'Cruise through emerald waters.',
  href: '/destinations/ha-long-bay',
  image: 'https://images.unsplash.com/photo-1',
  alt: 'Limestone islands across Ha Long Bay',
  price: 'From $120',
  rating: 4.8,
  market: 'Vietnam',
  status: 'published',
  heroImage: 'https://images.unsplash.com/photo-2',
  heroAlt: 'Sunrise over Ha Long Bay karsts',
  summary: 'Vietnam’s iconic seascape.',
  intro: ['Sail between limestone towers.'],
  facts: [{ label: 'Best season', value: 'October to April' }],
  spotlight: [{ title: 'Overnight cruise', description: 'Sleep on the bay.' }],
  relatedTours: [
    {
      href: '/tours/ha-long-bay-cruise',
      label: 'Tour',
      meta: '2 days',
      title: 'Ha Long Bay Cruise',
    },
  ],
  relatedHotels: [
    {
      href: '/hotels/ha-long-harbor-hotel',
      label: 'Hotel',
      meta: '4-star',
      title: 'Ha Long Harbor Hotel',
    },
  ],
  tours: [
    {
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
      listingImage: 'https://images.unsplash.com/photo-6',
      listingAlt: 'Boutique hotel pool',
      heroImage: 'https://images.unsplash.com/photo-7',
      heroAlt: 'Riverside suite',
      description: [],
      amenities: [],
      suites: [],
      gallery: [],
      reviewScores: [],
      reviews: [],
      booking: {},
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
      updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    },
  ],
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function createPrismaMock() {
  return {
    destination: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('DestinationsService', () => {
  it('returns published destination cards with frontend-friendly fields', async () => {
    const prisma = createPrismaMock();
    prisma.destination.findMany.mockResolvedValue([destinationRecord]);
    const service = new DestinationsService(prisma as never);

    await expect(service.findAll()).resolves.toEqual([
      expect.objectContaining({
        slug: 'ha-long-bay',
        title: 'Ha Long Bay',
        heroImage: 'https://images.unsplash.com/photo-2',
        relatedTours: [
          {
            href: '/tours/bay-mau-coconut-forest',
            label: 'Small Group',
            meta: '4.5 Hours',
            title: 'Traveling to Bay Mau Coconut Forest',
          },
        ],
      }),
    ]);
    expect(prisma.destination.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'published' },
        include: { hotels: true, tours: true },
        orderBy: { createdAt: 'desc' },
      }),
    );
  });

  it('applies market, search, and per-page filters', async () => {
    const prisma = createPrismaMock();
    prisma.destination.findMany.mockResolvedValue([destinationRecord]);
    const service = new DestinationsService(prisma as never);

    await service.findAll({ market: 'Vietnam', search: 'Ha Long', perPage: 5 });

    expect(prisma.destination.findMany).toHaveBeenCalledWith({
      where: {
        status: 'published',
        market: 'Vietnam',
        OR: [
          { title: { contains: 'Ha Long', mode: 'insensitive' } },
          { description: { contains: 'Ha Long', mode: 'insensitive' } },
          { summary: { contains: 'Ha Long', mode: 'insensitive' } },
        ],
      },
      include: { hotels: true, tours: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });

  it('returns destination detail by slug', async () => {
    const prisma = createPrismaMock();
    prisma.destination.findFirst.mockResolvedValue(destinationRecord);
    const service = new DestinationsService(prisma as never);

    await expect(service.findOne('ha-long-bay')).resolves.toMatchObject({
      slug: 'ha-long-bay',
      facts: [{ label: 'Best season', value: 'October to April' }],
      relatedHotels: [
        {
          href: '/hotels/shining-riverside-hoi-an',
          label: 'Boutique stay',
          meta: 'Hoi An, Vietnam',
          title: 'Shining Riverside Hoi An',
        },
      ],
    });
    expect(prisma.destination.findFirst).toHaveBeenCalledWith({
      where: { slug: 'ha-long-bay', status: 'published' },
      include: { hotels: true, tours: true },
    });
  });

  it('throws NotFoundException when destination is missing or unpublished', async () => {
    const prisma = createPrismaMock();
    prisma.destination.findFirst.mockResolvedValue(null);
    const service = new DestinationsService(prisma as never);

    await expect(service.findOne('missing-destination')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a destination', async () => {
    const prisma = createPrismaMock();
    prisma.destination.create.mockResolvedValue(destinationRecord);
    const service = new DestinationsService(prisma as never);

    await expect(
      service.create({
        slug: destinationRecord.slug,
        title: destinationRecord.title,
        description: destinationRecord.description,
        href: destinationRecord.href,
        image: destinationRecord.image,
        alt: destinationRecord.alt,
        price: destinationRecord.price,
        rating: destinationRecord.rating,
        market: destinationRecord.market,
        status: 'published',
        heroImage: destinationRecord.heroImage,
        heroAlt: destinationRecord.heroAlt,
        summary: destinationRecord.summary,
        intro: destinationRecord.intro,
        facts: destinationRecord.facts,
        spotlight: destinationRecord.spotlight,
        relatedTours: destinationRecord.relatedTours,
        relatedHotels: destinationRecord.relatedHotels,
      }),
    ).resolves.toMatchObject({
      slug: destinationRecord.slug,
      title: destinationRecord.title,
    });
  });
});
