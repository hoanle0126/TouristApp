import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown, Filter } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { tourCards, type TourCard } from "@/src/data/mockData";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

const filters = ["Destination", "Duration", "Travel Style", "Price Range"] as const;

function FilterBar() {
  return (
    <section className="mx-auto mb-16 max-w-screen-2xl px-8 lg:px-24">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-stone-100 p-2 shadow-[0_20px_40px_-20px_rgba(26,28,26,0.12)]">
        {filters.map((filter) => (
          <Button
            aria-label={`Filter by ${filter}`}
            aria-haspopup="listbox"
            className={
              filter === "Travel Style"
                ? "min-w-[200px] flex-1 justify-between bg-emerald-700 px-6 py-4 text-sm font-medium text-white hover:bg-emerald-800"
                : "min-w-[200px] flex-1 justify-between bg-white px-6 py-4 text-sm font-medium text-stone-600 hover:bg-stone-50"
            }
            key={filter}
            type="button"
          >
            <span>{filter}</span>
            <ChevronDown className="size-4" />
          </Button>
        ))}
        <Button aria-label="Apply filters" className="size-14 bg-stone-950 text-stone-50 hover:bg-emerald-900" size="icon">
          <Filter className="size-5" />
        </Button>
      </div>
    </section>
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
            <Link href="/tours/bay-mau-coconut-forest">
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

function ToursGrid() {
  return (
    <section className="mx-auto mb-24 max-w-screen-2xl px-8 lg:px-24">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {tourCards.map((tour) => (
          <TourCardView key={tour.title} tour={tour} />
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
    </section>
  );
}

export default function ToursListingPage() {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />
      <ToursHero />
      <FilterBar />
      <ToursGrid />
      <TravelFooter />
    </main>
  );
}
