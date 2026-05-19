"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { TravelMoment } from "@/src/types/travel";

interface TravelMomentsCarouselProps {
  readonly moments: readonly TravelMoment[];
}

export function TravelMomentsCarousel({
  moments,
}: Readonly<TravelMomentsCarouselProps>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: moments.length > 4,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);

    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  useEffect(() => {
    if (!emblaApi || moments.length <= 4) {
      return;
    }

    const intervalId = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [emblaApi, moments.length]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (moments.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex gap-5">
          {moments.map((moment) => (
            <li
              className="relative aspect-[4/3] min-w-0 shrink-0 grow-0 basis-full overflow-hidden rounded-2xl bg-stone-200 sm:basis-1/2 lg:basis-1/4"
              key={moment.id ?? moment.image}
            >
              <Image
                alt={moment.alt}
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                src={moment.image}
              />
              {moment.caption ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 via-stone-950/30 to-transparent p-4">
                  <p className="text-sm font-bold tracking-tight text-white">
                    {moment.caption}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {moments.length > 4 ? (
        <>
          <button
            aria-label="Previous moments"
            className="absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-lg shadow-stone-950/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 md:-left-4"
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Next moments"
            className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-lg shadow-stone-950/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 md:-right-4"
            disabled={!canScrollNext}
            onClick={scrollNext}
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      ) : null}
    </div>
  );
}
