import { MailService, type BookingEmail } from './mail.service';

const booking = {
  bookingCode: 'TW-20260501-SEED',
  status: 'confirmed',
  paymentStatus: 'pending',
  paymentMethod: 'credit-card',
  customer: {
    fullName: 'Mai Anh Nguyen',
    email: 'mai.anh@example.com',
    phone: '+84 90 123 4567',
    country: 'Vietnam',
    city: 'Da Nang',
    address: '12 Bach Dang Street',
  },
  travelers: 2,
  totals: {
    subtotal: 480,
    taxesAndFees: 0,
    total: 480,
    currency: 'USD',
  },
  items: [
    {
      itemType: 'tour',
      slug: 'bay-mau-coconut-forest',
      title: 'Traveling to Bay Mau Coconut Forest',
      meta: '4.5 Hours • Max 12 Guests',
      quantity: 2,
      unitPrice: 45,
      lineTotal: 90,
      currency: 'USD',
    },
  ],
  createdAt: '2026-05-01T00:00:00.000Z',
} satisfies BookingEmail;

describe('MailService', () => {
  const originalAdminEmail = process.env.ADMIN_EMAIL;
  const originalMailFrom = process.env.MAIL_FROM;

  afterEach(() => {
    process.env.ADMIN_EMAIL = originalAdminEmail;
    process.env.MAIL_FROM = originalMailFrom;
  });

  it('sends a booking confirmation email to the customer', async () => {
    const service = new MailService();
    const sendMail = jest
      .spyOn(service as unknown as { sendMail: MailService['sendMail'] }, 'sendMail')
      .mockResolvedValue(undefined);

    await service.sendBookingConfirmationToUser(booking);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'mai.anh@example.com',
        subject: expect.stringContaining('TW-20260501-SEED'),
        text: expect.stringContaining('Your booking has been created successfully.'),
      }),
    );
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Traveling to Bay Mau Coconut Forest'),
      }),
    );
  });

  it('sends booking and customer details to the admin', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    const service = new MailService();
    const sendMail = jest
      .spyOn(service as unknown as { sendMail: MailService['sendMail'] }, 'sendMail')
      .mockResolvedValue(undefined);

    await service.sendNewBookingNotificationToAdmin(booking);

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'admin@example.com',
        subject: expect.stringContaining('TW-20260501-SEED'),
        text: expect.stringContaining('mai.anh@example.com'),
      }),
    );
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('+84 90 123 4567'),
      }),
    );
  });
});
