import Link from "next/link";
import { ArrowRight, BedDouble, Hotel, Pencil, Plus, Sparkles, Star } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { slugifyHotelName } from "@/src/components/admin/adminHotelFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getHotels } from "@/src/lib/api/hotels";
import type { HotelCard } from "@/src/types/travel";

function getHotelStats(hotels: readonly HotelCard[]) {
  const premiumProperties = hotels.filter((hotel) => hotel.badge).length;

  return [
    { label: "Published stays", value: `${hotels.length}`, note: "Active in collection" },
    { label: "Avg. nightly rate", value: hotels[0]?.price ?? "—", note: "Across current partners" },
    { label: "Premium properties", value: premiumProperties.toString().padStart(2, "0"), note: "Flagged for editorial push" },
    { label: "Renewals pending", value: "03", note: "Contract review this month" },
  ] as const;
}

function getHotelEditHref(hotel: HotelCard) {
  return `/admin/hotels/${hotel.slug ?? slugifyHotelName(hotel.name)}/edit`;
}

export default async function AdminHotelsPage() {
  const hotels = await getHotels();
  const hotelStats = getHotelStats(hotels);

  return (
    <AdminShell
      activePath="/admin/hotels"
      action={
        <Button asChild>
          <Link href="/admin/hotels/new">
            <Plus className="size-4" />
            Add hotel
          </Link>
        </Button>
      }
      dateLabel="Wednesday, April 29, 2026"
      pageTitle="Hotel management"
      searchPlaceholder="Search hotel, city, partner..."
      sectionLabel="Property portfolio, rate posture, and partner health for the stay collection."
      teamValue="sales"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {hotelStats.map((item) => (
          <Card className="border-none bg-white" key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-stone-500">{item.label}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight text-stone-950">{item.value}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-800">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <Card>
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">Hotel portfolio</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">Current stays and merchandising posture</h3>
              </div>
              <Button disabled size="sm" variant="ghost">
                Review inventory
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="mt-6 grid gap-3">
              {hotels.map((hotel) => (
                <div className="rounded-2xl bg-stone-50 p-4" key={hotel.name}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-bold tracking-tight text-stone-950">{hotel.name}</p>
                      <p className="mt-1 text-sm text-stone-500">{hotel.location}</p>
                    </div>
                    <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-stone-950">{hotel.price}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-stone-600" key={amenity}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={getHotelEditHref(hotel)}>
                        <Pencil className="size-4" />
                        Edit hotel
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-stone-950 text-white">
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-200">Property watchlist</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">Partner notes</h3>
              </div>
              <Hotel className="size-5 text-red-200" />
            </div>
            <div className="mt-6 space-y-3">
              {[
                { icon: Star, title: "Shining Riverside leads conversion", detail: "Strongest mix of rate, amenities, and inquiry quality in the current set." },
                { icon: BedDouble, title: "Suite inventory should be expanded", detail: "Premium room types are filling faster than standard categories for long-stay bookings." },
                { icon: Sparkles, title: "Editorial refresh due", detail: "Two partner listings need updated imagery and tighter copy before the next campaign push." },
              ].map((item) => (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={item.title}>
                  <div className="flex gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <item.icon className="size-4 text-red-200" />
                    </span>
                    <div>
                      <p className="font-semibold tracking-tight">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/65">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AdminShell>
  );
}
