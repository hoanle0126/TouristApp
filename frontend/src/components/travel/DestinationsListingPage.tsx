import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Filter,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { Button } from "@/src/components/ui/button";
import {
  type DestinationCard,
  type TourCard,
} from "@/src/types/travel";

const destinationFilters = [
  "Region",
  "Travel Mood",
  "Best Season",
  "Budget Range",
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

function DestinationsFilterBar() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 lg:px-24">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-3 shadow-[0_30px_80px_-45px_rgba(28,25,23,0.45)]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          {destinationFilters.map((filter) => (
            <Button
              aria-label={`Filter destinations by ${filter}`}
              aria-haspopup="listbox"
              className="min-h-20 justify-between rounded-[1.35rem] bg-stone-50 px-5 py-4 text-sm font-bold text-stone-950 hover:bg-stone-100"
              key={filter}
              type="button"
              variant="ghost"
            >
              <span>{filter}</span>
              <Compass className="size-4 text-emerald-800" />
            </Button>
          ))}
          <Button aria-label="Apply destination filters" className="h-full min-h-20 rounded-[1.35rem] bg-stone-950 px-8 text-white hover:bg-emerald-900" type="button">
            <Filter className="size-5" />
            <span className="text-xs font-bold uppercase tracking-widest xl:sr-only 2xl:not-sr-only">Filter</span>
          </Button>
        </div>
      </div>
    </section>
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
        <div className="absolute inset-x-0 top-0 flex justify-between p-5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-950 backdrop-blur-md">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {destination.rating}
          </span>
          <span className="rounded-full bg-stone-950/75 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
            From {destination.price}
          </span>
        </div>
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
        <div className="flex items-center justify-between border-t border-stone-200 pt-5">
          <span className="text-sm text-stone-500">
            Starting from <strong className="text-lg text-stone-950">{destination.price}</strong> / person
          </span>
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

function DestinationsGrid({ destinations }: Readonly<{ destinations: readonly DestinationCard[] }>) {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 py-24 lg:px-24 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Portfolio View</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Places with lasting pull</h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-stone-500">
          A compact destination index balancing scenic impact, cultural depth, and premium itinerary potential.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCardView destination={destination} key={destination.href} />
        ))}
      </div>
    </section>
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {suggestions.map((suggestion) => (
          <SuggestionCardView key={suggestion.title} suggestion={suggestion} />
        ))}
      </div>
    </section>
  );
}

export default function DestinationsListingPage({ destinations, suggestions }: Readonly<{ destinations: readonly DestinationCard[]; suggestions: readonly TourCard[] }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Destinations" />
      <DestinationsHero />
      <DestinationsFilterBar />
      <DestinationsGrid destinations={destinations} />
      <PremiumExtensions suggestions={suggestions} />
      <TravelFooter />
    </main>
  );
}
