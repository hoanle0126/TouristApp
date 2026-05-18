import Link from "next/link";
import { Compass, MapPinned, Plus, Sparkles, TrendingUp } from "lucide-react";

import { AdminDestinationCatalogPreview } from "@/src/components/admin/AdminDestinationCatalogPreview";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getDestinationDetails, getDestinations } from "@/src/lib/api/destinations";
import type { DestinationCard } from "@/src/types/travel";

function getDestinationStats(destinations: readonly DestinationCard[]) {
  const leadDestination = destinations[0]?.title ?? "—";

  return [
    { label: "Published destinations", note: `${destinations.length} active editorial pages`, value: `${destinations.length}` },
    { label: "Lead destination", note: "Highest inquiry volume", value: leadDestination },
    { label: "Launch candidates", note: "Ready for merchandising", value: destinations.length.toString().padStart(2, "0") },
  ] as const;
}

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
    detail: "Strong destination fit makes it a good cross-sell with tour itineraries.",
    icon: Sparkles,
    title: "Bavarian Trails fits bundle experiments",
  },
] as const;

function DestinationStatGrid({ destinations }: { readonly destinations: readonly DestinationCard[] }) {
  const destinationStats = getDestinationStats(destinations);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {destinationStats.map((item) => (
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

function WatchlistPanel() {
  return (
    <Card className="border-none bg-stone-950 text-white">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-200">
              Destination watchlist
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">
              What merchandising should do next
            </h3>
          </div>
          <MapPinned className="size-5 text-red-200" />
        </div>

        <div className="mt-6 space-y-3">
          {watchlistItems.map(({ detail, icon: Icon, title }) => (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={title}>
              <div className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="size-4 text-red-200" />
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

export default async function AdminDestinationsPage() {
  const [destinations, destinationDetails] = await Promise.all([
    getDestinations(),
    getDestinationDetails(),
  ]);

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
      <DestinationStatGrid destinations={destinations} />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <AdminDestinationCatalogPreview destinationDetails={destinationDetails} destinations={destinations} />
        <WatchlistPanel />
      </section>
    </AdminShell>
  );
}
