import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { RegionalHighlight } from "@/src/data/mockData";

export function RegionalHighlightsSection({ regions }: Readonly<{ regions: readonly RegionalHighlight[] }>) {
  if (regions.length === 0) {
    return null;
  }

  return (
    <section className="bg-stone-950 py-24 text-white">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-12 max-w-4xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-emerald-300">North - Central - South</p>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">Three regions, three distinct travel rhythms</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
            Each block opens a different content angle so your team can swap tours, destinations, and seasonal offers over time.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {regions.map((region) => (
            <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur" key={region.region}>
              <div className="relative h-72 overflow-hidden">
                <Image alt={region.alt} className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 1024px) 33vw, 100vw" src={region.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute left-6 top-6 flex size-16 items-center justify-center rounded-full bg-white text-2xl font-black text-stone-950 shadow-xl">
                  {region.region}
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-2xl font-black tracking-tight">{region.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{region.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {region.highlights.map((highlight) => (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100" key={highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>
                <Button asChild className="mt-7 rounded-full bg-white text-stone-950 hover:bg-emerald-100" size="sm">
                  <Link href={region.href}>
                    View journey
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
