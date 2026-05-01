import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight, CircleX, Fish, Leaf, Sailboat, Utensils } from "lucide-react";

import { TourBookingCard } from "@/src/components/travel/TourBookingCard";
import type { TourDetail, TourDetailHighlight } from "@/src/types/travel";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

function HighlightIcon({ icon }: Readonly<{ icon: TourDetailHighlight["icon"] }>) {
  const className = "size-8 text-emerald-800";

  if (icon === "boat") {
    return <Sailboat className={className} />;
  }

  if (icon === "fish") {
    return <Fish className={className} />;
  }

  if (icon === "food") {
    return <Utensils className={className} />;
  }

  return <Leaf className={className} />;
}

function DetailHero({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <section className="relative flex h-[920px] w-full items-end overflow-hidden">
      <Image alt={tour.heroAlt} className="object-cover" fill priority sizes="100vw" src={tour.heroImage} />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-stone-950/10 to-transparent" />
      <div className="relative mx-auto w-full max-w-screen-2xl px-8 pb-24 md:pb-32 lg:px-24">
        <div className="max-w-4xl">
          <TourBreadcrumb title={tour.title} />
          <div className="mb-6 flex flex-wrap gap-4">
            {[tour.duration, tour.guests].map((tag) => (
              <span className="rounded-full bg-emerald-100/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-950 backdrop-blur-md" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-[0.95] tracking-tighter text-white md:text-8xl">
            {tour.title}
          </h1>
          <p className="max-w-2xl text-xl font-light leading-relaxed text-white/90 md:text-2xl">{tour.subtitle}</p>
        </div>
      </div>
    </section>
  );
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
        <li aria-current="page" className="max-w-full truncate text-emerald-100">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function ExperienceSection({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <section className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
      <div>
        <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">The Experience</h2>
        <div className="space-y-6 text-lg leading-relaxed text-stone-600">
          {tour.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-stone-100 p-10 md:p-12">
        <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">Tour Highlights</h2>
        <ul className="space-y-8">
          {tour.highlights.map((highlight) => (
            <li className="flex items-start gap-4" key={highlight.title}>
              <HighlightIcon icon={highlight.icon} />
              <div>
                <h4 className="font-bold text-stone-950">{highlight.title}</h4>
                <p className="text-sm text-stone-600">{highlight.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ItinerarySection({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <section>
      <h2 className="mb-12 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">The Journey</h2>
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-stone-200 md:before:mx-auto md:before:translate-x-0">
        {tour.itinerary.map((step, index) => (
          <div className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse" key={step.title}>
            <div className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white md:left-1/2 md:-ml-5">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="w-[calc(100%-4rem)] rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:w-[calc(50%-2.5rem)]">
              <h3 className="mb-2 text-xl font-extrabold text-stone-950">{step.title}</h3>
              <p className="text-stone-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ tour }: Readonly<{ tour: TourDetail }>) {
  const [portrait, ...landscapes] = tour.gallery;

  return (
    <section>
      <h2 className="mb-12 text-sm font-bold uppercase tracking-[0.3em] text-emerald-800">Visual Journal</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-stone-200">
          <Image alt={portrait.alt} className="object-cover transition-transform duration-700 hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={portrait.image} />
        </div>
        <div className="grid grid-rows-2 gap-4">
          {landscapes.map((image) => (
            <div className="relative aspect-video overflow-hidden rounded-xl bg-stone-200" key={image.image}>
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
  const color = variant === "included" ? "text-emerald-800" : "text-rose-700";
  const dot = variant === "included" ? "bg-emerald-700/40" : "bg-rose-700/40";

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-xl font-bold text-stone-950">
        <Icon className={`size-5 ${color}`} />
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li className="flex items-center gap-3 text-stone-600" key={item}>
            <span className={`size-1.5 rounded-full ${dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TourDetailPage({ tour }: Readonly<{ tour: TourDetail }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />
      <DetailHero tour={tour} />
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-16 px-8 py-24 md:gap-24 md:py-40 lg:grid-cols-12 lg:px-24">
        <div className="space-y-24 md:space-y-40 lg:col-span-8">
          <ExperienceSection tour={tour} />
          <ItinerarySection tour={tour} />
          <GallerySection tour={tour} />
          <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <InclusionList items={tour.inclusions} title="What's Included" variant="included" />
            <InclusionList items={tour.exclusions} title="Exclusions" variant="excluded" />
          </section>
        </div>
        <TourBookingCard tour={tour} />
      </div>
      <TravelFooter />
    </main>
  );
}
