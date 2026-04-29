import {
  ArrowRight,
  Bell,
  MessageSquareMore,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  CreditCard,
} from "lucide-react";

import Link from "next/link";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { destinationCards, hotelCards, journalPosts, tourCards } from "@/src/data/mockData";

const statCards = [
  {
    change: "+12.8%",
    helper: "vs last month",
    icon: CreditCard,
    label: "Gross booking value",
    tone: "bg-emerald-950 text-white",
    value: "$128,400",
  },
  {
    change: "+8 guests",
    helper: "confirmed today",
    icon: Users,
    label: "Active travelers",
    tone: "bg-white text-stone-950",
    value: "342",
  },
  {
    change: "94.6%",
    helper: "response SLA",
    icon: ShieldCheck,
    label: "Concierge fulfillment",
    tone: "bg-white text-stone-950",
    value: "118 tasks",
  },
  {
    change: "2 pending",
    helper: "need review",
    icon: Bell,
    label: "Operational alerts",
    tone: "bg-amber-50 text-stone-950",
    value: "07",
  },
] as const;

const funnelSteps = [
  { count: 126, label: "New inquiries", width: "w-[92%]" },
  { count: 78, label: "Qualified leads", width: "w-[72%]" },
  { count: 45, label: "Proposal sent", width: "w-[52%]" },
  { count: 31, label: "Deposit secured", width: "w-[38%]" },
] as const;

const recentBookings = [
  {
    guests: "2 travelers",
    owner: "Mai Anh",
    package: "Bay Mau Coconut Forest",
    payment: "Paid in full",
    status: "Confirmed",
    total: "$1,240",
  },
  {
    guests: "4 travelers",
    owner: "Daniel Foster",
    package: "Kyoto Zen Retreat",
    payment: "Awaiting balance",
    status: "Pending",
    total: "$8,900",
  },
  {
    guests: "3 travelers",
    owner: "Hana Lee",
    package: "Shining Riverside Hoi An",
    payment: "Deposit received",
    status: "Review",
    total: "$3,760",
  },
  {
    guests: "6 travelers",
    owner: "Noah Bennett",
    package: "Tokyo Urban Pulse",
    payment: "Paid in full",
    status: "Confirmed",
    total: "$7,120",
  },
] as const;

const operations = [
  {
    detail: "Need rooming list and airport pickup manifest",
    due: "Today · 16:00",
    icon: PlaneTakeoff,
    title: "Finalize Hoi An arrival brief",
  },
  {
    detail: "High-value guest requested private chef add-on",
    due: "Tomorrow · 09:30",
    icon: Sparkles,
    title: "Approve concierge upsell package",
  },
  {
    detail: "32 unread traveler messages across three itineraries",
    due: "Tomorrow · 11:00",
    icon: MessageSquareMore,
    title: "Clear concierge inbox backlog",
  },
] as const;

const statusClasses: Record<(typeof recentBookings)[number]["status"], string> = {
  Confirmed: "bg-emerald-100 text-emerald-900",
  Pending: "bg-amber-100 text-amber-900",
  Review: "bg-stone-200 text-stone-700",
};

function StatGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {statCards.map(({ change, helper, icon: Icon, label, tone, value }) => (
        <Card className={`border-none ${tone}`} key={label}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-current/70">{label}</p>
                <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-black/5">
                <Icon className="size-5" />
              </span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-black/5 px-2.5 py-1">{change}</span>
              <span className="text-current/60">{helper}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function RevenuePanel() {
  const monthlyRevenue = [42, 58, 51, 76, 69, 88, 97] as const;

  return (
    <Card className="border-stone-200/70">
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Revenue cadence
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Booking momentum is ahead of target
            </h3>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            +18.4% MoM
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_320px]">
          <div className="flex min-h-[240px] items-end gap-3">
            {monthlyRevenue.map((value, index) => (
              <div className="flex flex-1 flex-col justify-end gap-3" key={`${value}-${index}`}>
                <div
                  className="rounded-t-[1.25rem] bg-gradient-to-t from-emerald-900 via-emerald-800 to-emerald-500"
                  style={{ height: `${value * 2}px` }}
                />
                <span className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                  W{index + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {funnelSteps.map((step) => (
              <div className="space-y-2" key={step.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-stone-700">{step.label}</span>
                  <span className="text-stone-500">{step.count}</span>
                </div>
                <div className="h-3 rounded-full bg-stone-100">
                  <div
                    className={`h-3 rounded-full bg-stone-950 ${step.width}`}
                  />
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-950">
                Conversion note
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Proposal-to-deposit conversion is strongest on hotel-inclusive
                itineraries. Prioritize follow-up on high-value custom stays.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingsPanel() {
  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Latest bookings
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              High-touch trips that need attention
            </h3>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/checkout">
              Open booking queue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">
                <th className="pb-1 pr-4">Guest</th>
                <th className="pb-1 pr-4">Package</th>
                <th className="pb-1 pr-4">Payment</th>
                <th className="pb-1 pr-4">Status</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr className="rounded-2xl bg-stone-50 text-sm text-stone-600" key={`${booking.owner}-${booking.package}`}>
                  <td className="rounded-l-2xl px-4 py-4">
                    <p className="font-semibold text-stone-950">{booking.owner}</p>
                    <p className="mt-1 text-xs text-stone-500">{booking.guests}</p>
                  </td>
                  <td className="px-4 py-4 font-medium text-stone-700">{booking.package}</td>
                  <td className="px-4 py-4">{booking.payment}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4 text-right font-semibold text-stone-950">
                    {booking.total}
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

function PortfolioPanel() {
  const featuredPortfolio = [
    {
      count: `${tourCards.length} active tours`,
      label: "Signature journeys",
      value: "86% occupancy",
    },
    {
      count: `${hotelCards.length} hotel partners`,
      label: "Stay collection",
      value: "12 contract renewals",
    },
    {
      count: `${destinationCards.length} destinations`,
      label: "Destination index",
      value: "4 launch candidates",
    },
    {
      count: `${journalPosts.length} journal stories`,
      label: "Editorial pipeline",
      value: "3 drafts pending",
    },
  ] as const;

  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Portfolio health
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Supply and content snapshot
            </h3>
          </div>
          <TrendingUp className="size-5 text-emerald-800" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {featuredPortfolio.map((item) => (
            <div className="rounded-2xl bg-stone-50 p-4" key={item.label}>
              <p className="text-sm font-semibold text-stone-950">{item.label}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                {item.count}
              </p>
              <p className="mt-4 text-lg font-bold tracking-tight text-emerald-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OperationsPanel() {
  return (
    <Card className="bg-stone-950 text-white">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
              Action list
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              Operations needing response
            </h3>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
            {operations.length} open
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {operations.map(({ detail, due, icon: Icon, title }) => (
            <div
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
              key={title}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="size-4 text-emerald-200" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold tracking-tight">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    {detail}
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                    {due}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminShell
      activePath="/admin"
      action={
        <Button>
          <ArrowRight className="size-4" />
          Create itinerary
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Admin dashboard"
      searchPlaceholder="Search booking, traveler, destination..."
      sectionLabel="Operational overview across bookings, supply, and concierge delivery."
    >
      <StatGrid />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <RevenuePanel />
        <OperationsPanel />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
        <BookingsPanel />
        <PortfolioPanel />
      </section>
    </AdminShell>
  );
}
