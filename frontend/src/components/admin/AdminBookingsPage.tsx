import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck2,
  CreditCard,
  Plus,
  ReceiptText,
  ShieldAlert,
  Users,
} from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { cartItems } from "@/src/data/mockData";

const bookingStats = [
  { label: "Confirmed bookings", note: "12 check-ins this week", value: "48" },
  { label: "Pending payment", note: "Need follow-up today", value: "09" },
  { label: "Average booking value", note: "+14% vs last month", value: "$2,670" },
  { label: "Refund cases", note: "Within policy window", value: "03" },
] as const;

const bookingRows = [
  {
    checkIn: "May 03, 2026",
    guest: "Mai Anh",
    product: "Bay Mau Coconut Forest",
    source: "Direct",
    status: "Confirmed",
    total: "$1,240",
  },
  {
    checkIn: "May 05, 2026",
    guest: "Daniel Foster",
    product: "The Soul of Kyoto",
    source: "Concierge",
    status: "Awaiting payment",
    total: "$8,900",
  },
  {
    checkIn: "May 07, 2026",
    guest: "Hana Lee",
    product: "Shining Riverside Suite",
    source: "Partner",
    status: "Review",
    total: "$3,760",
  },
  {
    checkIn: "May 11, 2026",
    guest: "Noah Bennett",
    product: "Cyclades Silk Sails",
    source: "Direct",
    status: "Confirmed",
    total: "$7,120",
  },
] as const;

const statusStyles: Record<(typeof bookingRows)[number]["status"], string> = {
  Confirmed: "bg-emerald-100 text-emerald-900",
  "Awaiting payment": "bg-amber-100 text-amber-900",
  Review: "bg-stone-200 text-stone-700",
};

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

function BookingStatGrid() {
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

function BookingQueuePanel() {
  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Booking queue
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Reservations requiring active handling
            </h3>
          </div>
          <Button size="sm" variant="ghost">
            Export queue
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">
                <th className="pb-1 pr-4">Guest</th>
                <th className="pb-1 pr-4">Product</th>
                <th className="pb-1 pr-4">Check-in</th>
                <th className="pb-1 pr-4">Source</th>
                <th className="pb-1 pr-4">Status</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {bookingRows.map((row) => (
                <tr className="bg-stone-50 text-sm text-stone-600" key={`${row.guest}-${row.product}`}>
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-stone-950">
                    {row.guest}
                  </td>
                  <td className="px-4 py-4">{row.product}</td>
                  <td className="px-4 py-4">{row.checkIn}</td>
                  <td className="px-4 py-4">{row.source}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4 text-right font-semibold text-stone-950">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingCheckinsPanel() {
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
          {cartItems.map((item) => (
            <article
              className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-[1.5rem] border border-stone-200/80 bg-stone-50 p-4"
              key={item.title}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-200">
                <Image
                  alt={item.alt}
                  className="object-cover"
                  fill
                  sizes="88px"
                  src={item.image}
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold tracking-tight text-stone-950">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-stone-500">{item.meta}</p>
                  </div>
                  <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-stone-950">
                    {item.price}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900">
                    {item.date}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                    Arrival ready
                  </span>
                </div>
              </div>
            </article>
          ))}
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

export default function AdminBookingsPage() {
  return (
    <AdminShell
      activePath="/admin/bookings"
      action={
        <Button>
          <Plus className="size-4" />
          New booking
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Booking management"
      searchPlaceholder="Search guest, booking, invoice..."
      sectionLabel="Reservation queue, arrivals, and payment exceptions across the travel operation."
      teamValue="operations"
    >
      <BookingStatGrid />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <BookingQueuePanel />
        <PaymentsPanel />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.8fr)]">
        <UpcomingCheckinsPanel />
        <BookingSummaryPanel />
      </section>
    </AdminShell>
  );
}
