"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { VisualDiaryItem } from "@/src/data/mockData";

interface VisualDiaryCarouselProps {
  readonly items: readonly VisualDiaryItem[];
}

export function VisualDiaryCarousel({ items }: Readonly<VisualDiaryCarouselProps>) {
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

  return (
    <div className="mx-auto max-w-screen-2xl px-6 md:px-10 lg:px-16">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Visual Diary
          </span>
          <h2 className="text-4xl font-extrabold tracking-tighter text-stone-950 md:text-5xl">
            Moments Captured
          </h2>
        </div>
        <div className="hidden gap-4 md:flex">
          <Button aria-label="Previous moment" disabled={!canScrollPrev} onClick={scrollPrev} size="icon" variant="outline">
            <ChevronLeft className="size-5" />
          </Button>
          <Button aria-label="Next moment" disabled={!canScrollNext} onClick={scrollNext} size="icon" variant="outline">
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 md:gap-8">
          {items.map((item) => (
            <article
              className={`group relative h-[420px] min-w-0 flex-[0_0_86%] overflow-hidden rounded-2xl sm:flex-[0_0_420px] md:h-[500px] ${item.wide ? "lg:flex-[0_0_600px]" : "lg:flex-[0_0_400px]"}`}
              key={item.title}
            >
              <Image
                alt={item.alt}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                fill
                sizes="(min-width: 1024px) 600px, (min-width: 640px) 420px, 86vw"
                src={item.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="mb-1 text-sm font-bold uppercase tracking-widest text-white/70">
                  {item.country}
                </p>
                <h3 className="text-3xl font-bold text-white">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-8 flex gap-3 md:hidden">
        <Button aria-label="Previous moment" disabled={!canScrollPrev} onClick={scrollPrev} size="icon" variant="outline">
          <ChevronLeft className="size-5" />
        </Button>
        <Button aria-label="Next moment" disabled={!canScrollNext} onClick={scrollNext} size="icon" variant="outline">
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
