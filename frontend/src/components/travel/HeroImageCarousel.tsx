"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

interface HeroImageSlide {
  readonly alt: string;
  readonly image: string;
}

interface HeroImageCarouselProps {
  readonly slides: readonly HeroImageSlide[];
}

export function HeroImageCarousel({ slides }: Readonly<HeroImageCarouselProps>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeSlides = useMemo(() => (slides.length > 0 ? slides : []), [slides]);

  const updateSelectedIndex = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || safeSlides.length <= 1) {
      return;
    }

    queueMicrotask(updateSelectedIndex);
    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("reInit", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("reInit", updateSelectedIndex);
    };
  }, [emblaApi, safeSlides.length, updateSelectedIndex]);

  useEffect(() => {
    if (!emblaApi || safeSlides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [emblaApi, safeSlides.length]);

  if (safeSlides.length === 0) {
    return null;
  }

  return (
    <>
      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {safeSlides.map((slide) => (
            <div className="relative h-full min-w-0 shrink-0 grow-0 basis-full" key={slide.image}>
              <Image alt={slide.alt} className="object-cover brightness-75" fill priority sizes="100vw" src={slide.image} />
            </div>
          ))}
        </div>
      </div>
      {safeSlides.length > 1 ? (
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {safeSlides.map((slide, index) => (
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all duration-300 ${index === selectedIndex ? "w-10 bg-white" : "w-4 bg-white/45"}`}
              key={slide.image}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
