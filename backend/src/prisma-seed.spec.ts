import {
  seedBlogPosts,
  seedDestinations,
  seedHotels,
  seedTours,
} from '../prisma/seed';

describe('Prisma seed data', () => {
  it('includes client mock content for public catalog pages', () => {
    expect(seedDestinations.map((destination) => destination.slug)).toEqual(
      expect.arrayContaining([
        'nordic-fjords',
        'london-essence',
        'bavarian-trails',
      ]),
    );
    expect(seedTours.map((tour) => tour.slug)).toEqual(
      expect.arrayContaining([
        'bay-mau-coconut-forest',
        'hanoi-ninh-binh-heritage-loop',
        'nordic-fjords-scenic-expedition',
      ]),
    );
    expect(seedHotels.map((hotel) => hotel.slug)).toEqual(
      expect.arrayContaining(['shining-riverside-hoi-an', 'aman-tokyo']),
    );
    expect(seedBlogPosts.map((post) => post.slug)).toEqual(
      expect.arrayContaining(['hoi-an-lantern-mornings', 'nordic-fjords-light-guide']),
    );
  });

  it('keeps destination detail content as rich as the original client mock data', () => {
    const expectations = [
      ['nordic-fjords', 2, 4, 3],
      ['london-essence', 2, 4, 3],
      ['bavarian-trails', 2, 4, 3],
    ] as const;

    for (const [slug, introCount, factCount, spotlightCount] of expectations) {
      const destination = seedDestinations.find((item) => item.slug === slug);

      expect(destination?.intro).toHaveLength(introCount);
      expect(destination?.facts).toHaveLength(factCount);
      expect(destination?.spotlight).toHaveLength(spotlightCount);
    }
  });

  it('includes enough detail content for every published journal detail page', () => {
    for (const post of seedBlogPosts) {
      expect(post.sections).toHaveLength(3);
      expect(post.secondaryFeature).toMatchObject({
        title: expect.any(String),
        body: expect.any(String),
        image: { image: expect.any(String) },
      });
    }
  });

  it('enriches every seeded journal post with discovery metadata and editorial cross-links', () => {
    for (const post of seedBlogPosts) {
      expect(post.image).toContain('images.unsplash.com');
      expect(post.heroImage).toContain('images.unsplash.com');
      expect(post.inlineImage).toMatchObject({
        image: expect.stringContaining('images.unsplash.com'),
      });
      expect(post.secondaryFeature).toMatchObject({
        image: {
          image: expect.stringContaining('images.unsplash.com'),
        },
      });
      expect(post.seo).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        ogImage: expect.stringContaining('images.unsplash.com'),
      });
      expect(post.relatedPosts).toHaveLength(3);
      expect(
        post.relatedPosts.every((relatedPost) => relatedPost.href !== `/blog/${post.slug}`),
      ).toBe(true);
      expect(
        post.mentionedDestinationSlugs.length +
          post.mentionedTourSlugs.length +
          post.mentionedHotelSlugs.length,
      ).toBeGreaterThan(0);
    }
  });

  it('includes enough gallery and booking data for the Shining Riverside detail layout', () => {
    const shiningRiverside = seedHotels.find(
      (hotel) => hotel.slug === 'shining-riverside-hoi-an',
    );

    expect(shiningRiverside?.gallery).toHaveLength(2);
    expect(shiningRiverside?.booking).toMatchObject({
      checkIn: 'May 24',
      checkOut: 'May 27',
      nights: '3 Nights',
      travelers: '2 Adults',
    });
  });

  it('includes gallery imagery for every seeded tour detail page', () => {
    for (const tour of seedTours) {
      expect(tour.gallery.length).toBeGreaterThanOrEqual(3);
      expect(tour.gallery.some((item) => item.layout === 'portrait')).toBe(true);
      expect(tour.gallery.some((item) => item.layout === 'landscape')).toBe(true);
    }
  });

  it('seeds generic open tour departures without booked counts', () => {
    for (const tour of seedTours) {
      expect(tour.departures).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            date: new Date('2026-06-15T00:00:00.000Z'),
            booked: 0,
            status: 'open',
          }),
          expect.objectContaining({
            date: new Date('2026-06-22T00:00:00.000Z'),
            booked: 0,
            status: 'open',
          }),
          expect.objectContaining({
            date: new Date('2026-06-29T00:00:00.000Z'),
            booked: 0,
            status: 'open',
          }),
        ]),
      );
    }
  });

  it('seeds generic open hotel inventory without booked room counts', () => {
    for (const hotel of seedHotels) {
      expect(hotel.inventory).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            date: new Date('2026-06-15T00:00:00.000Z'),
            bookedRooms: 0,
            status: 'open',
          }),
          expect.objectContaining({
            date: new Date('2026-06-16T00:00:00.000Z'),
            bookedRooms: 0,
            status: 'open',
          }),
          expect.objectContaining({
            date: new Date('2026-06-17T00:00:00.000Z'),
            bookedRooms: 0,
            status: 'open',
          }),
        ]),
      );
    }
  });

  it('does not seed fake customer bookings from cart or payment mockups', () => {
    const serializedSeed = JSON.stringify({
      seedBlogPosts,
      seedDestinations,
      seedHotels,
      seedTours,
    });

    expect(serializedSeed).not.toContain('referenceNumber');
    expect(serializedSeed).not.toContain('paymentStatus');
    expect(serializedSeed).not.toContain('primaryTraveler');
  });
});
