import Link from "next/link";
import { Compass, MapPinned, Plus, Sparkles, TrendingUp } from "lucide-react";

import { AdminDestinationCatalogPreview } from "@/src/components/admin/AdminDestinationCatalogPreview";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { destinationCards } from "@/src/data/mockData";

const destinationStats = [
  { label: "Published destinations", note: "3 active editorial pages", value: `${destinationCards.length}` },
  { label: "Average rating", note: "Across current collection", value: "4.8" },
  { label: "Lead destination", note: "Highest inquiry volume", value: "Nordic Fjords" },
  { label: "Launch candidates", note: "Ready for merchandising", value: "04" },
] as const;

const regionRows = [
  {
    focus: "Luxury expedition",
    market: "Northern Europe",
    status: "Scaling",
    title: "Nordic Fjords",
    trend: "+22%",
  },
  {
    focus: "Urban culture",
    market: "Western Europe",
    status: "Stable",
    title: "London Essence",
    trend: "+9%",
  },
  {
    focus: "Scenic heritage",
    market: "Central Europe",
    status: "Growing",
    title: "Bavarian Trails",
    trend: "+14%",
  },
] as const;

const regionStatusStyles: Record<(typeof regionRows)[number]["status"], string> = {
  Growing: "bg-emerald-100 text-emerald-900",
  Scaling: "bg-stone-900 text-white",
  Stable: "bg-stone-200 text-stone-700",
};

const watchlistItems = [
  {
    detail: "Strong premium demand and the highest editorial engagement in the current set.",
    icon: TrendingUp,
    title: "Nordic Fjords should get homepage placement",
  },
  {
    detail: "Good search demand but weaker conversion. Needs sharper packaging and a clearer CTA.",
    icon: Compass,
    title: "London Essence needs positioning work",
  },
  {
    detail: "Balanced rating and price point make it a good cross-sell with tour itineraries.",
    icon: Sparkles,
    title: "Bavarian Trails fits bundle experiments",
  },
] as const;

function DestinationStatGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {destinationStats.map((item) => (
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

function RegionTablePanel() {
  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between border-b border-stone-200 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Market view
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Destination performance by positioning
            </h3>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">
                <th className="pb-1 pr-4">Destination</th>
                <th className="pb-1 pr-4">Market</th>
                <th className="pb-1 pr-4">Focus</th>
                <th className="pb-1 pr-4">Trend</th>
                <th className="pb-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {regionRows.map((row) => (
                <tr className="bg-stone-50 text-sm text-stone-600" key={row.title}>
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-stone-950">
                    {row.title}
                  </td>
                  <td className="px-4 py-4">{row.market}</td>
                  <td className="px-4 py-4">{row.focus}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-800">{row.trend}</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${regionStatusStyles[row.status]}`}>
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

function WatchlistPanel() {
  return (
    <Card className="border-none bg-stone-950 text-white">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
              Destination watchlist
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              What merchandising should do next
            </h3>
          </div>
          <MapPinned className="size-5 text-emerald-200" />
        </div>

        <div className="mt-6 space-y-3">
          {watchlistItems.map(({ detail, icon: Icon, title }) => (
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

export default function AdminDestinationsPage() {
  return (
    <AdminShell
      activePath="/admin/destinations"
      action={
        <Button asChild>
          <Link href="/admin/destinations/new">
            <Plus className="size-4" />
            Add destination
          </Link>
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Destination management"
      searchPlaceholder="Search destination, market, region..."
      sectionLabel="Destination portfolio, merchandising priority, and market signal across the editorial catalog."
      teamValue="sales"
    >
      <DestinationStatGrid />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <AdminDestinationCatalogPreview destinations={destinationCards} />
        <WatchlistPanel />
      </section>

      <RegionTablePanel />
    </AdminShell>
  );
}
