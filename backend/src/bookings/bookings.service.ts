import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Booking, BookingItem, Hotel, Prisma, Tour } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookingDto,
  CreateBookingItemDto,
} from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

type BookingRecord = Booking & { items: BookingItem[] };

type PreparedBookingItem = {
  itemType: 'tour' | 'hotel';
  tourId?: string;
  hotelId?: string;
  snapshotSlug: string;
  snapshotTitle: string;
  snapshotImage?: string;
  snapshotAlt?: string;
  snapshotMeta?: string;
  snapshotPriceLabel?: string;
  date?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: string;
  nights?: number;
  roomType?: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  lineTotal: Prisma.Decimal;
  currency: string;
};

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async findAll(
    filters: {
      email?: string;
      status?: string;
      paymentStatus?: string;
      perPage?: number;
    } = {},
  ) {
    const bookings = await this.prisma.booking.findMany({
      where: this.buildWhere(filters),
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: filters.perPage,
    });

    return bookings.map((booking) => this.toResponse(booking));
  }

  async findOne(bookingCode: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingCode },
      include: { items: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${bookingCode} was not found.`);
    }

    return this.toResponse(booking);
  }

  async create(dto: CreateBookingDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException('Booking must contain at least one item.');
    }

    const items = await Promise.all(
      dto.items.map((item) => this.prepareItem(item)),
    );
    const subtotal = items.reduce(
      (total, item) => total + item.lineTotal.toNumber(),
      0,
    );
    const taxesAndFees = 0;
    const total = subtotal + taxesAndFees;

    const booking = await this.prisma.booking.create({
      data: {
        bookingCode: this.generateBookingCode(),
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        city: dto.city,
        address: dto.address,
        travelers: dto.travelers,
        primaryTravelerName: dto.primaryTravelerName,
        primaryTravelerEmail: dto.primaryTravelerEmail,
        primaryTravelerPhone: dto.primaryTravelerPhone,
        travelerDetails: dto.travelerDetails ?? Prisma.JsonNull,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        pickupLocation: dto.pickupLocation,
        dropoffLocation: dto.dropoffLocation,
        arrivalFlight: dto.arrivalFlight,
        specialRequests: dto.specialRequests,
        internalNotes: dto.internalNotes,
        paymentMethod: dto.paymentMethod,
        subtotal: new Prisma.Decimal(subtotal),
        taxesAndFees: new Prisma.Decimal(taxesAndFees),
        total: new Prisma.Decimal(total),
        currency: 'USD',
        items: {
          create: items,
        },
      },
      include: { items: true },
    });
    const response = this.toResponse(booking);

    await this.sendBookingEmails(response);

    return response;
  }

  async updateStatus(bookingCode: string, dto: UpdateBookingStatusDto) {
    await this.ensureBookingExists(bookingCode);
    const booking = await this.prisma.booking.update({
      where: { bookingCode },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.paymentStatus ? { paymentStatus: dto.paymentStatus } : {}),
      },
    });
    const updatedBooking = await this.prisma.booking.findUnique({
      where: { bookingCode: booking.bookingCode },
      include: { items: true },
    });

    return this.toResponse(updatedBooking!);
  }

  private async sendBookingEmails(booking: ReturnType<BookingsService['toResponse']>) {
    try {
      await Promise.all([
        this.mailService.sendBookingConfirmationToUser(booking),
        this.mailService.sendNewBookingNotificationToAdmin(booking),
      ]);
    } catch (error) {
      this.logger.error(
        `Failed to send booking emails for ${booking.bookingCode}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private buildWhere(filters: {
    email?: string;
    status?: string;
    paymentStatus?: string;
  }) {
    return {
      ...(filters.email
        ? { email: { contains: filters.email, mode: 'insensitive' as const } }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.paymentStatus
        ? { paymentStatus: filters.paymentStatus }
        : {}),
    } satisfies Prisma.BookingWhereInput;
  }

  private async ensureBookingExists(bookingCode: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingCode },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${bookingCode} was not found.`);
    }

    return booking;
  }

  private async prepareItem(
    item: CreateBookingItemDto,
  ): Promise<PreparedBookingItem> {
    if (item.itemType === 'tour') {
      const tour = await this.prisma.tour.findUnique({
        where: { slug: item.slug },
      });

      if (!tour) {
        throw new NotFoundException(`Tour ${item.slug} was not found.`);
      }

      return this.prepareTourItem(item, tour);
    }

    const hotel = await this.prisma.hotel.findFirst({
      where: { slug: item.slug, status: 'published' },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel ${item.slug} was not found.`);
    }

    return this.prepareHotelItem(item, hotel);
  }

  private prepareTourItem(
    item: CreateBookingItemDto,
    tour: Tour,
  ): PreparedBookingItem {
    const unitPrice = this.resolveUnitPrice(item.unitPrice, tour.price);
    const quantity = item.quantity;

    return {
      itemType: 'tour',
      tourId: tour.id,
      snapshotSlug: tour.slug,
      snapshotTitle: tour.title,
      snapshotImage: tour.image,
      snapshotAlt: tour.alt,
      snapshotMeta: item.meta ?? `${tour.duration} • ${tour.guests}`,
      snapshotPriceLabel: tour.price,
      date: item.date,
      checkIn: item.checkIn ? new Date(item.checkIn) : undefined,
      checkOut: item.checkOut ? new Date(item.checkOut) : undefined,
      guests: item.guests,
      nights: item.nights,
      roomType: item.roomType,
      quantity,
      unitPrice,
      lineTotal: unitPrice.mul(quantity),
      currency: 'USD',
    };
  }

  private prepareHotelItem(
    item: CreateBookingItemDto,
    hotel: Hotel,
  ): PreparedBookingItem {
    const unitPrice = this.resolveUnitPrice(item.unitPrice, hotel.price);
    const quantity = item.quantity;

    return {
      itemType: 'hotel',
      hotelId: hotel.id,
      snapshotSlug: hotel.slug,
      snapshotTitle: hotel.name,
      snapshotImage: hotel.listingImage,
      snapshotAlt: hotel.listingAlt,
      snapshotMeta: item.meta ?? hotel.location,
      snapshotPriceLabel: hotel.price,
      date: item.date,
      checkIn: item.checkIn ? new Date(item.checkIn) : undefined,
      checkOut: item.checkOut ? new Date(item.checkOut) : undefined,
      guests: item.guests,
      nights: item.nights,
      roomType: item.roomType,
      quantity,
      unitPrice,
      lineTotal: unitPrice.mul(quantity),
      currency: 'USD',
    };
  }

  private resolveUnitPrice(inputPrice: number | undefined, priceLabel: string) {
    if (
      typeof inputPrice === 'number' &&
      Number.isFinite(inputPrice) &&
      inputPrice >= 0
    ) {
      return new Prisma.Decimal(inputPrice);
    }

    return new Prisma.Decimal(this.parsePrice(priceLabel));
  }

  private parsePrice(price: string) {
    const parsed = Number(price.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private generateBookingCode() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `TW-${date}-${suffix}`;
  }

  private toResponse(booking: BookingRecord) {
    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      customer: {
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        country: booking.country,
        city: booking.city,
        address: booking.address,
      },
      travelers: booking.travelers,
      travelerDetails: booking.travelerDetails,
      trip: {
        startDate: booking.startDate?.toISOString(),
        endDate: booking.endDate?.toISOString(),
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        arrivalFlight: booking.arrivalFlight,
        specialRequests: booking.specialRequests,
        internalNotes: booking.internalNotes,
      },
      totals: {
        subtotal: booking.subtotal.toNumber(),
        taxesAndFees: booking.taxesAndFees.toNumber(),
        total: booking.total.toNumber(),
        currency: booking.currency,
      },
      items: booking.items.map((item) => this.toItemResponse(item)),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  private toItemResponse(item: BookingItem) {
    return {
      id: item.id,
      itemType: item.itemType,
      tourId: item.tourId,
      hotelId: item.hotelId,
      slug: item.snapshotSlug,
      title: item.snapshotTitle,
      image: item.snapshotImage,
      alt: item.snapshotAlt,
      meta: item.snapshotMeta,
      priceLabel: item.snapshotPriceLabel,
      date: item.date,
      checkIn: item.checkIn?.toISOString(),
      checkOut: item.checkOut?.toISOString(),
      guests: item.guests,
      nights: item.nights,
      roomType: item.roomType,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toNumber(),
      lineTotal: item.lineTotal.toNumber(),
      currency: item.currency,
    };
  }
}
