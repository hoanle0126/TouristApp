import { NotFoundException } from '@nestjs/common';
import { BlogsService } from './blogs.service';

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
};

const blogRecord = {
  id: 'blog_1',
  slug: 'hoi-an-riverside-weekend',
  title: 'A Riverside Weekend in Hoi An',
  excerpt: 'A slow three-day guide to Hoi An.',
  category: 'Travel Guide',
  author: 'TouristWeb Editorial',
  status: 'published',
  publishedAt: new Date('2026-04-18T09:00:00.000Z'),
  readingTime: '6 min read',
  image: 'https://images.unsplash.com/photo-8',
  alt: 'Lantern-lit riverside street in Hoi An',
  heroImage: 'https://images.unsplash.com/photo-9',
  heroAlt: 'Hoi An riverside at sunset',
  intro: 'Hoi An rewards travelers who move slowly.',
  meta: 'Plan a relaxed Hoi An weekend.',
  quote:
    'The best Hoi An itinerary leaves enough room for one more riverside coffee.',
  sections: [
    {
      heading: 'Start with the Ancient Town',
      body: ['Walk the heritage lanes early.'],
    },
  ],
  inlineImage: {
    image: 'https://images.unsplash.com/photo-10',
    alt: 'Hoi An old town lanterns',
  },
  secondaryFeature: {
    title: 'Stay close to the river',
    body: 'A riverside boutique hotel keeps the Ancient Town within reach.',
    image: {
      image: 'https://images.unsplash.com/photo-11',
      alt: 'Boutique hotel pool',
    },
  },
  relatedPosts: [
    {
      href: '/blog/vietnam-lantern-season',
      title: 'When to Visit Vietnam for Lantern Nights',
      excerpt: 'How to time your trip.',
      category: 'Seasonal Planning',
      image: 'https://images.unsplash.com/photo-12',
      alt: 'Lanterns glowing at night',
    },
  ],
  seo: {
    title: 'Hoi An Riverside Weekend Guide',
    description: 'A relaxed Hoi An weekend itinerary.',
  },
  mentionedDestinations: [destinationRecord],
  mentionedTours: [tourRecord],
  mentionedHotels: [hotelRecord],
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

function createPrismaMock() {
  return {
    blogPost: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('BlogsService', () => {
  it('returns published blog cards with mention summaries', async () => {
    const prisma = createPrismaMock();
    prisma.blogPost.findMany.mockResolvedValue([blogRecord]);
    const service = new BlogsService(prisma as never);

    await expect(service.findAll()).resolves.toEqual([
      expect.objectContaining({
        slug: 'hoi-an-riverside-weekend',
        href: '/blog/hoi-an-riverside-weekend',
        title: 'A Riverside Weekend in Hoi An',
        date: '2026-04-18T09:00:00.000Z',
        mentionedDestinations: [
          {
            slug: 'hoi-an',
            title: 'Hoi An Ancient Town',
            href: '/destinations/hoi-an',
            market: 'Vietnam',
          },
        ],
        mentionedTours: [
          {
            slug: 'bay-mau-coconut-forest',
            title: 'Traveling to Bay Mau Coconut Forest',
            href: '/tours/bay-mau-coconut-forest',
            type: 'Small Group',
            duration: '4.5 Hours',
          },
        ],
        mentionedHotels: [
          {
            slug: 'shining-riverside-hoi-an',
            name: 'Shining Riverside Hoi An',
            href: '/hotels/shining-riverside-hoi-an',
            location: 'Hoi An, Vietnam',
            price: 'From $145',
          },
        ],
      }),
    ]);
    expect(prisma.blogPost.findMany).toHaveBeenCalledWith({
      where: { status: 'published' },
      include: {
        mentionedDestinations: true,
        mentionedHotels: true,
        mentionedTours: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: undefined,
    });
  });

  it('applies category, relation, search, and per-page filters', async () => {
    const prisma = createPrismaMock();
    prisma.blogPost.findMany.mockResolvedValue([blogRecord]);
    const service = new BlogsService(prisma as never);

    await service.findAll({
      category: 'Travel Guide',
      destination: 'hoi-an',
      tour: 'bay-mau-coconut-forest',
      hotel: 'shining-riverside-hoi-an',
      search: 'Riverside',
      perPage: 5,
    });

    expect(prisma.blogPost.findMany).toHaveBeenCalledWith({
      where: {
        status: 'published',
        category: 'Travel Guide',
        mentionedDestinations: { some: { slug: 'hoi-an' } },
        mentionedTours: { some: { slug: 'bay-mau-coconut-forest' } },
        mentionedHotels: { some: { slug: 'shining-riverside-hoi-an' } },
        OR: [
          { title: { contains: 'Riverside', mode: 'insensitive' } },
          { excerpt: { contains: 'Riverside', mode: 'insensitive' } },
          { intro: { contains: 'Riverside', mode: 'insensitive' } },
        ],
      },
      include: {
        mentionedDestinations: true,
        mentionedHotels: true,
        mentionedTours: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    });
  });

  it('returns blog detail by slug', async () => {
    const prisma = createPrismaMock();
    prisma.blogPost.findFirst.mockResolvedValue(blogRecord);
    const service = new BlogsService(prisma as never);

    await expect(
      service.findOne('hoi-an-riverside-weekend'),
    ).resolves.toMatchObject({
      slug: 'hoi-an-riverside-weekend',
      heroImage: 'https://images.unsplash.com/photo-9',
      sections: [
        {
          heading: 'Start with the Ancient Town',
          body: ['Walk the heritage lanes early.'],
        },
      ],
      mentionedDestinations: [
        {
          slug: 'hoi-an',
          title: 'Hoi An Ancient Town',
          href: '/destinations/hoi-an',
          market: 'Vietnam',
        },
      ],
    });
    expect(prisma.blogPost.findFirst).toHaveBeenCalledWith({
      where: { slug: 'hoi-an-riverside-weekend', status: 'published' },
      include: {
        mentionedDestinations: true,
        mentionedHotels: true,
        mentionedTours: true,
      },
    });
  });

  it('throws NotFoundException when blog is missing or unpublished', async () => {
    const prisma = createPrismaMock();
    prisma.blogPost.findFirst.mockResolvedValue(null);
    const service = new BlogsService(prisma as never);

    await expect(service.findOne('missing-blog')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a blog and connects mentioned relations by slug', async () => {
    const prisma = createPrismaMock();
    prisma.blogPost.create.mockResolvedValue(blogRecord);
    const service = new BlogsService(prisma as never);

    await service.create({
      slug: blogRecord.slug,
      title: blogRecord.title,
      excerpt: blogRecord.excerpt,
      category: blogRecord.category,
      author: blogRecord.author,
      status: 'published',
      publishedAt: '2026-04-18T09:00:00.000Z',
      readingTime: blogRecord.readingTime,
      image: blogRecord.image,
      alt: blogRecord.alt,
      heroImage: blogRecord.heroImage,
      heroAlt: blogRecord.heroAlt,
      intro: blogRecord.intro,
      meta: blogRecord.meta,
      quote: blogRecord.quote,
      sections: blogRecord.sections,
      inlineImage: blogRecord.inlineImage,
      secondaryFeature: blogRecord.secondaryFeature,
      relatedPosts: blogRecord.relatedPosts,
      seo: blogRecord.seo,
      mentionedDestinationSlugs: ['hoi-an'],
      mentionedTourSlugs: ['bay-mau-coconut-forest'],
      mentionedHotelSlugs: ['shining-riverside-hoi-an'],
    });

    expect(prisma.blogPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          publishedAt: new Date('2026-04-18T09:00:00.000Z'),
          mentionedDestinations: { connect: [{ slug: 'hoi-an' }] },
          mentionedTours: { connect: [{ slug: 'bay-mau-coconut-forest' }] },
          mentionedHotels: { connect: [{ slug: 'shining-riverside-hoi-an' }] },
        }),
      }),
    );
  });

  it('updates a blog and replaces mentioned relations by slug', async () => {
    const prisma = createPrismaMock();
    prisma.blogPost.findUnique.mockResolvedValue(blogRecord);
    prisma.blogPost.update.mockResolvedValue(blogRecord);
    const service = new BlogsService(prisma as never);

    await service.update('hoi-an-riverside-weekend', {
      title: 'Updated Hoi An Weekend',
      mentionedDestinationSlugs: [],
      mentionedTourSlugs: ['bay-mau-coconut-forest'],
      mentionedHotelSlugs: ['shining-riverside-hoi-an'],
    });

    expect(prisma.blogPost.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'hoi-an-riverside-weekend' },
        data: expect.objectContaining({
          title: 'Updated Hoi An Weekend',
          mentionedDestinations: { set: [] },
          mentionedTours: { set: [{ slug: 'bay-mau-coconut-forest' }] },
          mentionedHotels: { set: [{ slug: 'shining-riverside-hoi-an' }] },
        }),
      }),
    );
  });
});
