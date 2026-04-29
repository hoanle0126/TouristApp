import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { Button } from "@/src/components/ui/button";
import { type DestinationDetail } from "@/src/data/mockData";

function Breadcrumb({ title }: Readonly<{ title: string }>) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
        <li>
          <Link className="transition-colors hover:text-white" href="/">
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4 text-white/40" />
        </li>
        <li>
          <Link className="transition-colors hover:text-white" href="/destinations">
            Destinations
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4 text-white/40" />
        </li>
        <li aria-current="page" className="max-w-full truncate text-emerald-100">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function Hero({ detail }: Readonly<{ detail: DestinationDetail }>) {
  return (
    <section className="relative flex h-[880px] w-full items-end overflow-hidden">
      <Image alt={detail.card.alt} className="object-cover" fill priority sizes="100vw" src={detail.heroImage} />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent" />
      <div className="relative mx-auto w-full max-w-screen-2xl px-8 pb-24 md:pb-32 lg:px-24">
        <div className="max-w-4xl">
          <Breadcrumb title={detail.card.title} />
          <div className="mb-6 flex flex-wrap gap-4">
            <span className="rounded-full bg-emerald-100/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-950 backdrop-blur-md">
              {detail.heroEyebrow}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-950 backdrop-blur-md">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {detail.card.rating}
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-[0.95] tracking-tighter text-white md:text-8xl">
            {detail.card.title}
          </h1>
          <p className="max-w-2xl text-xl font-light leading-relaxed text-white/90 md:text-2xl">
            {detail.summary}
          </p>
        </div>
      </div>
    </section>
  );
}

function Overview({ detail }: Readonly<{ detail: DestinationDetail }>) {
  return (
    <section className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div>
        <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">Destination Overview</h2>
        <div className="space-y-6 text-lg leading-relaxed text-stone-600">
          {detail.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="rounded-[1.75rem] bg-stone-100 p-8 md:p-10">
        <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">Planning Facts</h2>
        <div className="space-y-4">
          {detail.facts.map((fact) => (
            <div className="flex items-center justify-between border-b border-stone-200 py-3" key={fact.label}>
              <span className="text-stone-500">{fact.label}</span>
              <span className="font-semibold text-stone-950">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spotlight({ detail }: Readonly<{ detail: DestinationDetail }>) {
  return (
    <section>
      <h2 className="mb-10 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">Why It Works</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {detail.spotlight.map((item) => (
          <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm" key={item.title}>
            <p className="mb-3 text-xl font-bold tracking-tight text-stone-950">{item.title}</p>
            <p className="text-sm leading-relaxed text-stone-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RelatedCollection({
  links,
  title,
}: Readonly<{
  links: DestinationDetail["relatedHotels"];
  title: string;
}>) {
  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">{title}</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Related picks</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {links.map((link) => (
          <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm" key={link.title}>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">{link.label}</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-stone-950">{link.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{link.meta}</p>
            <Button asChild className="mt-6 text-xs uppercase tracking-widest text-emerald-800" size="sm" variant="ghost">
              <Link href={link.href}>
                Explore
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CtaBand({ href, title }: Readonly<{ href: string; title: string }>) {
  return (
    <section>
      <div className="rounded-[2.5rem] bg-stone-950 px-8 py-14 text-white md:px-12 lg:px-16">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-emerald-200">Next Step</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">Turn {title} into a complete itinerary.</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Move from destination inspiration into bookable journeys, stays, and planning support.
            </p>
          </div>
          <Button asChild className="rounded-full bg-white px-8 text-xs uppercase tracking-widest text-stone-950 hover:bg-emerald-100">
            <Link href={href}>
              Build itinerary
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function DestinationDetailPage({ detail }: Readonly<{ detail: DestinationDetail }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Destinations" />
      <Hero detail={detail} />
      <div className="mx-auto max-w-screen-2xl space-y-24 px-8 py-24 md:space-y-32 md:py-32 lg:px-24">
        <Overview detail={detail} />
        <Spotlight detail={detail} />
        <RelatedCollection links={detail.relatedTours} title="Journeys" />
        <RelatedCollection links={detail.relatedHotels} title="Stays" />
        <CtaBand href="/search" title={detail.card.title} />
      </div>
      <TravelFooter />
    </main>
  );
}
