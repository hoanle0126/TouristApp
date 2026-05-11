import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export type BookingEmail = {
  bookingCode: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city?: string | null;
    address?: string | null;
  };
  travelers: number;
  totals: {
    subtotal: number;
    taxesAndFees: number;
    total: number;
    currency: string;
  };
  items: readonly {
    itemType: string;
    slug: string;
    title: string;
    meta?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    currency: string;
  }[];
  createdAt: string;
};

@Injectable()
export class MailService {
  private readonly transporter: Transporter | null;
  private readonly from: string;
  private readonly adminEmail?: string;

  constructor() {
    this.transporter = this.createTransporter();
    this.from = process.env.MAIL_FROM ?? 'Curator <no-reply@curator.local>';
    this.adminEmail = process.env.ADMIN_EMAIL;
  }

  async sendBookingConfirmationToUser(booking: BookingEmail) {
    await this.sendMail({
      to: booking.customer.email,
      subject: `Your Curator booking ${booking.bookingCode} is confirmed`,
      text: this.renderUserConfirmation(booking),
    });
  }

  async sendNewBookingNotificationToAdmin(booking: BookingEmail) {
    if (!this.adminEmail) {
      return;
    }

    await this.sendMail({
      to: this.adminEmail,
      subject: `New TouristWeb booking ${booking.bookingCode}`,
      text: this.renderAdminNotification(booking),
    });
  }

  private createTransporter() {
    const host = process.env.SMTP_HOST;

    if (!host) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  protected async sendMail(input: {
    to: string;
    subject: string;
    text: string;
  }) {
    if (!this.transporter) {
      return;
    }

    await this.transporter.sendMail({
      from: this.from,
      ...input,
    });
  }

  private renderUserConfirmation(booking: BookingEmail) {
    return [
      `Hello ${booking.customer.fullName},`,
      '',
      'Your booking has been created successfully.',
      `Booking code: ${booking.bookingCode}`,
      `Status: ${booking.status}`,
      `Payment status: ${booking.paymentStatus}`,
      `Total: ${this.formatMoney(booking.totals.total, booking.totals.currency)}`,
      '',
      'Items:',
      ...booking.items.map((item) => this.renderItem(item)),
      '',
      'Thank you for choosing Curator.',
    ].join('\n');
  }

  private renderAdminNotification(booking: BookingEmail) {
    return [
      `New booking: ${booking.bookingCode}`,
      `Created at: ${booking.createdAt}`,
      '',
      'Customer:',
      `Name: ${booking.customer.fullName}`,
      `Email: ${booking.customer.email}`,
      `Phone: ${booking.customer.phone}`,
      `Country: ${booking.customer.country}`,
      booking.customer.city ? `City: ${booking.customer.city}` : undefined,
      booking.customer.address
        ? `Address: ${booking.customer.address}`
        : undefined,
      '',
      'Booking:',
      `Travelers: ${booking.travelers}`,
      `Payment method: ${booking.paymentMethod}`,
      `Payment status: ${booking.paymentStatus}`,
      `Total: ${this.formatMoney(booking.totals.total, booking.totals.currency)}`,
      '',
      'Items:',
      ...booking.items.map((item) => this.renderItem(item)),
    ]
      .filter((line): line is string => typeof line === 'string')
      .join('\n');
  }

  private renderItem(bookingItem: BookingEmail['items'][number]) {
    return `- ${bookingItem.title} (${bookingItem.itemType}) x${bookingItem.quantity}: ${this.formatMoney(bookingItem.lineTotal, bookingItem.currency)}`;
  }

  private formatMoney(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}
