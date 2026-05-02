import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Booking, BookingItem, Hotel, Prisma, Tour, TourDeparture } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookingDto,
  CreateBookingItemDto,
} from './dto/create-booking.dto';
import { isValidDateOnly } from '../tours/dto/is-valid-date-only.validator';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

type BookingRecord = Booking & { items: BookingItem[] };
type PrismaTransaction = Prisma.TransactionClient;

type PreparedBookingItem = {
  itemType: 'tour' | 'hotel';
  tourId?: string;
  tourDepartureId?: string;
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
  tourDeparture?: TourDeparture;
  hotelInventoryDays?: {
    id: string;
    date: string;
    status: string;
    totalRooms: number;
    bookedRooms: number;
  }[];
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

    const booking = await this.prisma.$transaction(async (tx) => {
      const items = await Promise.all(
        dto.items.map((item) => this.prepareItem(item, tx)),
      );
      await this.reserveInventory(items, tx);
      const bookingItems = items.map(({ hotelInventoryDays, tourDeparture, ...item }) => item);
      const subtotal = items.reduce(
        (total, item) => total + item.lineTotal.toNumber(),
        0,
      );
      const taxesAndFees = 0;
      const total = subtotal + taxesAndFees;

      return tx.booking.create({
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
            create: bookingItems,
          },
        },
        include: { items: true },
      });
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
    tx: PrismaTransaction,
  ): Promise<PreparedBookingItem> {
    if (item.itemType === 'tour') {
      const tour = await tx.tour.findUnique({
        where: { slug: item.slug },
      });

      if (!tour) {
        throw new NotFoundException(`Tour ${item.slug} was not found.`);
      }

      return this.prepareTourItem(item, tour, tx);
    }

    const hotel = await tx.hotel.findFirst({
      where: { slug: item.slug, status: 'published' },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel ${item.slug} was not found.`);
    }

    return this.prepareHotelItem(item, hotel, tx);
  }

  private async prepareTourItem(
    item: CreateBookingItemDto,
    tour: Tour,
    tx: PrismaTransaction,
  ): Promise<PreparedBookingItem> {
    if (!item.tourDepartureId) {
      throw new BadRequestException('Tour departure is required.');
    }

    const departure = await tx.tourDeparture.findUnique({
      where: { id: item.tourDepartureId },
    });
    this.ensureTourDepartureCanBeBooked(departure, tour.id);

    const unitPrice = this.resolveUnitPrice(item.unitPrice, tour.price);
    const quantity = item.quantity;

    return {
      itemType: 'tour',
      tourId: tour.id,
      tourDepartureId: departure.id,
      tourDeparture: departure,
      snapshotSlug: tour.slug,
      snapshotTitle: tour.title,
      snapshotImage: tour.image,
      snapshotAlt: tour.alt,
      snapshotMeta: item.meta ?? `${tour.duration} • ${tour.guests}`,
      snapshotPriceLabel: tour.price,
      date: this.toDateOnlyString(departure.date),
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

  private async prepareHotelItem(
    item: CreateBookingItemDto,
    hotel: Hotel,
    tx: PrismaTransaction,
  ): Promise<PreparedBookingItem> {
    const nights = this.buildHotelNights(item);
    const inventoryDays = await tx.hotelInventoryDay.findMany({
      where: {
        hotelId: hotel.id,
        date: { in: nights.map((night) => new Date(`${night}T00:00:00.000Z`)) },
      },
    });
    const inventoryByDate = new Map(
      inventoryDays.map((day) => [this.toDateOnlyString(day.date), day]),
    );

    const today = this.getTodayDateOnly();
    for (const night of nights) {
      const inventoryDay = inventoryByDate.get(night);
      if (night < today || !inventoryDay || inventoryDay.status !== 'open') {
        throw new BadRequestException(`This hotel is unavailable on ${night}.`);
      }
    }

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
      hotelInventoryDays: nights.map((night) => {
        const inventoryDay = inventoryByDate.get(night)!;
        return {
          id: inventoryDay.id,
          date: night,
          status: inventoryDay.status,
          totalRooms: inventoryDay.totalRooms,
          bookedRooms: inventoryDay.bookedRooms,
        };
      }),
    };
  }

  private async reserveInventory(
    items: PreparedBookingItem[],
    tx: PrismaTransaction,
  ) {
    const tourReservations = new Map<
      string,
      { tourId: string; quantity: number; departure: TourDeparture }
    >();
    const hotelReservations = new Map<
      string,
      {
        inventoryDayId: string;
        date: string;
        quantity: number;
        status: string;
        totalRooms: number;
        bookedRooms: number;
      }
    >();

    for (const item of items) {
      if (item.itemType === 'tour' && item.tourDepartureId && item.tourId) {
        const existing = tourReservations.get(item.tourDepartureId);
        tourReservations.set(item.tourDepartureId, {
          tourId: item.tourId,
          quantity: (existing?.quantity ?? 0) + item.quantity,
          departure: item.tourDeparture!,
        });
      }

      if (item.itemType === 'hotel') {
        for (const day of item.hotelInventoryDays ?? []) {
          const existing = hotelReservations.get(day.id);
          hotelReservations.set(day.id, {
            inventoryDayId: day.id,
            date: day.date,
            quantity: (existing?.quantity ?? 0) + item.quantity,
            status: day.status,
            totalRooms: day.totalRooms,
            bookedRooms: day.bookedRooms,
          });
        }
      }
    }

    for (const reservation of tourReservations.values()) {
      this.ensureTourDepartureCanBeBooked(
        reservation.departure,
        reservation.tourId,
        reservation.quantity,
      );
    }

    for (const reservation of hotelReservations.values()) {
      this.ensureHotelInventoryCanBeBooked(
        reservation.status,
        reservation.totalRooms,
        reservation.bookedRooms,
        reservation.date,
        reservation.quantity,
      );
    }

    for (const [tourDepartureId, reservation] of tourReservations) {
      const affected = await tx.$executeRaw(Prisma.sql`
        UPDATE "TourDeparture"
        SET "booked" = "booked" + ${reservation.quantity}
        WHERE "id" = ${tourDepartureId}
          AND "tourId" = ${reservation.tourId}
          AND "status" = 'open'
          AND "booked" + ${reservation.quantity} <= "capacity"
      `);

      if (affected === 0) {
        const departure = await tx.tourDeparture.findUnique({
          where: { id: tourDepartureId },
        });
        this.throwTourAvailabilityError(departure, reservation.tourId);
      }
    }

    for (const reservation of hotelReservations.values()) {
      const affected = await tx.$executeRaw(Prisma.sql`
        UPDATE "HotelInventoryDay"
        SET "bookedRooms" = "bookedRooms" + ${reservation.quantity}
        WHERE "id" = ${reservation.inventoryDayId}
          AND "status" = 'open'
          AND "bookedRooms" + ${reservation.quantity} <= "totalRooms"
      `);

      if (affected === 0) {
        const inventoryDay = await tx.hotelInventoryDay.findUnique({
          where: { id: reservation.inventoryDayId },
        });
        this.throwHotelAvailabilityError(inventoryDay, reservation.date);
      }
    }
  }

  private ensureTourDepartureCanBeBooked(
    departure: TourDeparture | null,
    tourId: string,
    requestedQuantity = 1,
  ): asserts departure is TourDeparture {
    if (!departure || departure.tourId !== tourId || departure.status !== 'open') {
      throw new BadRequestException('This departure is sold out.');
    }

    if (this.toDateOnlyString(departure.date) < this.getTodayDateOnly()) {
      throw new BadRequestException('This departure is sold out.');
    }

    const remaining = departure.capacity - departure.booked;
    if (remaining <= 0) {
      throw new BadRequestException('This departure is sold out.');
    }

    if (remaining < requestedQuantity) {
      throw new BadRequestException(`Only ${remaining} seats left for this departure.`);
    }
  }

  private ensureHotelInventoryCanBeBooked(
    status: string,
    totalRooms: number,
    bookedRooms: number,
    date: string,
    requestedQuantity: number,
  ) {
    if (status !== 'open') {
      throw new BadRequestException(`This hotel is unavailable on ${date}.`);
    }

    const remaining = totalRooms - bookedRooms;
    if (remaining < requestedQuantity) {
      throw new BadRequestException(`Only ${remaining} rooms left on ${date}.`);
    }
  }

  private throwTourAvailabilityError(
    departure: TourDeparture | null,
    tourId: string,
  ): never {
    if (!departure || departure.tourId !== tourId || departure.status !== 'open') {
      throw new BadRequestException('This departure is sold out.');
    }

    const remaining = Math.max(departure.capacity - departure.booked, 0);
    if (remaining <= 0) {
      throw new BadRequestException('This departure is sold out.');
    }

    throw new BadRequestException(`Only ${remaining} seats left for this departure.`);
  }

  private throwHotelAvailabilityError(
    inventoryDay: { totalRooms: number; bookedRooms: number; status: string } | null,
    date: string,
  ): never {
    if (!inventoryDay || inventoryDay.status !== 'open') {
      throw new BadRequestException(`This hotel is unavailable on ${date}.`);
    }

    const remaining = Math.max(inventoryDay.totalRooms - inventoryDay.bookedRooms, 0);
    throw new BadRequestException(`Only ${remaining} rooms left on ${date}.`);
  }

  private buildHotelNights(item: CreateBookingItemDto) {
    if (!item.checkIn || !item.checkOut) {
      throw new BadRequestException('Hotel check-in and check-out are required.');
    }

    const checkIn = this.parseDateOnly(item.checkIn);
    const checkOut = this.parseDateOnly(item.checkOut);
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      throw new BadRequestException('Hotel check-out must be after check-in.');
    }

    const nights: string[] = [];
    for (const current = new Date(checkIn); current < checkOut; current.setUTCDate(current.getUTCDate() + 1)) {
      nights.push(this.toDateOnlyString(current));
    }

    return nights;
  }

  private parseDateOnly(value: string) {
    if (!isValidDateOnly(value)) {
      return null;
    }

    return new Date(`${value}T00:00:00.000Z`);
  }

  private getTodayDateOnly() {
    return this.toDateOnlyString(new Date());
  }

  private toDateOnlyString(date: Date) {
    return date.toISOString().slice(0, 10);
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
      tourDepartureId: item.tourDepartureId,
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
