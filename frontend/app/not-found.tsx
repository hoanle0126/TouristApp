import Link from "next/link";
import { ArrowRight, Compass, Search } from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { Button } from "@/src/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader />

      <section className="mx-auto flex min-h-screen max-w-screen-2xl items-center px-8 pb-24 pt-32 lg:px-24">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="mb-5 inline-flex rounded-full border border-emerald-800/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-800">
              Error 404
            </span>
            <h1 className="text-6xl font-black leading-[0.92] tracking-tighter text-stone-950 md:text-8xl lg:text-9xl">
              The page is <span className="font-serif italic text-emerald-800">off the map.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-stone-600 md:text-xl">
              The route you requested could not be found in our travel index. Return to the main collection or continue exploring curated destinations, stays, and journeys.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild className="min-h-14 rounded-full px-8 text-xs font-black uppercase tracking-[0.2em]">
                <Link href="/">
                  Back to home
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="min-h-14 rounded-full px-8 text-xs font-black uppercase tracking-[0.2em]" variant="outline">
                <Link href="/search">
                  Search the catalog
                  <Search className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-[0_30px_80px_-45px_rgba(28,25,23,0.45)] md:p-10">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
              <Compass className="size-8" />
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">
              Suggested routes
            </p>
            <div className="mt-6 space-y-4">
              <Link className="flex items-center justify-between rounded-[1.5rem] bg-stone-50 px-5 py-4 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-100" href="/destinations">
                Browse destinations
                <ArrowRight className="size-4 text-emerald-800" />
              </Link>
              <Link className="flex items-center justify-between rounded-[1.5rem] bg-stone-50 px-5 py-4 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-100" href="/tours">
                Explore journeys
                <ArrowRight className="size-4 text-emerald-800" />
              </Link>
              <Link className="flex items-center justify-between rounded-[1.5rem] bg-stone-50 px-5 py-4 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-100" href="/hotels">
                View curated stays
                <ArrowRight className="size-4 text-emerald-800" />
              </Link>
              <Link className="flex items-center justify-between rounded-[1.5rem] bg-stone-50 px-5 py-4 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-100" href="/blog">
                Read the journal
                <ArrowRight className="size-4 text-emerald-800" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TravelFooter />
    </main>
  );
}
