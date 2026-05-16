"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { TourCard } from "@/src/types/travel";

function buildHighlights(tour: TourCard) {
  return [tour.destination.title, tour.duration, tour.guests].filter(Boolean);
}

export function RegionalHighlightsSection({ tours }: Readonly<{ tours: readonly TourCard[] }>) {
  const visibleTours = tours.slice(0, 8);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const updateScrollControls = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    queueMicrotask(updateScrollControls);
    emblaApi.on("select", updateScrollControls);
    emblaApi.on("reInit", updateScrollControls);

    return () => {
      emblaApi.off("select", updateScrollControls);
      emblaApi.off("reInit", updateScrollControls);
    };
  }, [emblaApi, updateScrollControls]);

  useEffect(() => {
    if (!emblaApi || visibleTours.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
        return;
      }

      emblaApi.scrollTo(0);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [emblaApi, visibleTours.length]);

  if (visibleTours.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-linear-to-br from-violet-950 via-indigo-900 to-sky-700 py-16 text-white md:py-20">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-6 lg:px-8">
        <div className="flex w-full flex-col justify-center lg:min-h-145 lg:w-[320px] lg:flex-none">
          <p className="text-sm font-semibold text-white/75">Collection</p>
          <h2 className="mt-4 max-w-56 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
            Featured Tours
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/78 sm:text-base">
            Live tour deals from the backend catalog, shown in a horizontal carousel for quick browsing.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full bg-pink-500 px-6 text-sm font-bold text-white hover:bg-pink-400" size="lg">
              <Link href="/tours">
                Explore now
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button aria-label="Previous tour" className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20" disabled={!canScrollPrev} onClick={scrollPrev} size="icon" variant="outline">
                <ChevronLeft className="size-5" />
              </Button>
              <Button aria-label="Next tour" className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20" disabled={!canScrollNext} onClick={scrollNext} size="icon" variant="outline">
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden py-1" ref={emblaRef}>
          <div className="flex gap-5 pb-3">
            {visibleTours.map((tour, index) => (
              <article className="group flex min-h-full min-w-0 flex-[0_0_288px] flex-col overflow-hidden rounded-3xl bg-white text-stone-950 shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:flex-[0_0_320px] lg:flex-[0_0_328px]" key={tour.slug ?? tour.title}>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    alt={tour.alt}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1280px) 328px, (min-width: 640px) 320px, 288px"
                    src={tour.image}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-stone-950 shadow-lg">
                    {tour.badge ?? `Tour ${index + 1}`}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-700">
                    {tour.destination.title}
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-tight tracking-tight text-stone-950">
                    {tour.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
                    {tour.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {buildHighlights(tour).map((highlight) => (
                      <span
                        className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-600"
                        key={highlight}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <p className="text-sm font-black text-pink-600">{tour.price}</p>
                    <Button asChild className="rounded-full bg-violet-800 px-4 text-white hover:bg-violet-700" size="sm">
                      <Link href={tour.slug ? `/tours/${tour.slug}` : "/tours"}>
                        View details
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
