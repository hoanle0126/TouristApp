import {
  ArrowRight,
  CalendarClock,
  Eye,
  MapPinned,
  Plus,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { tourCards } from "@/src/data/mockData";

const catalogStats = [
  { label: "Published tours", value: `${tourCards.length}`, note: "2 featured programs" },
  { label: "Open departures", value: "19", note: "Next 45 days" },
  { label: "Avg. occupancy", value: "74%", note: "+6% vs target" },
  { label: "Private charter leads", value: "11", note: "Awaiting follow-up" },
] as const;

const departureRows = [
  {
    date: "May 02, 2026",
    guide: "Lan Pham",
    route: "Bay Mau Coconut Forest",
    seats: "9 / 12",
    status: "Healthy",
  },
  {
    date: "May 06, 2026",
    guide: "Akira Mori",
    route: "The Soul of Kyoto",
    seats: "5 / 8",
    status: "Push sales",
  },
  {
    date: "May 11, 2026",
    guide: "Luca Serra",
    route: "Amalfi Coast Discovery",
    seats: "11 / 12",
    status: "Almost full",
  },
  {
    date: "May 18, 2026",
    guide: "Freya Nordin",
    route: "Arctic Sky Expedition",
    seats: "3 / 6",
    status: "Push sales",
  },
] as const;

const statusStyles: Record<(typeof departureRows)[number]["status"], string> = {
  Healthy: "bg-emerald-100 text-emerald-900",
  "Push sales": "bg-amber-100 text-amber-900",
  "Almost full": "bg-stone-900 text-white",
};

function ToursStatGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {catalogStats.map((item) => (
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

function TourCatalogPanel() {
  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Tour catalog
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Signature products and occupancy posture
            </h3>
          </div>
          <Button size="sm" variant="ghost">
            Refresh inventory
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {tourCards.map((tour) => (
            <article
              className="rounded-[1.75rem] border border-stone-200/80 bg-stone-50 p-5"
              key={tour.title}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {tour.badge ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900">
                        {tour.badge}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">
                      {tour.duration}
                    </span>
                  </div>
                  <h4 className="mt-3 text-2xl font-bold tracking-tight text-stone-950">
                    {tour.title}
                  </h4>
                </div>
                <span className="rounded-2xl bg-stone-900 px-3 py-2 text-sm font-semibold text-white">
                  {tour.price}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-stone-600">
                {tour.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Capacity
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-950">{tour.guests}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Interest
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-950">
                    {tour.badge === "Featured" ? "High intent" : "Stable demand"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Margin
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-950">
                    {tour.price === "$8,900" ? "Premium" : "Core tier"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="size-4" />
                  Preview
                </Button>
                <Button size="sm" variant="ghost">
                  Edit details
                </Button>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DeparturesPanel() {
  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between border-b border-stone-200 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Upcoming departures
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Departure load by guide and seat count
            </h3>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">
                <th className="pb-1 pr-4">Route</th>
                <th className="pb-1 pr-4">Date</th>
                <th className="pb-1 pr-4">Guide</th>
                <th className="pb-1 pr-4">Seats</th>
                <th className="pb-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {departureRows.map((row) => (
                <tr className="bg-stone-50 text-sm text-stone-600" key={`${row.route}-${row.date}`}>
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-stone-950">
                    {row.route}
                  </td>
                  <td className="px-4 py-4">{row.date}</td>
                  <td className="px-4 py-4">{row.guide}</td>
                  <td className="px-4 py-4">{row.seats}</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
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

function InsightsPanel() {
  const insightItems = [
    {
      icon: Star,
      note: "Featured tours are converting 1.7x better than the rest of the catalog.",
      title: "Boost editorial placements",
    },
    {
      icon: Users,
      note: "Kyoto and Arctic departures are under target on seat fill for the next two windows.",
      title: "Rebalance demand",
    },
    {
      icon: MapPinned,
      note: "Bay Mau remains the strongest short-format product for domestic traffic.",
      title: "Protect core seller",
    },
    {
      icon: CalendarClock,
      note: "Three itineraries need final guide confirmation within 72 hours.",
      title: "Resolve staffing",
    },
  ] as const;

  return (
    <Card className="border-none bg-stone-950 text-white">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
              Merchandising notes
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              What the tours team should do next
            </h3>
          </div>
          <Sparkles className="size-5 text-emerald-200" />
        </div>

        <div className="mt-6 space-y-3">
          {insightItems.map(({ icon: Icon, note, title }) => (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={title}>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="size-4 text-emerald-200" />
                </span>
                <div>
                  <p className="font-semibold tracking-tight">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminToursPage() {
  return (
    <AdminShell
      activePath="/admin/tours"
      action={
        <Button>
          <Plus className="size-4" />
          Add new tour
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Tour management"
      searchPlaceholder="Search route, guide, departure..."
      sectionLabel="Catalog, departures, and sales posture for active tour products."
      teamValue="sales"
    >
      <ToursStatGrid />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <TourCatalogPanel />
        <InsightsPanel />
      </section>

      <DeparturesPanel />
    </AdminShell>
  );
}
