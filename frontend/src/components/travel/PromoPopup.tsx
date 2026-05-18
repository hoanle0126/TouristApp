"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { TravelEventCard } from "@/src/types/travel";

const SESSION_KEY = "promoPopup:dismissed";
const SHOW_DELAY_MS = 2500;

interface PromoPopupProps {
  readonly event: TravelEventCard;
}

export function PromoPopup({ event }: Readonly<PromoPopupProps>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (eventKey: KeyboardEvent) => {
      if (eventKey.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="promo-popup-title"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/65 px-4 py-8 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
    >
      <button
        aria-label="Close promotional popup"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
        tabIndex={-1}
        type="button"
      />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-stone-950/40 animate-in zoom-in-95 duration-300">
        <Button
          aria-label="Close promotional popup"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/95 text-stone-700 shadow-lg backdrop-blur hover:bg-white hover:text-stone-950"
          onClick={handleClose}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X className="size-5" />
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
            <Image
              alt={event.alt}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              src={event.image}
            />
            <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-900 backdrop-blur">
              {event.badge}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5 p-8 md:p-10">
            <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {event.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {event.location}
              </span>
            </div>
            <h2
              className="text-3xl font-black leading-tight tracking-tight text-stone-950 md:text-4xl"
              id="promo-popup-title"
            >
              {event.title}
            </h2>
            <p className="text-sm leading-6 text-stone-600 md:text-base">
              {event.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="bg-red-900 text-white hover:bg-red-950"
                size="lg"
              >
                <Link href={event.href} onClick={handleClose}>
                  Explore now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                className="text-stone-600 hover:text-stone-950"
                onClick={handleClose}
                size="lg"
                type="button"
                variant="ghost"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
