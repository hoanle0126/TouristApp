import PaymentSuccessPage from "@/src/components/travel/PaymentSuccessPage";
import { getBooking } from "@/src/lib/api/bookings";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccess({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ readonly bookingCode?: string }>;
}>) {
  const { bookingCode } = await searchParams;
  const booking = bookingCode ? await getBooking(bookingCode) : null;

  return <PaymentSuccessPage booking={booking} />;
}
