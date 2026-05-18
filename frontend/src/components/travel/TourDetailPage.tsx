import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Coffee,
  Compass,
  Fish,
  Footprints,
  Hotel,
  Leaf,
  Map,
  Mountain,
  Sailboat,
  Sparkles,
  Utensils,
} from "lucide-react";

import { TourBookingCard } from "@/src/components/travel/TourBookingCard";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import type { TourDetail, TourDetailHighlight } from "@/src/types/travel";

const highlightIcons = {
  boat: Sailboat,
  camera: Camera,
  coffee: Coffee,
  compass: Compass,
  eco: Leaf,
  fish: Fish,
  food: Utensils,
  hotel: Hotel,
  map: Map,
  mountain: Mountain,
  sparkles: Sparkles,
  walk: Footprints,
} satisfies Record<TourDetailHighlight["icon"], typeof Sailboat>;

function HighlightIcon({ icon }: Readonly<{ icon: TourDetailHighlight["icon"] }>) {
  const Icon = highlightIcons[icon];

  return <Icon className="size-6 text-red-800" />;
}

function TourBreadcrumb({ title }: Readonly<{ title: string }>) {
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
          <Link className="transition-colors hover:text-white" href="/tours">
            Tours
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4 text-white/40" />
        </li>
        <li aria-current="page" className="max-w-full truncate text-red-100">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function DetailHero({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <section className="relative flex min-h-[760px] w-full items-end overflow-hidden pt-40 md:min-h-[820px]">
      <Image alt={tour.heroAlt} className="object-cover" fill priority sizes="100vw" src={tour.heroImage} />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/20" />
      <div className="relative mx-auto w-full max-w-screen-2xl px-8 pb-20 lg:px-24">
        <div className="max-w-5xl">
          <TourBreadcrumb title={tour.title} />
          <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-red-100 backdrop-blur">
            Private Travel Desk
          </div>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.94] tracking-tighter text-white md:text-7xl lg:text-8xl">
            {tour.title}
          </h1>
          <p className="mt-7 max-w-3xl text-xl font-light leading-relaxed text-white/86 md:text-2xl">{tour.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[tour.duration, tour.guests, tour.type].map((tag) => (
              <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-stone-950 backdrop-blur" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TourQuickFacts({ tour }: Readonly<{ tour: TourDetail }>) {
  const facts = [
    ["Duration", tour.duration],
    ["Guests", tour.guests],
    ["From", tour.price],
    ["Availability", tour.availability],
  ] as const;

  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-screen-2xl px-8 lg:px-24">
      <div className="grid grid-cols-2 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-2xl shadow-stone-950/10 md:grid-cols-4">
        {facts.map(([label, value]) => (
          <div className="border-b border-r border-stone-200 px-5 py-6 last:border-r-0 md:border-b-0 md:px-8" key={label}>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">{label}</p>
            <p className="mt-2 text-lg font-black tracking-tight text-stone-950 md:text-xl">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyPanel({ title }: Readonly<{ title: string }>) {
  return (
    <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-8 text-sm leading-6 text-stone-500">
      {title}
    </div>
  );
}

function ExperienceSection({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <section className="grid grid-cols-1 gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm shadow-stone-950/5 md:p-10">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-red-800">Journey overview</p>
        <h2 className="mb-7 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">An itinerary shaped like a private escape</h2>
        <div className="space-y-5 text-base leading-8 text-stone-600 md:text-lg">
          {tour.description.length > 0 ? tour.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Detailed introduction content is being updated.</p>}
        </div>
      </div>
      <div className="rounded-[2rem] border border-stone-200 bg-stone-100 p-8 md:p-10">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-red-700">Highlights</p>
        {tour.highlights.length > 0 ? (
          <ul className="space-y-5">
            {tour.highlights.map((highlight) => (
              <li className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm" key={highlight.title}>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <HighlightIcon icon={highlight.icon} />
                </div>
                <div>
                  <h3 className="font-black text-stone-950">{highlight.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-stone-600">{highlight.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyPanel title="Tour highlights are being updated." />
        )}
      </div>
    </section>
  );
}

function ItinerarySection({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <section>
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-red-800">Itinerary</p>
          <h2 className="text-3xl font-black tracking-tight text-stone-950 md:text-4xl">Key stages of the experience</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-stone-500">Each stage is presented clearly so travelers can quickly understand the pace and focus of the journey.</p>
      </div>
      {tour.itinerary.length > 0 ? (
        <div className="space-y-5">
          {tour.itinerary.map((step, index) => (
            <article className="grid grid-cols-[auto_1fr] gap-5 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:p-7" key={step.title}>
              <div className="flex size-14 items-center justify-center rounded-full bg-stone-950 text-sm font-black text-white">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-stone-950">{step.title}</h3>
                <p className="mt-2 whitespace-pre-line leading-7 text-stone-600">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyPanel title="The detailed itinerary is being updated." />
      )}
    </section>
  );
}

function GallerySection({ tour }: Readonly<{ tour: TourDetail }>) {
  const gallery = tour.gallery.length > 0 ? tour.gallery : [{ alt: tour.heroAlt, image: tour.heroImage, layout: "landscape" as const }];
  const [featured, ...rest] = gallery;

  return (
    <section>
      <div className="mb-10">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-red-800">Visual Journal</p>
        <h2 className="text-3xl font-black tracking-tight text-stone-950 md:text-4xl">A look before you go</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 md:aspect-auto md:min-h-[34rem]">
          <Image alt={featured.alt} className="object-cover transition-transform duration-700 hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={featured.image} />
        </div>
        <div className="grid gap-4">
          {(rest.length > 0 ? rest.slice(0, 3) : gallery).map((image) => (
            <div className="relative min-h-48 overflow-hidden rounded-[2rem] bg-stone-200" key={`${image.image}-${image.alt}`}>
              <Image alt={image.alt} className="object-cover transition-transform duration-700 hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={image.image} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InclusionList({ items, title, variant }: Readonly<{ items: readonly string[]; title: string; variant: "included" | "excluded" }>) {
  const Icon = variant === "included" ? CheckCircle2 : CircleX;
  const color = variant === "included" ? "text-red-800" : "text-rose-700";
  const dot = variant === "included" ? "bg-red-700/50" : "bg-rose-700/50";

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-stone-950">
        <Icon className={`size-5 ${color}`} />
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li className="flex items-start gap-3 leading-6 text-stone-600" key={item}>
              <span className={`mt-2 size-1.5 rounded-full ${dot}`} />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-stone-500">Information is being updated.</p>
      )}
    </div>
  );
}

function ServicePromiseStrip() {
  const promises = ["Private itinerary advice", "Support before and during travel", "Carefully selected stay partners"];

  return (
    <section className="rounded-[2rem] bg-stone-950 p-8 text-white md:p-10">
      <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-red-300">Why book this journey</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {promises.map((promise) => (
          <div className="rounded-2xl border border-white/10 bg-white/8 p-5" key={promise}>
            <Sparkles className="mb-4 size-5 text-red-300" />
            <p className="font-black tracking-tight">{promise}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TourDetailPage({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />
      <DetailHero tour={tour} />
      <TourQuickFacts tour={tour} />
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-16 px-8 py-20 md:gap-20 md:py-28 lg:grid-cols-12 lg:px-24">
        <div className="space-y-20 md:space-y-28 lg:col-span-8">
          <ExperienceSection tour={tour} />
          <ServicePromiseStrip />
          <ItinerarySection tour={tour} />
          <GallerySection tour={tour} />
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InclusionList items={tour.inclusions} title="Included" variant="included" />
            <InclusionList items={tour.exclusions} title="Not included" variant="excluded" />
          </section>
        </div>
        <TourBookingCard tour={tour} />
      </div>
      <TravelFooter />
    </main>
  );
}
