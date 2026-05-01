"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Eye, Hotel, MapPinned, Pencil, Star, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { slugifyDestinationTitle } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { DestinationCard } from "@/src/types/travel";
import type { ApiDestinationDetail } from "@/src/lib/api/types";

interface AdminDestinationCatalogPreviewProps {
  readonly destinations: readonly DestinationCard[];
  readonly destinationDetails: readonly ApiDestinationDetail[];
}

function getDestinationPositioning(destination: DestinationCard) {
  return destination.price === "$1,200" ? "Premium scenic" : "Core city escape";
}

function getDestinationCommercialSignal(destination: DestinationCard) {
  return destination.rating === "4.9" ? "High priority" : "Steady demand";
}

function getDestinationDetail(destination: DestinationCard, destinationDetails: readonly ApiDestinationDetail[]) {
  return destinationDetails.find((detail) => detail.title === destination.title || detail.href === destination.href) ?? null;
}

function getDestinationSlug(destination: DestinationCard) {
  return destination.href.split("/").filter(Boolean).at(-1) ?? slugifyDestinationTitle(destination.title);
}

function getDestinationEditHref(destination: DestinationCard) {
  return `/admin/destinations/${getDestinationSlug(destination)}/edit`;
}

function AdminDestinationPreviewModal({
  destination,
  destinationDetails,
  onClose,
}: {
  readonly destination: DestinationCard;
  readonly destinationDetails: readonly ApiDestinationDetail[];
  readonly onClose: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const detail = getDestinationDetail(destination, destinationDetails);
  const editHref = getDestinationEditHref(destination);

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
        className="relative z-[1001] grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#fbfcf7] shadow-[0_40px_120px_-40px_rgba(28,25,23,0.75)] outline-none lg:grid-cols-[minmax(0,1fr)_420px]"
        role="dialog"
        tabIndex={-1}
      >
        <div className="relative min-h-[300px] overflow-hidden bg-stone-200 lg:min-h-[620px]">
          <Image alt={destination.alt} className="object-cover" fill sizes="(min-width: 1024px) 58vw, 100vw" src={detail?.heroImage ?? destination.image} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 to-transparent p-6 text-white">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-950">
                {detail?.market ?? "Destination"}
              </span>
              <span className="rounded-full bg-stone-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">
                {getDestinationCommercialSignal(destination)}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight" id={titleId}>
              {destination.title}
            </h2>
          </div>
        </div>

        <div className="flex max-h-[92vh] flex-col overflow-y-auto p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Destination preview</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-stone-950">{destination.price}</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {destination.rating}
              </p>
            </div>
            <button
              aria-label="Close destination preview"
              className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:text-stone-950"
              onClick={onClose}
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mt-5 text-sm leading-7 text-stone-600" id={descriptionId}>
            {destination.description}
          </p>
          {detail ? <p className="mt-4 text-sm leading-7 text-stone-600">{detail.summary}</p> : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl bg-stone-100 p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                <MapPinned className="size-4" />
                Market
              </div>
              <p className="mt-2 text-sm font-semibold text-stone-950">{detail?.market ?? "Editorial destination"}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Positioning</p>
              <p className="mt-2 text-sm font-semibold text-stone-950">{getDestinationPositioning(destination)}</p>
            </div>
          </div>

          {detail ? (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Spotlight</p>
                <div className="mt-3 space-y-3">
                  {detail.spotlight.map((item) => (
                    <div className="rounded-2xl bg-stone-100 p-4" key={item.title}>
                      <p className="font-semibold tracking-tight text-stone-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    <Building2 className="size-4" />
                    Related tours
                  </div>
                  <ul className="mt-3 space-y-2 text-sm font-semibold text-stone-950">
                    {detail.relatedTours.map((item) => (
                      <li key={item.title}>{item.title}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    <Hotel className="size-4" />
                    Related hotels
                  </div>
                  <ul className="mt-3 space-y-2 text-sm font-semibold text-stone-950">
                    {detail.relatedHotels.map((item) => (
                      <li key={item.title}>{item.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2 border-t border-stone-200 pt-5">
            <Button asChild>
              <Link href={editHref}>
                <Pencil className="size-4" />
                Edit copy
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

export function AdminDestinationCatalogPreview({ destinationDetails, destinations }: AdminDestinationCatalogPreviewProps) {
  const [selectedDestination, setSelectedDestination] = useState<DestinationCard | null>(null);

  return (
    <>
      <Card>
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Destination catalog</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Editorial destinations and commercial signal
              </h3>
            </div>
            <Button disabled size="sm" variant="ghost">
              Review placements
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {destinations.map((destination) => (
              <article className="overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-stone-50" key={destination.title}>
                <div className="relative aspect-[16/10] bg-stone-200">
                  <Image alt={destination.alt} className="object-cover" fill sizes="(min-width: 1280px) 33vw, 100vw" src={destination.image} />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-bold tracking-tight text-stone-950">{destination.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">{destination.description}</p>
                    </div>
                    <span className="rounded-2xl bg-stone-900 px-3 py-2 text-sm font-semibold text-white">
                      {destination.price}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Rating</p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-stone-950">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        {destination.rating}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Positioning</p>
                      <p className="mt-2 text-sm font-semibold text-stone-950">{getDestinationPositioning(destination)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Commercial</p>
                      <p className="mt-2 text-sm font-semibold text-stone-950">{getDestinationCommercialSignal(destination)}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button onClick={() => setSelectedDestination(destination)} size="sm" type="button" variant="outline">
                      <Eye className="size-4" />
                      Preview
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={getDestinationEditHref(destination)}>Edit copy</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDestination ? <AdminDestinationPreviewModal destination={selectedDestination} destinationDetails={destinationDetails} onClose={() => setSelectedDestination(null)} /> : null}
    </>
  );
}
