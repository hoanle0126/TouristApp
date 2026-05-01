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
        'the-soul-of-kyoto',
        'amalfi-coast-discovery',
        'bay-mau-coconut-forest',
      ]),
    );
    expect(seedHotels.map((hotel) => hotel.slug)).toEqual(
      expect.arrayContaining(['shining-riverside-hoi-an', 'aman-tokyo']),
    );
    expect(seedBlogPosts.map((post) => post.slug)).toEqual(
      expect.arrayContaining(['kyotos-new-wave', 'dolomites-quietude']),
    );
  });

  it('keeps destination detail content as rich as the original client mock data', () => {
    const expectations = [
      ['nordic-fjords', 2, 4, 3, 2, 1],
      ['london-essence', 2, 4, 3, 2, 1],
      ['bavarian-trails', 2, 4, 3, 2, 1],
    ] as const;

    for (const [slug, introCount, factCount, spotlightCount, tourCount, hotelCount] of expectations) {
      const destination = seedDestinations.find((item) => item.slug === slug);

      expect(destination?.intro).toHaveLength(introCount);
      expect(destination?.facts).toHaveLength(factCount);
      expect(destination?.spotlight).toHaveLength(spotlightCount);
      expect(destination?.relatedTours).toHaveLength(tourCount);
      expect(destination?.relatedHotels).toHaveLength(hotelCount);
    }
  });

  it('includes enough detail sections for the Kyoto journal detail layout', () => {
    const kyotoPost = seedBlogPosts.find((post) => post.slug === 'kyotos-new-wave');

    expect(kyotoPost?.sections).toHaveLength(3);
  });

  it('includes enough gallery and booking data for the Shining Riverside detail layout', () => {
    const shiningRiverside = seedHotels.find((hotel) => hotel.slug === 'shining-riverside-hoi-an');

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
      expect(tour.gallery.length).toBeGreaterThanOrEqual(1);
      expect(tour.gallery[0]).toMatchObject({ layout: 'portrait' });
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
