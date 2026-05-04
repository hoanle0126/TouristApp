import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search, SlidersHorizontal, Users } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { HotelCard } from "@/src/types/travel";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

const hotelFilters = [
  { icon: MapPin, label: "Location", value: "Global Collection" },
  { icon: CalendarDays, label: "Dates", value: "Select timeframe" },
  { icon: Users, label: "Guests", value: "2 Travelers" },
  { icon: SlidersHorizontal, label: "Budget", value: "From $500" },
] as const;

function HotelsHero() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-12 pt-36 lg:px-24 lg:pb-16 lg:pt-44">
      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="mb-5 inline-flex rounded-full border border-emerald-800/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-800">
            Private Hotel Index
          </span>
          <h1 className="text-6xl font-black leading-[0.9] tracking-tighter text-stone-950 md:text-8xl lg:text-9xl">
            Curated <span className="font-serif italic text-emerald-800">Stays.</span>
          </h1>
        </div>
        <p className="max-w-xl text-lg font-light leading-relaxed text-stone-600 md:text-xl">
          A digital monograph of the world&apos;s most evocative architectural retreats. Each sanctuary is personally vetted for its cultural depth, sustainable luxury, and unparalleled service.
        </p>
      </div>
    </section>
  );
}

function HotelsFilterBar() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 lg:px-24">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-3 shadow-[0_30px_80px_-45px_rgba(28,25,23,0.45)]">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          {hotelFilters.map(({ icon: Icon, label, value }) => (
            <Button
              aria-label={`Filter hotels by ${label}`}
              aria-haspopup="listbox"
              className="h-auto justify-start gap-4 rounded-[1.35rem] bg-stone-50 px-5 py-4 text-left text-stone-950 hover:bg-stone-100"
              key={label}
              type="button"
              variant="ghost"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-white text-emerald-800 shadow-sm">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">{label}</span>
                <span className="mt-1 block truncate text-sm font-bold text-stone-950">{value}</span>
              </span>
            </Button>
          ))}
          <Button aria-label="Search curated stays" className="h-full min-h-20 rounded-[1.35rem] bg-stone-950 px-8 text-white hover:bg-emerald-900" type="button">
            <Search className="size-5" />
            <span className="text-xs font-bold uppercase tracking-widest xl:sr-only 2xl:not-sr-only">Search</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function HotelCardView({ hotel, index }: Readonly<{ hotel: HotelCard; index: number }>) {
  return (
    <article className={index % 3 === 1 ? "group lg:mt-12" : "group"}>
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_28px_80px_-50px_rgba(28,25,23,0.65)]">
        <Image
          alt={hotel.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={hotel.image}
        />
        <div className="absolute inset-x-0 top-0 flex justify-between p-5">
          <span className="rounded-full bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-stone-950 backdrop-blur-md">
            {hotel.badge}
          </span>
          <span className="rounded-full bg-stone-950/75 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {hotel.price}
          </span>
        </div>
      </div>
      <div className="space-y-5 px-1">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            <MapPin className="size-3.5" />
            {hotel.location}
          </p>
          <h3 className="text-3xl font-black tracking-tight text-stone-950 transition-colors group-hover:text-emerald-800">{hotel.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-semibold text-stone-600" key={amenity}>
              {amenity}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-stone-200 pt-5">
          <span className="text-sm text-stone-500">
            From <strong className="text-lg text-stone-950">{hotel.price}</strong> / night
          </span>
          <Button asChild className="text-xs uppercase tracking-widest" size="sm" variant="ghost">
            <Link href={`/hotels/${hotel.slug}`}>
              View Stay
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function HotelsGrid({ hotels }: Readonly<{ hotels: readonly HotelCard[] }>) {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 py-24 lg:px-24 lg:py-32">
      <div className="mb-12 flex flex-col justify-between gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Editorial Selection</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Architectural retreats</h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-stone-500">
          Six handpicked properties where spatial drama, cultural context, and hospitality craft become the destination.
        </p>
      </div>
      {hotels.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel, index) => (
            <HotelCardView hotel={hotel} index={index} key={hotel.slug ?? hotel.name} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <Search className="size-7" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">No curated stays are live right now</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
            Our hotel index is being refreshed. Check back soon or browse destinations while new stays are being published.
          </p>
          <Button asChild className="mt-6 rounded-full px-6" variant="outline">
            <Link href="/destinations">
              Browse destinations
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

function PrivateCurationCta() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-24 lg:px-24 lg:pb-32">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-950 px-8 py-16 text-white md:px-14 lg:px-20">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-35 lg:block">
          <Image
            alt="Luxurious suite terrace overlooking a tranquil resort pool at sunset"
            className="object-cover"
            fill
            sizes="50vw"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPOgbPq_XwQHxqcdV8CyyHHmuASmYTCmNh8iC7Qa31o9m88sCugttUqmVEJ9bS5RPzElQEn3SYK-jK_z3ZTIrVazznHG0pefnGU_WXvkW-iVA_-PFDRH_IKzie9_WL8XUqXMxcvGZ2MQlUIH04iFzpzi0-Dw9h8BagV-0zsnmNHMyzCNzFKofG6m8Jgt1H4eP9Kmlfbm3tlEv7MKPMhepN0PChYlQh5bYZy_lqG6VpCO0OfdJSwkDnmnv66dBHDhuW2r9OkGCMoo0l"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/95 to-stone-950/55" />
        <div className="relative max-w-2xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-emerald-200">Bespoke Concierge</p>
          <h2 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">Can&apos;t find your ideal retreat?</h2>
          <p className="mb-10 text-lg font-light leading-relaxed text-white/75">
            Let our bespoke travel concierges curate a private itinerary tailored specifically to your aesthetic and lifestyle requirements.
          </p>
          <Button className="rounded-full bg-white px-8 py-6 text-xs font-black uppercase tracking-widest text-stone-950 hover:bg-emerald-100">
            Request Private Curation
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function HotelsListingPage({ hotels }: Readonly<{ hotels: readonly HotelCard[] }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Hotels" />
      <HotelsHero />
      <HotelsFilterBar />
      <HotelsGrid hotels={hotels} />
      <PrivateCurationCta />
      <TravelFooter />
    </main>
  );
}
