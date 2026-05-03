import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AiBookingSummaryService } from './ai-booking-summary.service';
import { BookingsService } from './bookings.service';

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
  description: [],
  shortDescription: 'Glide through Hoi An coconut waterways.',
  image: 'https://images.unsplash.com/photo-tour',
  alt: 'Basket boats in coconut forest',
  heroImage: 'https://images.unsplash.com/photo-tour-hero',
  heroAlt: 'Aerial coconut forest',
  curatorImage: 'https://images.unsplash.com/photo-curator',
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
  listingImage: 'https://images.unsplash.com/photo-hotel',
  listingAlt: 'Boutique hotel pool',
  heroImage: 'https://images.unsplash.com/photo-hotel-hero',
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

const bookingItemRecords = [
  {
    id: 'booking_item_1',
    bookingId: 'booking_1',
    itemType: 'tour',
    tourId: 'tour_1',
    hotelId: null,
    tourDepartureId: 'departure_1',
    snapshotSlug: 'bay-mau-coconut-forest',
    snapshotTitle: 'Traveling to Bay Mau Coconut Forest',
    snapshotImage: 'https://images.unsplash.com/photo-tour',
    snapshotAlt: 'Basket boats in coconut forest',
    snapshotMeta: '4.5 Hours • Max 12 Guests',
    snapshotPriceLabel: '$45',
    date: '2026-06-13',
    checkIn: null,
    checkOut: null,
    guests: '2 travelers',
    nights: null,
    roomType: null,
    quantity: 2,
    unitPrice: new Prisma.Decimal(45),
    lineTotal: new Prisma.Decimal(90),
    currency: 'USD',
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  },
  {
    id: 'booking_item_2',
    bookingId: 'booking_1',
    itemType: 'hotel',
    tourId: null,
    hotelId: 'hotel_1',
    tourDepartureId: null,
    snapshotSlug: 'shining-riverside-hoi-an',
    snapshotTitle: 'Shining Riverside Hoi An',
    snapshotImage: 'https://images.unsplash.com/photo-hotel',
    snapshotAlt: 'Boutique hotel pool',
    snapshotMeta: 'River View Suite • 2 travelers',
    snapshotPriceLabel: 'From $145',
    date: null,
    checkIn: new Date('2026-06-12T00:00:00.000Z'),
    checkOut: new Date('2026-06-15T00:00:00.000Z'),
    guests: '2 travelers',
    nights: 3,
    roomType: 'River View Suite',
    quantity: 1,
    unitPrice: new Prisma.Decimal(390),
    lineTotal: new Prisma.Decimal(390),
    currency: 'USD',
    createdAt: new Date('2026-05-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
  },
];

const bookingRecord = {
  id: 'booking_1',
  bookingCode: 'TW-20260501-SEED',
  fullName: 'Mai Anh Nguyen',
  email: 'mai.anh@example.com',
  phone: '+84 90 123 4567',
  country: 'Vietnam',
  city: 'Da Nang',
  address: '12 Bach Dang Street',
  travelers: 2,
  primaryTravelerName: 'Mai Anh Nguyen',
  primaryTravelerEmail: 'mai.anh@example.com',
  primaryTravelerPhone: '+84 90 123 4567',
  travelerDetails: { adults: 2 },
  startDate: new Date('2026-06-12T00:00:00.000Z'),
  endDate: new Date('2026-06-15T00:00:00.000Z'),
  pickupLocation: 'Shining Riverside Hoi An lobby',
  dropoffLocation: 'Hoi An Ancient Town',
  arrivalFlight: 'VN123',
  specialRequests: 'Vegetarian lunch for one guest.',
  internalNotes: null,
  aiSummary: null,
  paymentMethod: 'credit-card',
  paymentStatus: 'pending',
  status: 'confirmed',
  subtotal: new Prisma.Decimal(480),
  taxesAndFees: new Prisma.Decimal(0),
  total: new Prisma.Decimal(480),
  currency: 'USD',
  items: bookingItemRecords,
  createdAt: new Date('2026-05-01T00:00:00.000Z'),
  updatedAt: new Date('2026-05-01T00:00:00.000Z'),
};

const validBookingInput = {
  fullName: 'Mai Anh Nguyen',
  email: 'mai.anh@example.com',
  phone: '+84 90 123 4567',
  country: 'Vietnam',
  travelers: 2,
  paymentMethod: 'credit-card' as const,
  items: [
    {
      itemType: 'tour' as const,
      slug: 'bay-mau-coconut-forest',
      quantity: 2,
      tourDepartureId: 'departure_1',
    },
  ],
};

function createAiSummaryMock() {
  return {
    generate: jest.fn().mockResolvedValue(null),
  };
}

function createFetchResponse(
  overrides: Partial<{ ok: boolean; status: number; json: () => Promise<unknown> }> = {},
) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ summary: 'Ops summary' }),
    ...overrides,
  };
}

const originalEnv = process.env;
const originalFetch = global.fetch;

beforeEach(() => {
  process.env = { ...originalEnv };
  jest.clearAllMocks();
});

afterEach(() => {
  process.env = originalEnv;
  global.fetch = originalFetch;
});

function createPrismaMock() {
  const prismaMock = {
    booking: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    tour: {
      findUnique: jest.fn(),
    },
    hotel: {
      findFirst: jest.fn(),
    },
    tourDeparture: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    hotelInventoryDay: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $executeRaw: jest.fn().mockResolvedValue(1),
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
  };
  return prismaMock;
}

function createMailMock() {
  return {
    sendBookingConfirmationToUser: jest.fn().mockResolvedValue(undefined),
    sendNewBookingNotificationToAdmin: jest.fn().mockResolvedValue(undefined),
  };
}

describe('AiBookingSummaryService', () => {
  function createSettingsMock(overrides: Partial<{
    getAiProviderRuntimeConfig: jest.Mock;
  }> = {}) {
    return {
      getAiProviderRuntimeConfig: jest.fn(),
      ...overrides,
    };
  }

  it('returns null when provider is disabled', async () => {
    const settings = createSettingsMock({
      getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
        provider: 'openai-compatible',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        enabled: false,
        apiKey: 'sk-test-secret',
      }),
    });
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof global.fetch;
    const service = new AiBookingSummaryService(settings as never);

    await expect(
      service.generate({
        bookingCode: 'TW-20260501-SEED',
        travelers: 2,
        paymentStatus: 'pending',
        items: [],
      }),
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null when provider has no stored api key', async () => {
    const settings = createSettingsMock({
      getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
        provider: 'openai-compatible',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        enabled: true,
        apiKey: null,
      }),
    });
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof global.fetch;
    const service = new AiBookingSummaryService(settings as never);

    await expect(
      service.generate({
        bookingCode: 'TW-20260501-SEED',
        travelers: 2,
        paymentStatus: 'pending',
        items: [],
      }),
    ).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a trimmed summary from the openai-compatible provider response', async () => {
    const settings = createSettingsMock({
      getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
        provider: 'openai-compatible',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        enabled: true,
        apiKey: 'sk-test-secret',
      }),
    });
    const fetchMock = jest.fn().mockResolvedValue(
      createFetchResponse({
        json: async () => ({
          choices: [
            {
              message: {
                content: '  Short ops note  ',
              },
            },
          ],
        }),
      }),
    );
    global.fetch = fetchMock as typeof global.fetch;
    const service = new AiBookingSummaryService(settings as never);

    await expect(
      service.generate({
        bookingCode: 'TW-20260501-SEED',
        travelers: 2,
        paymentStatus: 'pending',
        specialRequests: 'Vegetarian lunch for one guest.',
        items: [
          {
            itemType: 'tour',
            title: 'Traveling to Bay Mau Coconut Forest',
            quantity: 2,
          },
        ],
      }),
    ).resolves.toBe('Short ops note');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'content-type': 'application/json',
          authorization: 'Bearer sk-test-secret',
        }),
        signal: expect.any(AbortSignal),
      }),
    );

    const [, request] = fetchMock.mock.calls[0];
    expect(JSON.parse((request as { body: string }).body)).toMatchObject({
      model: 'gpt-4o-mini',
      messages: expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user' }),
      ]),
    });
  });

  it('returns null when the provider responds with a blank message', async () => {
    const settings = createSettingsMock({
      getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
        provider: 'openai-compatible',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        enabled: true,
        apiKey: 'sk-test-secret',
      }),
    });
    global.fetch = jest.fn().mockResolvedValue(
      createFetchResponse({
        json: async () => ({
          choices: [{ message: { content: '   ' } }],
        }),
      }),
    ) as typeof global.fetch;
    const service = new AiBookingSummaryService(settings as never);

    await expect(
      service.generate({
        bookingCode: 'TW-20260501-SEED',
        travelers: 2,
        paymentStatus: 'pending',
        items: [],
      }),
    ).resolves.toBeNull();
  });

  it('returns null when the provider request fails', async () => {
    const settings = createSettingsMock({
      getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
        provider: 'openai-compatible',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        enabled: true,
        apiKey: 'sk-test-secret',
      }),
    });
    global.fetch = jest.fn().mockRejectedValue(new Error('timeout')) as typeof global.fetch;
    const service = new AiBookingSummaryService(settings as never);
    const loggerSpy = jest.spyOn(service['logger'], 'warn').mockImplementation(() => undefined);

    await expect(
      service.generate({
        bookingCode: 'TW-20260501-SEED',
        travelers: 2,
        paymentStatus: 'pending',
        items: [],
      }),
    ).resolves.toBeNull();
    expect(loggerSpy).toHaveBeenCalledWith(
      'Booking AI summary provider request failed',
      expect.any(String),
    );
    loggerSpy.mockRestore();
  });
});

describe('BookingsService', () => {
  it('creates a booking with tour and hotel snapshot items', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue(['2026-06-12', '2026-06-13', '2026-06-14'].map((date) => ({ id: `inventory_${date}`, hotelId: 'hotel_1', date: new Date(`${date}T00:00:00.000Z`), totalRooms: 5, bookedRooms: 0, status: 'open' })));
    prisma.booking.create.mockResolvedValue(bookingRecord);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.create({
        fullName: 'Mai Anh Nguyen',
        email: 'mai.anh@example.com',
        phone: '+84 90 123 4567',
        country: 'Vietnam',
        city: 'Da Nang',
        address: '12 Bach Dang Street',
        travelers: 2,
        primaryTravelerName: 'Mai Anh Nguyen',
        paymentMethod: 'credit-card',
        startDate: '2026-06-12T00:00:00.000Z',
        endDate: '2026-06-15T00:00:00.000Z',
        pickupLocation: 'Shining Riverside Hoi An lobby',
        items: [
          {
            itemType: 'tour',
            slug: 'bay-mau-coconut-forest',
            quantity: 2,
            tourDepartureId: 'departure_1',
            date: '2026-06-13',
            guests: '2 travelers',
          },
          {
            itemType: 'hotel',
            slug: 'shining-riverside-hoi-an',
            quantity: 1,
            unitPrice: 390,
            checkIn: '2026-06-12',
            checkOut: '2026-06-15',
            nights: 3,
            roomType: 'River View Suite',
            meta: 'River View Suite • 2 travelers',
          },
        ],
      }),
    ).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      totals: { subtotal: 480, total: 480, currency: 'USD' },
      items: [
        expect.objectContaining({
          slug: 'bay-mau-coconut-forest',
          title: 'Traveling to Bay Mau Coconut Forest',
          lineTotal: 90,
        }),
        expect.objectContaining({
          slug: 'shining-riverside-hoi-an',
          title: 'Shining Riverside Hoi An',
          lineTotal: 390,
        }),
      ],
    });

    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fullName: 'Mai Anh Nguyen',
          subtotal: new Prisma.Decimal(480),
          total: new Prisma.Decimal(480),
          items: {
            create: [
              expect.objectContaining({
                itemType: 'tour',
                tourId: 'tour_1',
                snapshotTitle: 'Traveling to Bay Mau Coconut Forest',
                unitPrice: new Prisma.Decimal(45),
                lineTotal: new Prisma.Decimal(90),
              }),
              expect.objectContaining({
                itemType: 'hotel',
                hotelId: 'hotel_1',
                snapshotTitle: 'Shining Riverside Hoi An',
                unitPrice: new Prisma.Decimal(390),
                lineTotal: new Prisma.Decimal(390),
              }),
            ],
          },
        }),
      }),
    );
  });

  it('sends booking emails to the customer and admin after creating a booking', async () => {
    const prisma = createPrismaMock();
    const mail = createMailMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
    });
    const service = new BookingsService(prisma as never, mail as never, createAiSummaryMock() as never);

    await service.create({
      fullName: 'Mai Anh Nguyen',
      email: 'mai.anh@example.com',
      phone: '+84 90 123 4567',
      country: 'Vietnam',
      travelers: 2,
      paymentMethod: 'credit-card',
      items: [
        {
          itemType: 'tour',
          slug: 'bay-mau-coconut-forest',
          quantity: 2,
          tourDepartureId: 'departure_1',
        },
      ],
    });

    expect(mail.sendBookingConfirmationToUser).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingCode: 'TW-20260501-SEED',
        customer: expect.objectContaining({ email: 'mai.anh@example.com' }),
      }),
    );
    expect(mail.sendNewBookingNotificationToAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingCode: 'TW-20260501-SEED',
        customer: expect.objectContaining({ phone: '+84 90 123 4567' }),
      }),
    );
  });

  it('returns the booking when email delivery fails after persistence', async () => {
    const prisma = createPrismaMock();
    const mail = createMailMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
    });
    mail.sendBookingConfirmationToUser.mockRejectedValue(
      new Error('SMTP unavailable'),
    );
    const service = new BookingsService(prisma as never, mail as never, createAiSummaryMock() as never);
    const loggerSpy = jest
      .spyOn(service['logger'], 'error')
      .mockImplementation(() => undefined);

    await expect(
      service.create({
        fullName: 'Mai Anh Nguyen',
        email: 'mai.anh@example.com',
        phone: '+84 90 123 4567',
        country: 'Vietnam',
        travelers: 2,
        paymentMethod: 'credit-card',
        items: [
          {
            itemType: 'tour',
            slug: 'bay-mau-coconut-forest',
            quantity: 2,
            tourDepartureId: 'departure_1',
          },
        ],
      }),
    ).resolves.toMatchObject({ bookingCode: 'TW-20260501-SEED' });
    expect(prisma.booking.create).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(
      'Failed to send booking emails for TW-20260501-SEED',
      expect.any(String),
    );
    loggerSpy.mockRestore();
  });

  it('persists the generated AI summary after booking creation succeeds', async () => {
    const prisma = createPrismaMock();
    const aiSummary = createAiSummaryMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
      aiSummary: null,
    });
    prisma.booking.update.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
      aiSummary: '2 travelers arriving 12 Jun with payment pending.',
    });
    aiSummary.generate.mockResolvedValue('2 travelers arriving 12 Jun with payment pending.');
    const service = new BookingsService(prisma as never, createMailMock() as never, aiSummary as never);

    await expect(service.create(validBookingInput)).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      aiSummary: '2 travelers arriving 12 Jun with payment pending.',
    });

    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: 'booking_1' },
      data: { aiSummary: '2 travelers arriving 12 Jun with payment pending.' },
      include: { items: true },
    });
  });

  it('returns the persisted booking when AI summary generation throws', async () => {
    const prisma = createPrismaMock();
    const aiSummary = createAiSummaryMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
      aiSummary: null,
    });
    aiSummary.generate.mockRejectedValue(new Error('provider timeout'));
    const service = new BookingsService(prisma as never, createMailMock() as never, aiSummary as never);

    await expect(service.create(validBookingInput)).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      aiSummary: null,
    });
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('does not persist an AI summary when the generator returns null', async () => {
    const prisma = createPrismaMock();
    const aiSummary = createAiSummaryMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
      aiSummary: null,
    });
    aiSummary.generate.mockResolvedValue(null);
    const service = new BookingsService(prisma as never, createMailMock() as never, aiSummary as never);

    await expect(service.create(validBookingInput)).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      aiSummary: null,
    });
    expect(prisma.booking.update).not.toHaveBeenCalled();
  });

  it('still sends booking emails when AI summary generation returns null', async () => {
    const prisma = createPrismaMock();
    const mail = createMailMock();
    const aiSummary = createAiSummaryMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 0, status: 'open' });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [bookingItemRecords[0]],
      aiSummary: null,
    });
    aiSummary.generate.mockResolvedValue(null);
    const service = new BookingsService(prisma as never, mail as never, aiSummary as never);

    await service.create(validBookingInput);

    expect(mail.sendBookingConfirmationToUser).toHaveBeenCalled();
    expect(mail.sendNewBookingNotificationToAdmin).toHaveBeenCalled();
  });


  it('reserves tour departure seats and returns departure details', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-13T00:00:00.000Z'),
      capacity: 12,
      booked: 4,
      status: 'open',
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
      updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    });
    prisma.booking.create.mockResolvedValue({
      ...bookingRecord,
      items: [
        {
          ...bookingItemRecords[0],
          tourDepartureId: 'departure_1',
          date: '2026-06-13',
        },
      ],
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.create({
        fullName: 'Mai Anh Nguyen',
        email: 'mai.anh@example.com',
        phone: '+84 90 123 4567',
        country: 'Vietnam',
        travelers: 2,
        paymentMethod: 'credit-card',
        items: [
          {
            itemType: 'tour',
            slug: 'bay-mau-coconut-forest',
            quantity: 2,
            tourDepartureId: 'departure_1',
          },
        ],
      }),
    ).resolves.toMatchObject({
      items: [
        expect.objectContaining({
          tourDepartureId: 'departure_1',
          date: '2026-06-13',
          quantity: 2,
        }),
      ],
    });

    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
    expect(prisma.booking.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          items: {
            create: [expect.objectContaining({ tourDepartureId: 'departure_1', date: '2026-06-13' })],
          },
        }),
      }),
    );
  });

  it('rejects past tour departures without creating a booking', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-12T12:00:00.000Z'));
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-11T00:00:00.000Z'),
      capacity: 12,
      booked: 0,
      status: 'open',
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'tour', slug: 'bay-mau-coconut-forest', quantity: 1, tourDepartureId: 'departure_1' }],
    })).rejects.toThrow('This departure is sold out.');
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.booking.create).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('rejects sold-out tour departures without creating a booking', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique.mockResolvedValue({
      id: 'departure_1',
      tourId: 'tour_1',
      date: new Date('2026-06-13T00:00:00.000Z'),
      capacity: 12,
      booked: 12,
      status: 'open',
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'tour', slug: 'bay-mau-coconut-forest', quantity: 1, tourDepartureId: 'departure_1' }],
    })).rejects.toThrow('This departure is sold out.');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('rejects tour departures with partial availability without creating a booking', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 10, status: 'open' })
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 10, status: 'open' });
    prisma.$executeRaw.mockResolvedValue(0);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'tour', slug: 'bay-mau-coconut-forest', quantity: 3, tourDepartureId: 'departure_1' }],
    })).rejects.toThrow('Only 2 seats left for this departure.');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('reserves hotel inventory for every covered night', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue(['2026-06-12', '2026-06-13', '2026-06-14'].map((date) => ({
      id: `inventory_${date}`,
      hotelId: 'hotel_1',
      date: new Date(`${date}T00:00:00.000Z`),
      totalRooms: 5,
      bookedRooms: 2,
      status: 'open',
    })));
    prisma.booking.create.mockResolvedValue({ ...bookingRecord, items: [bookingItemRecords[1]] });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 2, unitPrice: 145, checkIn: '2026-06-12', checkOut: '2026-06-15' }],
    })).resolves.toMatchObject({ bookingCode: 'TW-20260501-SEED' });

    expect(prisma.$executeRaw).toHaveBeenCalledTimes(3);
  });

  it('rejects past hotel nights without creating a booking', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-12T12:00:00.000Z'));
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue(['2026-06-11', '2026-06-12'].map((date) => ({
      id: `inventory_${date}`,
      hotelId: 'hotel_1',
      date: new Date(`${date}T00:00:00.000Z`),
      totalRooms: 5,
      bookedRooms: 0,
      status: 'open',
    })));
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 1, checkIn: '2026-06-11', checkOut: '2026-06-13' }],
    })).rejects.toThrow('This hotel is unavailable on 2026-06-11.');
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.booking.create).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('rejects hotel bookings with non-date-only checkout without creating a booking', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 1, checkIn: '2026-06-12T23:59:59Z', checkOut: '2026-06-15' }],
    })).rejects.toThrow('Hotel check-out must be after check-in.');
    expect(prisma.hotelInventoryDay.findMany).not.toHaveBeenCalled();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('rejects hotel bookings when a covered night is missing or closed', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue([
      { id: 'inventory_2026-06-12', hotelId: 'hotel_1', date: new Date('2026-06-12T00:00:00.000Z'), totalRooms: 5, bookedRooms: 1, status: 'open' },
      { id: 'inventory_2026-06-13', hotelId: 'hotel_1', date: new Date('2026-06-13T00:00:00.000Z'), totalRooms: 5, bookedRooms: 1, status: 'closed' },
    ]);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 1, checkIn: '2026-06-12', checkOut: '2026-06-15' }],
    })).rejects.toThrow('This hotel is unavailable on 2026-06-13.');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('rejects hotel bookings when a covered night lacks rooms', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue(['2026-06-12', '2026-06-13'].map((date, index) => ({
      id: `inventory_${date}`,
      hotelId: 'hotel_1',
      date: new Date(`${date}T00:00:00.000Z`),
      totalRooms: 5,
      bookedRooms: index === 1 ? 4 : 1,
      status: 'open',
    })));
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 2, checkIn: '2026-06-12', checkOut: '2026-06-14' }],
    })).rejects.toThrow('Only 1 rooms left on 2026-06-13.');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });


  it('rejects overlapping hotel items when aggregate rooms exceed availability', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue([
      { id: 'inventory_2026-06-12', hotelId: 'hotel_1', date: new Date('2026-06-12T00:00:00.000Z'), totalRooms: 5, bookedRooms: 4, status: 'open' },
      { id: 'inventory_2026-06-13', hotelId: 'hotel_1', date: new Date('2026-06-13T00:00:00.000Z'), totalRooms: 5, bookedRooms: 4, status: 'open' },
    ]);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [
        { itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 1, checkIn: '2026-06-12', checkOut: '2026-06-14' },
        { itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 1, checkIn: '2026-06-13', checkOut: '2026-06-14' },
      ],
    })).rejects.toThrow('Only 1 rooms left on 2026-06-13.');
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });


  it('rejects when atomic tour reservation affects no rows', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 4, status: 'open' })
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 12, status: 'open' });
    prisma.$executeRaw.mockResolvedValue(0);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'tour', slug: 'bay-mau-coconut-forest', quantity: 2, tourDepartureId: 'departure_1' }],
    })).rejects.toThrow('This departure is sold out.');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('rejects when atomic hotel reservation fails for one night', async () => {
    const prisma = createPrismaMock();
    prisma.hotel.findFirst.mockResolvedValue(hotelRecord);
    prisma.hotelInventoryDay.findMany.mockResolvedValue(['2026-06-12', '2026-06-13'].map((date) => ({
      id: `inventory_${date}`,
      hotelId: 'hotel_1',
      date: new Date(`${date}T00:00:00.000Z`),
      totalRooms: 5,
      bookedRooms: 1,
      status: 'open',
    })));
    prisma.$executeRaw.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    prisma.hotelInventoryDay.findUnique.mockResolvedValue({ id: 'inventory_2026-06-13', hotelId: 'hotel_1', date: new Date('2026-06-13T00:00:00.000Z'), totalRooms: 5, bookedRooms: 5, status: 'open' });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 2, paymentMethod: 'credit-card',
      items: [{ itemType: 'hotel', slug: 'shining-riverside-hoi-an', quantity: 2, checkIn: '2026-06-12', checkOut: '2026-06-14' }],
    })).rejects.toThrow('Only 0 rooms left on 2026-06-13.');
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('aggregates duplicate tour departure reservations before atomic reserve', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(tourRecord);
    prisma.tourDeparture.findUnique
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 10, status: 'open' })
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 10, status: 'open' })
      .mockResolvedValueOnce({ id: 'departure_1', tourId: 'tour_1', date: new Date('2026-06-13T00:00:00.000Z'), capacity: 12, booked: 10, status: 'open' });
    prisma.$executeRaw.mockResolvedValue(0);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.create({
      fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com', phone: '+84 90 123 4567', country: 'Vietnam', travelers: 3, paymentMethod: 'credit-card',
      items: [
        { itemType: 'tour', slug: 'bay-mau-coconut-forest', quantity: 2, tourDepartureId: 'departure_1' },
        { itemType: 'tour', slug: 'bay-mau-coconut-forest', quantity: 1, tourDepartureId: 'departure_1' },
      ],
    })).rejects.toThrow('Only 2 seats left for this departure.');
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.booking.create).not.toHaveBeenCalled();
  });

  it('rejects empty booking items', async () => {
    const prisma = createPrismaMock();
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.create({
        fullName: 'Mai Anh Nguyen',
        email: 'mai.anh@example.com',
        phone: '+84 90 123 4567',
        country: 'Vietnam',
        travelers: 2,
        paymentMethod: 'credit-card',
        items: [],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws NotFoundException when an item slug is missing', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findUnique.mockResolvedValue(null);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.create({
        fullName: 'Mai Anh Nguyen',
        email: 'mai.anh@example.com',
        phone: '+84 90 123 4567',
        country: 'Vietnam',
        travelers: 2,
        paymentMethod: 'credit-card',
        items: [{ itemType: 'tour', slug: 'missing-tour', quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists bookings with filters', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findMany.mockResolvedValue([bookingRecord]);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await service.findAll({
      email: 'mai',
      status: 'confirmed',
      paymentStatus: 'pending',
      perPage: 5,
    });

    expect(prisma.booking.findMany).toHaveBeenCalledWith({
      where: {
        email: { contains: 'mai', mode: 'insensitive' },
        status: 'confirmed',
        paymentStatus: 'pending',
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });

  it('returns booking detail by booking code', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue(bookingRecord);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.findOne('TW-20260501-SEED')).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      customer: { fullName: 'Mai Anh Nguyen', email: 'mai.anh@example.com' },
      trip: { pickupLocation: 'Shining Riverside Hoi An lobby' },
    });
  });

  it('includes the persisted AI summary in admin booking detail responses', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue({
      ...bookingRecord,
      aiSummary: 'Guest prefers vegetarian lunch and hotel lobby pickup.',
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.findOne('TW-20260501-SEED')).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      aiSummary: 'Guest prefers vegetarian lunch and hotel lobby pickup.',
    });
  });

  it('throws NotFoundException when booking is missing', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue(null);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(service.findOne('TW-MISSING')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates booking and payment statuses', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique
      .mockResolvedValueOnce(bookingRecord)
      .mockResolvedValueOnce({
        ...bookingRecord,
        status: 'completed',
        paymentStatus: 'paid',
      });
    prisma.booking.update.mockResolvedValue({
      ...bookingRecord,
      status: 'completed',
      paymentStatus: 'paid',
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.updateStatus('TW-20260501-SEED', {
        status: 'completed',
        paymentStatus: 'paid',
      }),
    ).resolves.toMatchObject({
      status: 'completed',
      paymentStatus: 'paid',
    });
    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { bookingCode: 'TW-20260501-SEED' },
      data: { status: 'completed', paymentStatus: 'paid' },
    });
  });

  it('looks up a public booking by booking code and email', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue(bookingRecord);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.lookupPublicBooking({
        bookingCode: ' tw-20260501-seed ',
        contact: ' MAI.ANH@example.com ',
      }),
    ).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      customer: { email: 'mai.anh@example.com' },
      items: expect.arrayContaining([
        expect.objectContaining({ title: 'Traveling to Bay Mau Coconut Forest' }),
      ]),
    });
    expect(prisma.booking.findUnique).toHaveBeenCalledWith({
      where: { bookingCode: 'TW-20260501-SEED' },
      include: { items: true },
    });
  });

  it('looks up a public booking by booking code and normalized phone', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue(bookingRecord);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.lookupPublicBooking({
        bookingCode: 'TW-20260501-SEED',
        contact: '+84901234567',
      }),
    ).resolves.toMatchObject({
      bookingCode: 'TW-20260501-SEED',
      customer: { phone: '+84 90 123 4567' },
    });
  });

  it('does not expose internal notes in public booking lookup', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue({
      ...bookingRecord,
      internalNotes: 'VIP staff note',
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    const response = await service.lookupPublicBooking({
      bookingCode: 'TW-20260501-SEED',
      contact: 'mai.anh@example.com',
    });

    expect(response.trip).not.toHaveProperty('internalNotes');
  });

  it('does not expose AI summary in public booking lookup', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue({
      ...bookingRecord,
      aiSummary: 'Internal AI summary for admin operators.',
    });
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    const response = await service.lookupPublicBooking({
      bookingCode: 'TW-20260501-SEED',
      contact: 'mai.anh@example.com',
    });

    expect(response).not.toHaveProperty('aiSummary');
  });

  it('does not expose a booking when contact does not match', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue(bookingRecord);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.lookupPublicBooking({
        bookingCode: 'TW-20260501-SEED',
        contact: 'someone-else@example.com',
      }),
    ).rejects.toThrow('We could not find a booking matching those details.');
  });

  it('returns the same generic error when public lookup booking is missing', async () => {
    const prisma = createPrismaMock();
    prisma.booking.findUnique.mockResolvedValue(null);
    const service = new BookingsService(prisma as never, createMailMock() as never, createAiSummaryMock() as never);

    await expect(
      service.lookupPublicBooking({
        bookingCode: 'TW-MISSING',
        contact: 'mai.anh@example.com',
      }),
    ).rejects.toThrow('We could not find a booking matching those details.');
  });
});
