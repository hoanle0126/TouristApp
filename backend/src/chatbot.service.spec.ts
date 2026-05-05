import { SettingsService } from './settings/settings.service';
import { ChatbotService } from './chatbot/chatbot.service';

function createPrismaMock() {
  return {
    tour: {
      findMany: jest.fn(),
    },
    hotel: {
      findMany: jest.fn(),
    },
    destination: {
      findMany: jest.fn(),
    },
    blogPost: {
      findMany: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };
}

function createSettingsMock(overrides?: Partial<SettingsService>) {
  return {
    getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
      provider: 'openai-compatible',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      enabled: true,
      apiKey: 'sk-test',
    }),
    ...overrides,
  } as unknown as SettingsService;
}

describe('ChatbotService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('uses the configured BYOK model and returns cited grounded answers', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock({
      getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
        provider: 'openai-compatible',
        baseUrl: 'https://api.example.com/v1',
        model: 'claude-sonnet-4-6',
        enabled: true,
        apiKey: 'sk-test',
      }),
    }));

    await expect(service.respond({ message: 'Bay Mau Coconut Forest còn chỗ không?' })).resolves.toEqual({
      answer: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
      sources: [
        {
          kind: 'tour',
          label: 'Tour: Bay Mau Coconut Forest',
          slug: 'bay-mau-coconut-forest',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('claude-sonnet-4-6'),
      }),
    );
  });

  it('asks the model to answer in the user language using only grounded website context', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([
      {
        slug: 'shining-riverside-hoi-an',
        name: 'Shining Riverside Hoi An',
        location: 'Hoi An',
        scoreSummary: 'Riverside stay near the old town.',
        inventoryDays: [
          {
            date: new Date('2026-06-13T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 3,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Shining Riverside Hoi An still has 7 rooms available on 2026-06-13.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await service.respond({ message: 'Is Shining Riverside Hoi An still available?' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('same language as the user'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Use the supplied website context when answering this request.'),
      }),
    );
  });

  it('grounds broad tour and hotel list questions with both tour and hotel data', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([
      {
        slug: 'shining-riverside-hoi-an',
        name: 'Shining Riverside',
        location: 'Hoi An Hotel & Spa, Vietnam',
        scoreSummary: 'Score 9.4 riverside hotel.',
        inventoryDays: [
          {
            date: new Date('2026-06-13T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 3,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'Website đang có tour Bay Mau Coconut Forest còn 8 chỗ ngày 2026-06-12 và khách sạn Shining Riverside còn 7 phòng ngày 2026-06-13.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'web đang phục vụ các tours và hotels nào nhỉ',
      }),
    ).resolves.toEqual({
      answer:
        'Website đang có tour Bay Mau Coconut Forest còn 8 chỗ ngày 2026-06-12 và khách sạn Shining Riverside còn 7 phòng ngày 2026-06-13.',
      sources: [
        {
          kind: 'tour',
          label: 'Tour: Bay Mau Coconut Forest',
          slug: 'bay-mau-coconut-forest',
        },
        {
          kind: 'hotel',
          label: 'Hotel: Shining Riverside',
          slug: 'shining-riverside-hoi-an',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Shining Riverside currently has 7 rooms left on 2026-06-13.'),
      }),
    );
  });

  it('grounds website questions with destination data and full tour and hotel schedules', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
          {
            date: new Date('2026-06-13T00:00:00.000Z'),
            capacity: 12,
            booked: 12,
            status: 'sold-out',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([
      {
        slug: 'shining-riverside-hoi-an',
        name: 'Shining Riverside',
        location: 'Hoi An Hotel & Spa, Vietnam',
        scoreSummary: 'Score 9.4 riverside hotel.',
        inventoryDays: [
          {
            date: new Date('2026-06-15T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 3,
            status: 'open',
          },
          {
            date: new Date('2026-06-16T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 10,
            status: 'sold-out',
          },
        ],
      },
    ]);
    prisma.destination.findMany.mockResolvedValue([
      {
        slug: 'hoi-an',
        title: 'Hoi An',
        market: 'Vietnam',
        summary: 'Lantern-lit riverside heritage town.',
      },
    ]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'Website có điểm đến Hoi An, tour Bay Mau Coconut Forest, và khách sạn Shining Riverside với cả ngày còn chỗ lẫn ngày sold-out.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'website có điểm đến nào và ngày khác còn phòng hay hết rồi?',
      }),
    ).resolves.toEqual({
      answer:
        'Website có điểm đến Hoi An, tour Bay Mau Coconut Forest, và khách sạn Shining Riverside với cả ngày còn chỗ lẫn ngày sold-out.',
      sources: [
        {
          kind: 'tour',
          label: 'Tour: Bay Mau Coconut Forest',
          slug: 'bay-mau-coconut-forest',
        },
        {
          kind: 'hotel',
          label: 'Hotel: Shining Riverside',
          slug: 'shining-riverside-hoi-an',
        },
        {
          kind: 'destination',
          label: 'Destination: Hoi An',
          slug: 'hoi-an',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('2026-06-13: sold-out, 0 seats left'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('2026-06-16: sold-out, 0 rooms left'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Destination Hoi An in Vietnam: Lantern-lit riverside heritage town.'),
      }),
    );
  });

  it('grounds Vietnamese destination-only website questions with destination names', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.destination.findMany.mockResolvedValue([
      {
        slug: 'hoi-an',
        title: 'Hoi An',
        market: 'Vietnam',
        summary: 'Lantern-lit riverside heritage town.',
      },
      {
        slug: 'kyoto',
        title: 'Kyoto',
        market: 'Japan',
        summary: 'Temple gardens and slow seasonal journeys.',
      },
    ]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Website hiện có các điểm đến Hoi An và Kyoto.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'website bao gồm các điểm đến nào nhỉ',
      }),
    ).resolves.toEqual({
      answer: 'Website hiện có các điểm đến Hoi An và Kyoto.',
      sources: [
        {
          kind: 'destination',
          label: 'Destination: Hoi An',
          slug: 'hoi-an',
        },
        {
          kind: 'destination',
          label: 'Destination: Kyoto',
          slug: 'kyoto',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Destination Hoi An in Vietnam: Lantern-lit riverside heritage town.'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Destination Kyoto in Japan: Temple gardens and slow seasonal journeys.'),
      }),
    );
  });

  it('suggests available hotel inventory when a requested hotel location has no exact match', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([
      {
        slug: 'shining-riverside-hoi-an',
        name: 'Shining Riverside',
        location: 'Hoi An Hotel & Spa, Vietnam',
        scoreSummary: 'Score 9.4 riverside hotel.',
        inventoryDays: [
          {
            date: new Date('2026-06-13T00:00:00.000Z'),
            totalRooms: 10,
            bookedRooms: 3,
            status: 'open',
          },
        ],
      },
      {
        slug: 'aman-tokyo',
        name: 'Aman Tokyo',
        location: 'Otemachi, Japan',
        scoreSummary: 'Score 9.1 urban luxury hotel.',
        inventoryDays: [],
      },
    ]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'Website chưa có khách sạn ở Huế, nhưng có Shining Riverside còn 7 phòng ngày 2026-06-13.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message:
          'tôi đang muốn đi du lịch Huế, bạn tìm giúp tôi vài khách sạn chất lượng cao được không',
      }),
    ).resolves.toEqual({
      answer:
        'Website chưa có khách sạn ở Huế, nhưng có Shining Riverside còn 7 phòng ngày 2026-06-13.',
      sources: [
        {
          kind: 'hotel',
          label: 'Hotel: Shining Riverside',
          slug: 'shining-riverside-hoi-an',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('No exact hotel location match was found'),
      }),
    );
  });

  it('answers booking detail questions when the booking code and contact match', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);
    prisma.booking.findUnique.mockResolvedValue({
      bookingCode: 'TW-20260501-SEED',
      fullName: 'Linh Tran',
      email: 'linh@example.com',
      phone: '+84901234567',
      travelers: 2,
      startDate: new Date('2026-06-15T00:00:00.000Z'),
      endDate: new Date('2026-06-17T00:00:00.000Z'),
      pickupLocation: 'Da Nang Airport',
      dropoffLocation: 'Hoi An Old Town',
      specialRequests: 'Vegetarian breakfast',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'confirmed',
      total: { toNumber: () => 520 },
      currency: 'USD',
      items: [
        {
          itemType: 'tour',
          snapshotTitle: 'Bay Mau Coconut Forest',
          date: '2026-06-15',
          checkIn: null,
          checkOut: null,
          guests: '2 adults',
          roomType: null,
          quantity: 1,
          lineTotal: { toNumber: () => 120 },
          currency: 'USD',
        },
        {
          itemType: 'hotel',
          snapshotTitle: 'Shining Riverside',
          date: null,
          checkIn: new Date('2026-06-15T00:00:00.000Z'),
          checkOut: new Date('2026-06-17T00:00:00.000Z'),
          guests: '2 adults',
          roomType: 'River Suite',
          quantity: 1,
          lineTotal: { toNumber: () => 400 },
          currency: 'USD',
        },
      ],
    });

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'Booking TW-20260501-SEED đã được xác nhận, thanh toán paid, gồm tour Bay Mau Coconut Forest và khách sạn Shining Riverside từ 2026-06-15 đến 2026-06-17.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'Chi tiết booking TW-20260501-SEED của email linh@example.com là gì?',
      }),
    ).resolves.toEqual({
      answer:
        'Booking TW-20260501-SEED đã được xác nhận, thanh toán paid, gồm tour Bay Mau Coconut Forest và khách sạn Shining Riverside từ 2026-06-15 đến 2026-06-17.',
      sources: [
        {
          kind: 'booking',
          label: 'Booking: TW-20260501-SEED',
          slug: 'TW-20260501-SEED',
        },
      ],
    });

    expect(prisma.booking.findUnique).toHaveBeenCalledWith({
      where: { bookingCode: 'TW-20260501-SEED' },
      include: { items: true },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Vegetarian breakfast'),
      }),
    );
  });

  it('answers booking detail questions when the user provides only a matching email contact', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);
    prisma.booking.findFirst.mockResolvedValue({
      bookingCode: 'TW-20260503-HNMN',
      fullName: 'Le Van Xuan Hoan',
      email: 'hoanle0126@gmail.com',
      phone: '0705079830',
      travelers: 1,
      startDate: null,
      endDate: null,
      pickupLocation: null,
      dropoffLocation: null,
      specialRequests: null,
      paymentMethod: 'credit-card',
      paymentStatus: 'pending',
      status: 'pending',
      total: { toNumber: () => 285 },
      currency: 'USD',
      items: [
        {
          itemType: 'hotel',
          snapshotTitle: 'Shining Riverside',
          date: 'Jun 15, 2026 - Jun 16, 2026',
          checkIn: new Date('2026-06-15T00:00:00.000Z'),
          checkOut: new Date('2026-06-16T00:00:00.000Z'),
          guests: null,
          roomType: 'Grand Riverside Suite',
          quantity: 1,
          lineTotal: { toNumber: () => 285 },
          currency: 'USD',
        },
      ],
    });

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'Booking TW-20260503-HNMN của hoanle0126@gmail.com đang pending, thanh toán pending, gồm khách sạn Shining Riverside tổng 285 USD.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'cho tôi hỏi thông tin về booking của hoanle0126@gmail.com',
      }),
    ).resolves.toEqual({
      answer:
        'Booking TW-20260503-HNMN của hoanle0126@gmail.com đang pending, thanh toán pending, gồm khách sạn Shining Riverside tổng 285 USD.',
      sources: [
        {
          kind: 'booking',
          label: 'Booking: TW-20260503-HNMN',
          slug: 'TW-20260503-HNMN',
        },
      ],
    });

    expect(prisma.booking.findFirst).toHaveBeenCalledWith({
      where: { email: 'hoanle0126@gmail.com' },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('lets the BYOK model answer greetings naturally without being told website data is insufficient', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Chào bạn! Mình có thể hỗ trợ thông tin tour, khách sạn và tình trạng còn chỗ trên website.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'chào bạn',
      }),
    ).resolves.toEqual({
      answer:
        'Chào bạn! Mình có thể hỗ trợ thông tin tour, khách sạn và tình trạng còn chỗ trên website.',
      sources: [],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('chào bạn'),
      }),
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('I do not know based on the current website data.'),
      }),
    );
  });

  it('tells the BYOK model to answer availability questions from grounded website context', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await service.respond({
      message: 'Bay Mau Coconut Forest còn chỗ không?',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Answer the website question directly from the supplied website context when that context contains the answer.'),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('Do not say you do not know when the supplied website context already answers the question.'),
      }),
    );
  });

  it('matches a live tour when the user asks with a near-miss place name', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Traveling to Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'có tour nào xịn ở địa điểm Cà Mau không bạn nhỉ',
      }),
    ).resolves.toEqual({
      answer: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
      sources: [
        {
          kind: 'tour',
          label: 'Tour: Traveling to Bay Mau Coconut Forest',
          slug: 'bay-mau-coconut-forest',
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('closest matching tour'),
      }),
    );
  });

  it('matches a live tour when the user asks with a shortened title instead of the full marketing title', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Traveling to Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'Bay Mau Coconut Forest còn chỗ không?',
      }),
    ).resolves.toEqual({
      answer: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
      sources: [
        {
          kind: 'tour',
          label: 'Tour: Traveling to Bay Mau Coconut Forest',
          slug: 'bay-mau-coconut-forest',
        },
      ],
    });
  });

  it('falls back to the grounded availability answer when the BYOK response is empty', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([
      {
        slug: 'bay-mau-coconut-forest',
        title: 'Bay Mau Coconut Forest',
        shortDescription: 'Basket boat journey through Cam Thanh waterways.',
        availability: 'Daily',
        departures: [
          {
            date: new Date('2026-06-12T00:00:00.000Z'),
            capacity: 12,
            booked: 4,
            status: 'open',
          },
        ],
      },
    ]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: '   ',
            },
          },
        ],
      }),
    });
    global.fetch = fetchMock as never;

    const service = new ChatbotService(prisma as never, createSettingsMock());

    await expect(
      service.respond({
        message: 'Bay Mau Coconut Forest còn chỗ không?',
      }),
    ).resolves.toEqual({
      answer: 'Bay Mau Coconut Forest currently has 8 seats left on 2026-06-12.',
      sources: [
        {
          kind: 'tour',
          label: 'Tour: Bay Mau Coconut Forest',
          slug: 'bay-mau-coconut-forest',
        },
      ],
    });
  });

  it('falls back to the internal unknown answer when the BYOK provider is disabled', async () => {
    const prisma = createPrismaMock();
    prisma.tour.findMany.mockResolvedValue([]);
    prisma.hotel.findMany.mockResolvedValue([]);
    prisma.blogPost.findMany.mockResolvedValue([]);

    const fetchMock = jest.fn();
    global.fetch = fetchMock as never;

    const service = new ChatbotService(
      prisma as never,
      createSettingsMock({
        getAiProviderRuntimeConfig: jest.fn().mockResolvedValue({
          provider: 'openai-compatible',
          baseUrl: 'https://api.openai.com/v1',
          model: 'gpt-4o-mini',
          enabled: false,
          apiKey: null,
        }),
      }),
    );

    await expect(
      service.respond({
        message: 'chào bạn',
      }),
    ).resolves.toEqual({
      answer: 'I do not know based on the current website data.',
      sources: [],
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
