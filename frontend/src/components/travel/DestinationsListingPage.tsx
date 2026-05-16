import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Filter,
  MapPin,
  Sparkles,
} from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { Button } from "@/src/components/ui/button";
import {
  type DestinationCard,
  type TourCard,
} from "@/src/types/travel";

const destinationFilterGroups = [
  {
    options: ["Destination name", "Travel highlights", "Trip inspiration"],
    title: "Find a destination",
  },
  {
    options: ["Linked tours", "Linked hotels"],
    title: "Related inventory",
  },
] as const;

function DestinationsHero() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-12 pt-36 lg:px-24 lg:pb-16 lg:pt-44">
      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="mb-5 inline-flex rounded-full border border-emerald-800/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-800">
            Curated Destination Index
          </span>
          <h1 className="text-6xl font-black leading-[0.9] tracking-tighter text-stone-950 md:text-8xl lg:text-9xl">
            Global <span className="font-serif italic text-emerald-800">Destinations.</span>
          </h1>
        </div>
        <p className="max-w-xl text-lg font-light leading-relaxed text-stone-600 md:text-xl">
          An editorial survey of places worth traveling for: cinematic landscapes,
          cultural gravity, and refined hospitality signals that justify the journey.
        </p>
      </div>
    </section>
  );
}

function DestinationsSidebarFilters() {
  return (
    <aside className="w-full flex-shrink-0 lg:w-72">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_30px_80px_-55px_rgba(28,25,23,0.45)] lg:sticky lg:top-28">
        <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-800">Filters</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-stone-950">Choose destination</h2>
          </div>
          <Filter aria-hidden="true" className="size-5 text-emerald-800" />
        </div>

        <div className="space-y-7">
          {destinationFilterGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-stone-500">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <Button
                    aria-label={`Filter destinations by ${option}`}
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

function DestinationCardView({ destination }: Readonly<{ destination: DestinationCard }>) {
  return (
    <article className="group">
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_28px_80px_-50px_rgba(28,25,23,0.65)]">
        <Image
          alt={destination.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={destination.image}
        />
      </div>
      <div className="space-y-5 px-1">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            <MapPin className="size-3.5" />
            Editorial Pick
          </p>
          <h3 className="text-3xl font-black tracking-tight text-stone-950 transition-colors group-hover:text-emerald-800">
            {destination.title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-stone-600">{destination.description}</p>
        <div className="flex items-center justify-end border-t border-stone-200 pt-5">
          <Button asChild className="text-xs uppercase tracking-widest" size="sm" variant="ghost">
            <Link href={destination.href}>
              Explore
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function DestinationsListingContent({ destinations }: Readonly<{ destinations: readonly DestinationCard[] }>) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-8 flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Portfolio View</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Places with lasting pull</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-500">Showing {destinations.length} destinations</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">View:</span>
          <span className="text-sm font-semibold text-stone-950">Latest collection</span>
        </div>
      </div>
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCardView destination={destination} key={destination.href} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <Compass className="size-7" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">No featured destinations are live yet</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
            The editorial destination index is being refreshed. Check back shortly or explore other curated parts of the catalog.
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

function SuggestionCardView({ suggestion }: Readonly<{ suggestion: TourCard }>) {
  return (
    <article className="group">
      <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-stone-200">
        <Image
          alt={suggestion.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          src={suggestion.image}
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-stone-950">{suggestion.title}</h3>
          <p className="mt-1 text-sm text-stone-600">{suggestion.duration} · {suggestion.guests}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-bold text-emerald-800">{suggestion.price}</p>
      </div>
    </article>
  );
}

function PremiumExtensions({ suggestions }: Readonly<{ suggestions: readonly TourCard[] }>) {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-24 lg:px-24 lg:pb-32">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Beyond The Core</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Add-on escapes and private extensions</h2>
        </div>
        <Button className="rounded-full bg-stone-950 px-6 text-xs uppercase tracking-widest text-white hover:bg-emerald-900">
          <Sparkles className="size-4" />
          Request Bespoke Plan
        </Button>
      </div>
      {suggestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {suggestions.map((suggestion) => (
            <SuggestionCardView key={suggestion.title} suggestion={suggestion} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <Sparkles className="size-7" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">No private extensions to show yet</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
            Bespoke add-on escapes are being updated. Start with a destination above or request a custom itinerary directly.
          </p>
          <Button asChild className="mt-6 rounded-full px-6" variant="outline">
            <Link href="/contact">
              Request a custom itinerary
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

export default function DestinationsListingPage({ destinations, suggestions }: Readonly<{ destinations: readonly DestinationCard[]; suggestions: readonly TourCard[] }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Destinations" />
      <DestinationsHero />
      <section className="mx-auto max-w-screen-2xl px-8 pb-24 pt-8 lg:px-24 lg:pb-32">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <DestinationsSidebarFilters />
          <DestinationsListingContent destinations={destinations} />
        </div>
      </section>
      <PremiumExtensions suggestions={suggestions} />
      <TravelFooter />
    </main>
  );
}
