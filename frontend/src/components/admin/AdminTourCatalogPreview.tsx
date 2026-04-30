"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Pencil, Users, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { slugifyTourTitle } from "@/src/components/admin/adminTourFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { TourCard } from "@/src/data/mockData";

interface AdminTourCatalogPreviewProps {
  readonly tours: readonly TourCard[];
}

function getTourInterest(tour: TourCard) {
  return tour.badge === "Featured" ? "High intent" : "Stable demand";
}

function getTourMargin(tour: TourCard) {
  return tour.price === "$8,900" ? "Premium" : "Core tier";
}

function AdminTourPreviewModal({ onClose, tour }: { readonly onClose: () => void; readonly tour: TourCard }) {
  const titleId = useId();
  const descriptionId = useId();
  const editHref = `/admin/tours/${slugifyTourTitle(tour.title)}/edit`;
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm" role="presentation">
      <div aria-hidden="true" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section
        ref={dialogRef}
        aria-describedby={descriptionId}
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1001] grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-[#fbfcf7] shadow-[0_40px_120px_-40px_rgba(28,25,23,0.75)] outline-none lg:grid-cols-[minmax(0,1fr)_360px]"
        role="dialog"
        tabIndex={-1}
      >
        <div className="relative min-h-[280px] overflow-hidden bg-stone-200 lg:min-h-[560px]">
          <Image alt={tour.alt} className="object-cover" fill sizes="(min-width: 1024px) 50vw, 100vw" src={tour.image} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/75 to-transparent p-6 text-white">
            <div className="flex flex-wrap gap-2">
              {tour.badge ? (
                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-950">
                  {tour.badge}
                </span>
              ) : null}
              <span className="rounded-full bg-stone-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">
                {tour.duration}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight" id={titleId}>
              {tour.title}
            </h2>
          </div>
        </div>

        <div className="flex max-h-[92vh] flex-col overflow-y-auto p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Tour preview</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-stone-950">{tour.price}</p>
            </div>
            <button
              aria-label="Close tour preview"
              className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:text-stone-950"
              onClick={onClose}
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mt-5 text-sm leading-7 text-stone-600" id={descriptionId}>
            {tour.description}
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-stone-100 p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                <Users className="size-4" />
                Capacity
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-950">{tour.guests}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Interest</p>
                <p className="mt-2 text-sm font-semibold text-stone-950">{getTourInterest(tour)}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Margin</p>
                <p className="mt-2 text-sm font-semibold text-stone-950">{getTourMargin(tour)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-stone-200 pt-5">
            <Button asChild>
              <Link href={editHref}>
                <Pencil className="size-4" />
                Edit details
              </Link>
            </Button>
            <Button onClick={onClose} type="button" variant="outline">
              Close
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AdminTourCatalogPreview({ tours }: AdminTourCatalogPreviewProps) {
  const [selectedTour, setSelectedTour] = useState<TourCard | null>(null);

  return (
    <>
      <Card>
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Tour catalog</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Signature products and occupancy posture
              </h3>
            </div>
            <Button disabled size="sm" variant="ghost">
              Refresh inventory
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {tours.map((tour) => (
              <article className="rounded-[1.75rem] border border-stone-200/80 bg-stone-50 p-5" key={tour.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {tour.badge ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900">
                          {tour.badge}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">
                        {tour.duration}
                      </span>
                    </div>
                    <h4 className="mt-3 text-2xl font-bold tracking-tight text-stone-950">{tour.title}</h4>
                  </div>
                  <span className="rounded-2xl bg-stone-900 px-3 py-2 text-sm font-semibold text-white">
                    {tour.price}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-stone-600">{tour.description}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Capacity</p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">{tour.guests}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Interest</p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">{getTourInterest(tour)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Margin</p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">{getTourMargin(tour)}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button onClick={() => setSelectedTour(tour)} size="sm" type="button" variant="outline">
                    <Eye className="size-4" />
                    Preview
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/tours/${slugifyTourTitle(tour.title)}/edit`}>Edit details</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTour ? <AdminTourPreviewModal onClose={() => setSelectedTour(null)} tour={selectedTour} /> : null}
    </>
  );
}
