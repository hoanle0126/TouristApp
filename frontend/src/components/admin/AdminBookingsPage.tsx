import {
  AlertTriangle,
  CalendarCheck2,
  CreditCard,
  ReceiptText,
  ShieldAlert,
  Users,
} from "lucide-react";

import { AdminBookingQueuePanel } from "@/src/components/admin/AdminBookingQueuePanel";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { Card, CardContent } from "@/src/components/ui/card";
import { getBookings } from "@/src/lib/api/bookings";
import type { ApiBooking } from "@/src/lib/api/types";

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function getBookingStats(bookings: readonly ApiBooking[]) {
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;
  const pendingPayment = bookings.filter((booking) => booking.paymentStatus === "pending").length;
  const averageValue = bookings.length > 0 ? bookings.reduce((sum, booking) => sum + booking.totals.total, 0) / bookings.length : 0;
  const currency = bookings[0]?.totals.currency ?? "USD";
  const refundCases = bookings.filter((booking) => booking.paymentStatus === "refunded").length;

  return [
    { label: "Confirmed bookings", note: "Live booking API", value: `${confirmedBookings}` },
    { label: "Pending payment", note: "Need follow-up today", value: pendingPayment.toString().padStart(2, "0") },
    { label: "Average booking value", note: "Across current queue", value: formatCurrency(averageValue, currency) },
    { label: "Refund cases", note: "Within policy window", value: refundCases.toString().padStart(2, "0") },
  ] as const;
}

const riskItems = [
  {
    detail: "2 high-value bookings still missing second installment before supplier cutoff.",
    icon: CreditCard,
    title: "Payment risk",
  },
  {
    detail: "One booking amendment needs hotel reconfirmation after guest date change.",
    icon: ShieldAlert,
    title: "Supplier reconfirmation",
  },
  {
    detail: "Refund request for one short tour is inside grace period and should be processed today.",
    icon: AlertTriangle,
    title: "Policy exception",
  },
] as const;

function BookingStatGrid({ bookings }: { readonly bookings: readonly ApiBooking[] }) {
  const bookingStats = getBookingStats(bookings);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {bookingStats.map((item) => (
        <Card className="border-none bg-white" key={item.label}>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-stone-500">{item.label}</p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-stone-950">
              {item.value}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              {item.note}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function UpcomingCheckinsPanel({ bookings }: { readonly bookings: readonly ApiBooking[] }) {
  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between border-b border-stone-200 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Upcoming arrivals
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Next itineraries on the calendar
            </h3>
          </div>
          <CalendarCheck2 className="size-5 text-emerald-800" />
        </div>

        <div className="mt-6 space-y-4">
          {bookings.slice(0, 4).map((booking) => {
            const item = booking.items[0];

            return (
              <article
                className="rounded-[1.5rem] border border-stone-200/80 bg-stone-50 p-4"
                key={booking.bookingCode}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold tracking-tight text-stone-950">
                      {item?.title ?? booking.bookingCode}
                    </h4>
                    <p className="mt-1 text-sm text-stone-500">{booking.customer.fullName}</p>
                  </div>
                  <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-stone-950">
                    {formatCurrency(booking.totals.total, booking.totals.currency)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">
                    {booking.bookingCode}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                    {booking.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentsPanel() {
  return (
    <Card className="border-none bg-stone-950 text-white">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
              Payment watchlist
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              Cases finance should clear next
            </h3>
          </div>
          <ReceiptText className="size-5 text-emerald-200" />
        </div>

        <div className="mt-6 space-y-3">
          {riskItems.map(({ detail, icon: Icon, title }) => (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={title}>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="size-4 text-emerald-200" />
                </span>
                <div>
                  <p className="font-semibold tracking-tight">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BookingSummaryPanel() {
  const summaryItems = [
    { icon: Users, label: "Traveler records updated", value: "17" },
    { icon: CreditCard, label: "Invoices issued", value: "24" },
    { icon: CalendarCheck2, label: "Supplier confirmations", value: "13" },
  ] as const;

  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Booking ops pulse
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Today&apos;s throughput
            </h3>
          </div>
          <Users className="size-5 text-emerald-800" />
        </div>

        <div className="mt-6 space-y-3">
          {summaryItems.map(({ icon: Icon, label, value }) => (
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-4" key={label}>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-stone-700">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-semibold text-stone-700">{label}</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-stone-950">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <AdminShell
      activePath="/admin/bookings"
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Booking management"
      searchPlaceholder="Search guest, booking, invoice..."
      sectionLabel="Reservation queue, arrivals, and payment exceptions across the travel operation."
      teamValue="operations"
    >
      <BookingStatGrid bookings={bookings} />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <AdminBookingQueuePanel bookings={bookings} />
        <PaymentsPanel />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.8fr)]">
        <UpcomingCheckinsPanel bookings={bookings} />
        <BookingSummaryPanel />
      </section>
    </AdminShell>
  );
}
