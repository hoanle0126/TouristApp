import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';

export type ChatbotResponse = {
  answer: string;
  sources: {
    kind: 'tour' | 'hotel' | 'blog' | 'booking' | 'destination';
    label: string;
    slug: string;
  }[];
};

export type ChatbotRequest = {
  message: string;
};

type TourMatch = {
  slug: string;
  title: string;
  shortDescription: string;
  availability: string;
  departures: {
    date: Date;
    capacity: number;
    booked: number;
    status: string;
  }[];
};

type HotelMatch = {
  slug: string;
  name: string;
  location: string;
  inventoryDays: {
    date: Date;
    totalRooms: number;
    bookedRooms: number;
    status: string;
  }[];
};

type BlogMatch = {
  slug: string;
  title: string;
  excerpt: string;
};

type DestinationMatch = {
  slug: string;
  title: string;
  summary: string;
};

type BookingMatch = {
  bookingCode: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  startDate: Date | null;
  endDate: Date | null;
  pickupLocation: string | null;
  dropoffLocation: string | null;
  specialRequests: string | null;
  paymentStatus: string;
  status: string;
  total: { toNumber(): number };
  currency: string;
  items: {
    itemType: string;
    snapshotTitle: string;
    date: string | null;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: string | null;
    roomType: string | null;
    quantity: number;
    lineTotal: { toNumber(): number };
    currency: string;
  }[];
};

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
  ) {}

  async respond(input: ChatbotRequest): Promise<ChatbotResponse> {
    const message = input.message.trim();
    const bookingResult = await this.buildBookingGroundedResult(message);
    const [tours, hotels, destinations, blogs] = bookingResult
      ? [[], [], [], []]
      : await Promise.all([
          this.prisma.tour.findMany({
            take: 12,
            orderBy: { title: 'asc' },
            include: {
              departures: {
                orderBy: { date: 'asc' },
              },
            },
          }),
          this.prisma.hotel.findMany({
            take: 12,
            orderBy: { name: 'asc' },
            include: {
              inventoryDays: {
                orderBy: { date: 'asc' },
              },
            },
          }),
          this.prisma.destination.findMany({ take: 12, orderBy: { title: 'asc' } }),
          this.prisma.blogPost.findMany({ take: 12, orderBy: { title: 'asc' } }),
        ]);

    const shouldGroundResponse = this.requiresWebsiteContext(message);
    const groundedResult =
      bookingResult ??
      (shouldGroundResponse
        ? this.buildGroundedResult(
            message,
            tours,
            hotels,
            destinations ?? [],
            blogs,
          )
        : { groundedAnswer: null, sources: [] as ChatbotResponse['sources'] });

    return {
      answer: await this.generateAiAnswer(
        message,
        groundedResult.groundedAnswer,
        groundedResult.sources,
      ),
      sources: groundedResult.sources,
    };
  }

  private async generateAiAnswer(
    question: string,
    groundedAnswer: string | null,
    sources: ChatbotResponse['sources'],
  ) {
    const config = await this.settingsService.getAiProviderRuntimeConfig();
    const fallbackAnswer =
      groundedAnswer ?? 'I do not know based on the current website data.';
    const hasGroundedContext = Boolean(groundedAnswer || sources.length > 0);

    if (!config.enabled || !config.apiKey) {
      return fallbackAnswer;
    }

    try {
      const response = await fetch(
        `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            temperature: 0.2,
            messages: [
              {
                role: 'system',
                content: hasGroundedContext
                  ? 'You are a multilingual travel support chatbot for a travel booking website. Answer in the same language as the user. Use the supplied website context when answering this request. Answer the website question directly from the supplied website context when that context contains the answer. Do not say you do not know when the supplied website context already answers the question. If the supplied website context is insufficient for the requested website information, say you do not know. Do not invent policies, prices, availability, or business facts.'
                  : 'You are a multilingual travel support chatbot for a travel booking website. Answer in the same language as the user. Respond naturally to greetings and general small talk. Do not invent specific website facts, prices, availability, policies, or business details unless website context is supplied.',
              },
              {
                role: 'user',
                content: JSON.stringify({
                  question,
                  groundedAnswer,
                  sources,
                }),
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        return fallbackAnswer;
      }

      const payload = (await response.json()) as {
        choices?: { message?: { content?: unknown } }[];
      };
      const content = payload.choices?.[0]?.message?.content;
      return typeof content === 'string' && content.trim()
        ? content.trim()
        : fallbackAnswer;
    } catch (error) {
      this.logger.warn(
        'Chatbot provider request failed',
        error instanceof Error ? error.stack : undefined,
      );
      return fallbackAnswer;
    }
  }

  private async buildBookingGroundedResult(message: string) {
    if (!this.isBookingRequest(message)) {
      return null;
    }

    const bookingCode = this.extractBookingCode(message);
    const contactEmail = this.extractEmail(message);
    const booking = bookingCode
      ? ((await this.prisma.booking.findUnique({
          where: { bookingCode },
          include: { items: true },
        })) as BookingMatch | null)
      : contactEmail
        ? ((await this.prisma.booking.findFirst({
            where: { email: contactEmail },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
          })) as BookingMatch | null)
        : null;

    if (!booking || !this.messageContainsBookingContact(message, booking)) {
      return {
        groundedAnswer:
          'Please provide the booking code together with the email address or phone number used for the booking so I can look it up safely.',
        sources: [] as ChatbotResponse['sources'],
      };
    }

    return {
      groundedAnswer: this.formatBookingContext(booking),
      sources: [
        {
          kind: 'booking' as const,
          label: `Booking: ${booking.bookingCode}`,
          slug: booking.bookingCode,
        },
      ],
    };
  }

  private requiresWebsiteContext(message: string) {
    const normalizedMessage = message.toLowerCase();
    return [
      'tour',
      'hotel',
      'room',
      'rooms',
      'availability',
      'available',
      'book',
      'booking',
      'price',
      'prices',
      'chỗ',
      'phòng',
      'còn',
      'giá',
      'đặt',
      'lịch',
      'tour nào',
      'khách sạn',
      'destination',
      'destinations',
      'điểm đến',
      'website',
      'web',
      'blog',
    ].some((keyword) => normalizedMessage.includes(keyword));
  }

  private buildGroundedResult(
    message: string,
    tours: TourMatch[],
    hotels: HotelMatch[],
    destinations: DestinationMatch[],
    blogs: BlogMatch[],
  ) {
    if (
      this.isBroadCatalogRequest(message) ||
      this.isTourCatalogRequest(message) ||
      this.isDestinationAwareRequest(message)
    ) {
      const summaryParts: string[] = [];
      const sources: ChatbotResponse['sources'] = [];

      const availableTour =
        tours.find((tour) =>
          tour.departures.some((departure) => departure.status === 'open'),
        ) ?? tours[0];
      if (availableTour) {
        summaryParts.push(
          this.describeTourAvailability(availableTour, message),
        );
        sources.push({
          kind: 'tour' as const,
          label: `Tour: ${availableTour.title}`,
          slug: availableTour.slug,
        });
      }

      if (this.isBroadCatalogRequest(message) || this.isHotelRequest(message)) {
        const availableHotel =
          hotels.find((hotel) =>
            hotel.inventoryDays.some((day) => day.status === 'open'),
          ) ?? hotels[0];
        if (availableHotel) {
          summaryParts.push(
            this.describeHotelAvailability(availableHotel, message),
          );
          sources.push({
            kind: 'hotel' as const,
            label: `Hotel: ${availableHotel.name}`,
            slug: availableHotel.slug,
          });
        }
      }

      if (this.isDestinationAwareRequest(message)) {
        for (const destination of destinations) {
          summaryParts.push(
            `Destination ${destination.title}: ${destination.summary}.`,
          );
          sources.push({
            kind: 'destination' as const,
            label: `Destination: ${destination.title}`,
            slug: destination.slug,
          });
        }
      }

      if (summaryParts.length > 0) {
        return {
          groundedAnswer: summaryParts.join(' '),
          sources,
        };
      }
    }

    const matchedTour = tours.find((tour) =>
      this.matches(message, this.getTourCandidates(tour)),
    );
    if (matchedTour) {
      const source = {
        kind: 'tour' as const,
        label: `Tour: ${matchedTour.title}`,
        slug: matchedTour.slug,
      };
      const openDeparture = matchedTour.departures.find(
        (departure) => departure.status === 'open',
      );
      const matchPrefix = this.hasExactMatch(
        message,
        this.getTourCandidates(matchedTour),
      )
        ? ''
        : 'The closest matching tour is ';
      return {
        groundedAnswer: openDeparture
          ? `${matchPrefix}${matchedTour.title} currently has ${Math.max(openDeparture.capacity - openDeparture.booked, 0)} seats left on ${this.toDateString(openDeparture.date)}.`
          : `${matchPrefix}${matchedTour.title} is listed with ${matchedTour.availability} availability on the website.`,
        sources: [source],
      };
    }

    const matchedHotel = hotels.find((hotel) =>
      this.matches(message, [hotel.name, hotel.slug, hotel.location]),
    );
    if (matchedHotel) {
      const source = {
        kind: 'hotel' as const,
        label: `Hotel: ${matchedHotel.name}`,
        slug: matchedHotel.slug,
      };
      const openInventoryDay = matchedHotel.inventoryDays.find(
        (day) => day.status === 'open',
      );
      return {
        groundedAnswer: openInventoryDay
          ? `${matchedHotel.name} currently has ${Math.max(openInventoryDay.totalRooms - openInventoryDay.bookedRooms, 0)} rooms left on ${this.toDateString(openInventoryDay.date)}.`
          : `${matchedHotel.name} is listed in ${matchedHotel.location} on the website.`,
        sources: [source],
      };
    }

    if (this.isHotelRequest(message) && hotels.length > 0) {
      const recommendedHotel =
        hotels.find((hotel) =>
          hotel.inventoryDays.some((day) => day.status === 'open'),
        ) ?? hotels[0];
      const source = {
        kind: 'hotel' as const,
        label: `Hotel: ${recommendedHotel.name}`,
        slug: recommendedHotel.slug,
      };
      const openInventoryDay = recommendedHotel.inventoryDays.find(
        (day) => day.status === 'open',
      );
      return {
        groundedAnswer: openInventoryDay
          ? `No exact hotel location match was found. A hotel available in the current website data is ${recommendedHotel.name} in ${recommendedHotel.location}. It currently has ${Math.max(openInventoryDay.totalRooms - openInventoryDay.bookedRooms, 0)} rooms left on ${this.toDateString(openInventoryDay.date)}.`
          : `No exact hotel location match was found. A hotel listed in the current website data is ${recommendedHotel.name} in ${recommendedHotel.location}.`,
        sources: [source],
      };
    }

    const matchedBlog = blogs.find((blog) =>
      this.matches(message, [blog.title, blog.slug, blog.excerpt]),
    );
    if (matchedBlog) {
      return {
        groundedAnswer: `${matchedBlog.title}: ${matchedBlog.excerpt}`,
        sources: [
          {
            kind: 'blog' as const,
            label: `Blog: ${matchedBlog.title}`,
            slug: matchedBlog.slug,
          },
        ],
      };
    }

    return {
      groundedAnswer: 'I do not know based on the current website data.',
      sources: [],
    };
  }

  private matches(message: string, candidates: string[]) {
    const normalizedMessage = this.normalizeForMatch(message);
    const messageTokens = new Set(normalizedMessage.split(' ').filter(Boolean));

    return candidates.some((candidate) => {
      const normalizedCandidate = this.normalizeForMatch(candidate);
      const candidateTokens = normalizedCandidate
        .split(' ')
        .filter((token) => token.length >= 3);

      return (
        this.hasExactMatch(message, [candidate]) ||
        candidateTokens.some((token) => messageTokens.has(token))
      );
    });
  }

  private hasExactMatch(message: string, candidates: string[]) {
    const normalizedMessage = this.normalizeForMatch(message);
    return candidates.some((candidate) => {
      const normalizedCandidate = this.normalizeForMatch(candidate);
      return (
        normalizedCandidate.length > 0 &&
        normalizedMessage.includes(normalizedCandidate)
      );
    });
  }

  private getTourCandidates(tour: TourMatch) {
    const simplifiedTitle = tour.title.replace(/^traveling to\s+/i, '');
    return [
      tour.title,
      simplifiedTitle,
      tour.slug,
      tour.slug.replace(/-/g, ' '),
    ];
  }

  private extractBookingCode(message: string) {
    return message.match(/\bTW-[A-Z0-9-]+\b/i)?.[0].toUpperCase() ?? null;
  }

  private extractEmail(message: string) {
    return (
      message
        .match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]
        .toLowerCase() ?? null
    );
  }

  private isBookingRequest(message: string) {
    const normalizedMessage = message.toLowerCase();
    return ['booking', 'đặt chỗ', 'đơn đặt', 'mã đặt'].some((keyword) =>
      normalizedMessage.includes(keyword),
    );
  }

  private messageContainsBookingContact(
    message: string,
    booking: BookingMatch,
  ) {
    const normalizedMessage = this.normalizeContact(message);
    return [booking.email, booking.phone]
      .map((contact) => this.normalizeContact(contact))
      .some(
        (contact) => contact.length > 0 && normalizedMessage.includes(contact),
      );
  }

  private formatBookingContext(booking: BookingMatch) {
    const itemDetails = booking.items.map((item) => {
      const schedule = item.date
        ? `date ${item.date}`
        : item.checkIn && item.checkOut
          ? `from ${this.toDateString(item.checkIn)} to ${this.toDateString(item.checkOut)}`
          : 'schedule not specified';
      const room = item.roomType ? `, room type ${item.roomType}` : '';
      const guests = item.guests ? `, guests ${item.guests}` : '';

      return `${item.itemType} ${item.snapshotTitle}: ${schedule}${room}${guests}, quantity ${item.quantity}, line total ${item.lineTotal.toNumber()} ${item.currency}.`;
    });

    return [
      `Booking ${booking.bookingCode} for ${booking.fullName} has status ${booking.status} and payment status ${booking.paymentStatus}.`,
      `Travelers: ${booking.travelers}.`,
      booking.startDate || booking.endDate
        ? `Trip dates: ${booking.startDate ? this.toDateString(booking.startDate) : 'not specified'} to ${booking.endDate ? this.toDateString(booking.endDate) : 'not specified'}.`
        : null,
      booking.pickupLocation ? `Pickup: ${booking.pickupLocation}.` : null,
      booking.dropoffLocation ? `Dropoff: ${booking.dropoffLocation}.` : null,
      booking.specialRequests
        ? `Special requests: ${booking.specialRequests}.`
        : null,
      `Total: ${booking.total.toNumber()} ${booking.currency}.`,
      `Items: ${itemDetails.join(' ')}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private normalizeContact(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9@+]/g, '');
  }

  private isHotelRequest(message: string) {
    const normalizedMessage = message.toLowerCase();
    return ['hotel', 'hotels', 'khách sạn', 'phòng'].some((keyword) =>
      normalizedMessage.includes(keyword),
    );
  }

  private isDestinationAwareRequest(message: string) {
    const normalizedMessage = message.toLowerCase();
    return ['website', 'web', 'destination', 'destinations', 'điểm đến'].some(
      (keyword) => normalizedMessage.includes(keyword),
    );
  }

  private isWebsiteOverviewRequest(message: string) {
    const normalizedMessage = message.toLowerCase();
    return ['website', 'điểm đến'].some((keyword) =>
      normalizedMessage.includes(keyword),
    );
  }

  private describeTourAvailability(tour: TourMatch, message: string) {
    if (this.isWebsiteOverviewRequest(message) && tour.departures.length > 0) {
      return `${tour.title} schedule: ${tour.departures.map((departure) => `${this.toDateString(departure.date)}: ${departure.status}, ${Math.max(departure.capacity - departure.booked, 0)} seats left`).join('; ')}.`;
    }

    const openDeparture = tour.departures.find(
      (departure) => departure.status === 'open',
    );
    return openDeparture
      ? `${tour.title} currently has ${Math.max(openDeparture.capacity - openDeparture.booked, 0)} seats left on ${this.toDateString(openDeparture.date)}.`
      : `${tour.title} is listed with ${tour.availability} availability on the website.`;
  }

  private describeHotelAvailability(hotel: HotelMatch, message: string) {
    if (
      this.isWebsiteOverviewRequest(message) &&
      hotel.inventoryDays.length > 0
    ) {
      return `${hotel.name} inventory: ${hotel.inventoryDays.map((day) => `${this.toDateString(day.date)}: ${day.status}, ${Math.max(day.totalRooms - day.bookedRooms, 0)} rooms left`).join('; ')}.`;
    }

    const openInventoryDay = hotel.inventoryDays.find(
      (day) => day.status === 'open',
    );
    return openInventoryDay
      ? `${hotel.name} currently has ${Math.max(openInventoryDay.totalRooms - openInventoryDay.bookedRooms, 0)} rooms left on ${this.toDateString(openInventoryDay.date)}.`
      : `${hotel.name} is listed in ${hotel.location} on the website.`;
  }

  private isBroadCatalogRequest(message: string) {
    return this.isTourCatalogRequest(message) && this.isHotelRequest(message);
  }

  private isTourCatalogRequest(message: string) {
    const normalizedMessage = message.toLowerCase();
    return [
      'các tour',
      'các tours',
      'những tour',
      'những tours',
      'danh sách tour',
      'tour nào shop phục vụ',
      'tours nào shop phục vụ',
      'tour mà shop phục vụ',
      'tours mà shop phục vụ',
      'tour hiện có',
      'tours hiện có',
      'available tours',
      'tour list',
      'tours list',
    ].some((keyword) => normalizedMessage.includes(keyword));
  }

  private normalizeForMatch(value: string) {
    return value
      .toLowerCase()
      .replace(/[-_]+/g, ' ')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private toDateString(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
