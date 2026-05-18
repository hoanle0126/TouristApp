import Link from "next/link";
import { CalendarClock, MapPinned, Plus, Sparkles, Star, Users } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminTourCatalogPreview } from "@/src/components/admin/AdminTourCatalogPreview";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getTours } from "@/src/lib/api/tours";
import type { TourCard } from "@/src/types/travel";

function getCatalogStats(tours: readonly TourCard[]) {
  return [
    { label: "Published tours", value: `${tours.length}`, note: `${tours.filter((tour) => tour.badge === "Featured").length} featured programs` },
    { label: "Open departures", value: "19", note: "Next 45 days" },
    { label: "Avg. occupancy", value: "74%", note: "+6% vs target" },
    { label: "Private charter leads", value: "11", note: "Awaiting follow-up" },
  ] as const;
}

function ToursStatGrid({ tours }: { readonly tours: readonly TourCard[] }) {
  const catalogStats = getCatalogStats(tours);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {catalogStats.map((item) => (
        <Card className="border-none bg-white" key={item.label}>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-stone-500">{item.label}</p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-stone-950">
              {item.value}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-800">
              {item.note}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
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
    <Card className="sticky top-6 h-fit border-none bg-stone-950 text-white">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-200">
              Merchandising notes
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              What the tours team should do next
            </h3>
          </div>
          <Sparkles className="size-5 text-red-200" />
        </div>

        <div className="mt-6 space-y-3">
          {insightItems.map(({ icon: Icon, note, title }) => (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={title}>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="size-4 text-red-200" />
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

export default async function AdminToursPage() {
  const tours = await getTours();

  return (
    <AdminShell
      activePath="/admin/tours"
      action={
        <Button asChild>
          <Link href="/admin/tours/new">
            <Plus className="size-4" />
            Add new tour
          </Link>
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Tour management"
      searchPlaceholder="Search route, guide, departure..."
      sectionLabel="Catalog, departures, and sales posture for active tour products."
      teamValue="sales"
    >
      <ToursStatGrid tours={tours} />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <AdminTourCatalogPreview tours={tours} />
        <InsightsPanel />
      </section>
    </AdminShell>
  );
}
