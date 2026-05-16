import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Filter } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { TourCard } from "@/src/types/travel";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

const filterGroups = [
  {
    options: ["Tour name", "Linked destination", "Linked hotel"],
    title: "Find your tour",
  },
  {
    options: ["Travel style", "Trip length"],
    title: "Journey details",
  },
  {
    options: ["Departure date", "Availability"],
    title: "Booking needs",
  },
] as const;

function ToursSidebarFilters() {
  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_30px_80px_-55px_rgba(28,25,23,0.45)] lg:sticky lg:top-28">
        <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-800">Filters</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-stone-950">Refine journeys</h2>
          </div>
          <Filter aria-hidden="true" className="size-5 text-emerald-800" />
        </div>
        <div className="space-y-7">
          {filterGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-stone-500">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <Button
                    aria-label={`Filter tours by ${option}`}
                    className="rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:border-emerald-800/40 hover:bg-stone-50 hover:text-stone-950"
                    key={option}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function TourCardView({ tour }: Readonly<{ tour: TourCard }>) {
  return (
    <article className="group">
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-xl bg-stone-200">
        <Image
          alt={tour.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={tour.image}
        />
        {tour.badge ? (
          <div className="absolute left-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-950">
            {tour.badge}
          </div>
        ) : null}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-stone-500">
          <span>{tour.duration}</span>
          <span className="size-1 rounded-full bg-stone-300" />
          <span>{tour.guests}</span>
        </div>
        <h3 className="text-2xl font-extrabold tracking-tight text-stone-950 transition-colors group-hover:text-emerald-800">
          {tour.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{tour.description}</p>
        <div className="flex items-center justify-between border-t border-stone-200 pt-4">
          <span className="text-lg font-extrabold text-stone-950">From {tour.price}</span>
          <Button asChild className="text-xs uppercase tracking-widest" size="sm" variant="ghost">
            <Link href={`/tours/${tour.slug}`}>
              View Details
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ToursHero() {
  return (
    <section className="mx-auto mb-20 max-w-screen-2xl px-8 pt-32 lg:px-24">
      <div className="max-w-3xl">
        <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
          Curated Collection
        </span>
        <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tighter text-stone-950 md:text-7xl">
          Tours &amp; Journeys
        </h1>
        <p className="text-xl font-light leading-relaxed text-stone-600">
          Explore our meticulously crafted itineraries designed for the discerning traveler. From the rugged peaks of the Andes to the quiet temples of Kyoto, every journey is a masterpiece of discovery.
        </p>
      </div>
    </section>
  );
}

function ToursListingContent({ tours }: Readonly<{ tours: readonly TourCard[] }>) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-8 flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Curated Collection</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Tours &amp; Journeys</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">Showing {tours.length} journeys</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">View:</span>
          <span className="text-sm font-semibold text-stone-950">Latest collection</span>
        </div>
      </div>
      {tours.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
            {tours.map((tour) => (
              <TourCardView key={tour.slug ?? tour.title} tour={tour} />
            ))}
          </div>
          <div className="mt-24 flex flex-col items-center gap-8">
            <Button className="px-12 py-4 text-xs uppercase tracking-widest" variant="outline">
              Load More Journeys
            </Button>
            <div className="flex items-center gap-6">
              <button aria-label="Previous page" className="text-stone-300 transition-colors hover:text-stone-950" type="button">
                <ArrowLeft className="size-5" />
              </button>
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest">
                <span className="text-stone-950">01</span>
                <span className="h-px w-8 bg-stone-300" />
                <span className="text-stone-400">08</span>
              </div>
              <button aria-label="Next page" className="text-stone-950 transition-colors hover:text-emerald-800" type="button">
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <Filter className="size-7" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">No journeys are available right now</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
            Our curated collection is being refreshed. Try again soon or browse other parts of the catalog for inspiration.
          </p>
          <Button asChild className="mt-6 rounded-full px-6" variant="outline">
            <Link href="/search">
              Explore the catalog
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ToursListingPage({ tours }: Readonly<{ tours: readonly TourCard[] }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />
      <ToursHero />
      <section className="mx-auto mb-24 max-w-screen-2xl px-8 lg:px-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <ToursSidebarFilters />
          <ToursListingContent tours={tours} />
        </div>
      </section>
      <TravelFooter />
    </main>
  );
}
