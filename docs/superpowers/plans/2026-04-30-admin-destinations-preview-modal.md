# Admin Destinations Preview Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible in-page preview modal for destination cards in the admin destination workspace.

**Architecture:** Extract destination catalog rendering into a focused client component that owns selected destination state and modal behavior. Keep `AdminDestinationsPage` as a server component that passes mock destination cards into the client preview component.

**Tech Stack:** Next.js App Router, React client state/effects, TypeScript, Tailwind CSS, `next/image`, existing local UI components.

---

## File Structure

- Create `frontend/src/components/admin/AdminDestinationCatalogPreview.tsx`
  - Client component that renders the destination catalog cards, handles selected destination state, resolves richer preview data from `destinationDetails`, and renders the accessible preview modal.
- Modify `frontend/src/components/admin/AdminDestinationsPage.tsx`
  - Remove inline `DestinationCatalogPanel`, remove unused imports, import `AdminDestinationCatalogPreview`, and render `<AdminDestinationCatalogPreview destinations={destinationCards} />`.

---

### Task 1: Destination catalog preview client component

**Files:**
- Create: `frontend/src/components/admin/AdminDestinationCatalogPreview.tsx`

- [ ] **Step 1: Create the client preview component**

Create `frontend/src/components/admin/AdminDestinationCatalogPreview.tsx` with this content:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Eye, Hotel, MapPinned, Pencil, Star, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { slugifyDestinationTitle } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { destinationDetails, type DestinationCard } from "@/src/data/mockData";

interface AdminDestinationCatalogPreviewProps {
  readonly destinations: readonly DestinationCard[];
}

function getDestinationPositioning(destination: DestinationCard) {
  return destination.price === "$1,200" ? "Premium scenic" : "Core city escape";
}

function getDestinationCommercialSignal(destination: DestinationCard) {
  return destination.rating === "4.9" ? "High priority" : "Steady demand";
}

function getDestinationDetail(destination: DestinationCard) {
  return Object.values(destinationDetails).find((detail) => detail.card.title === destination.title) ?? null;
}

function AdminDestinationPreviewModal({
  destination,
  onClose,
}: {
  readonly destination: DestinationCard;
  readonly onClose: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const detail = getDestinationDetail(destination);
  const editHref = `/admin/destinations/${slugifyDestinationTitle(destination.title)}/edit`;

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
                {detail?.heroEyebrow ?? "Destination"}
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
              <p className="mt-2 text-sm font-semibold text-stone-950">{detail?.heroEyebrow ?? "Editorial destination"}</p>
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

export function AdminDestinationCatalogPreview({ destinations }: AdminDestinationCatalogPreviewProps) {
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
                      <Link href={`/admin/destinations/${slugifyDestinationTitle(destination.title)}/edit`}>Edit copy</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDestination ? <AdminDestinationPreviewModal destination={selectedDestination} onClose={() => setSelectedDestination(null)} /> : null}
    </>
  );
}
```

- [ ] **Step 2: Run lint for the new component**

Run: `npm run lint --prefix frontend`

Expected: command exits 0. If lint flags icon imports, remove unused icons only.

---

### Task 2: Wire server destinations page to client preview component

**Files:**
- Modify: `frontend/src/components/admin/AdminDestinationsPage.tsx`

- [ ] **Step 1: Replace imports**

Change the top of `frontend/src/components/admin/AdminDestinationsPage.tsx` from:

```tsx
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Globe2,
  MapPinned,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { slugifyDestinationTitle } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { destinationCards } from "@/src/data/mockData";
```

To:

```tsx
import Link from "next/link";
import { Compass, MapPinned, Plus, Sparkles, TrendingUp } from "lucide-react";

import { AdminDestinationCatalogPreview } from "@/src/components/admin/AdminDestinationCatalogPreview";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { destinationCards } from "@/src/data/mockData";
```

- [ ] **Step 2: Remove the inline `DestinationCatalogPanel` function**

Delete the whole `DestinationCatalogPanel` function from `frontend/src/components/admin/AdminDestinationsPage.tsx`, starting at:

```tsx
function DestinationCatalogPanel() {
```

and ending at the closing brace immediately before:

```tsx
function RegionTablePanel() {
```

- [ ] **Step 3: Render the client preview component**

Replace this JSX in `AdminDestinationsPage`:

```tsx
<DestinationCatalogPanel />
```

with:

```tsx
<AdminDestinationCatalogPreview destinations={destinationCards} />
```

- [ ] **Step 4: Run lint for wiring changes**

Run: `npm run lint --prefix frontend`

Expected: command exits 0 and no unused imports remain.

---

### Task 3: Full validation and browser check

**Files:**
- Validate all files changed in Tasks 1-2.

- [ ] **Step 1: Run lint**

Run: `npm run lint --prefix frontend`

Expected: command exits 0.

- [ ] **Step 2: Run production build**

Run: `npm run build --prefix frontend`

Expected: command exits 0 and Next.js lists `/admin/destinations` successfully.

- [ ] **Step 3: Start or reuse frontend dev server**

Run: `npm run dev --prefix frontend`

Expected: if a Next dev server is already running for `/home/hoanle0126/FreelanceProject/TouristWeb/frontend`, reuse `http://localhost:3000` instead of killing it.

- [ ] **Step 4: Browser-check opening preview**

Using Playwright MCP:

1. Navigate to `http://localhost:3000/admin/destinations`.
2. Click **Preview** on the first destination card.
3. Confirm a dialog opens with **Destination preview**, destination title, price, rating, market, spotlight content, related tours, related hotels, **Edit copy**, and **Close**.

Expected: modal opens on-page with no route change.

- [ ] **Step 5: Browser-check Close button**

Using Playwright MCP:

1. With the modal open, click **Close**.
2. Confirm the dialog disappears and URL remains `/admin/destinations`.

Expected: modal closes cleanly.

- [ ] **Step 6: Browser-check Escape close**

Using Playwright MCP:

1. Open the preview modal again.
2. Press Escape.
3. Confirm the dialog disappears.

Expected: Escape closes the modal.

- [ ] **Step 7: Browser-check backdrop close**

Using Playwright MCP:

1. Open the preview modal again.
2. Click the backdrop outside the dialog.
3. Confirm the dialog disappears.

Expected: backdrop click closes the modal.

- [ ] **Step 8: Browser-check Edit copy link**

Using Playwright MCP:

1. Open the preview modal again.
2. Click **Edit copy**.
3. Confirm the browser navigates to `/admin/destinations/nordic-fjords/edit` for the first destination.

Expected: edit navigation uses the same slug helper as the card link.

- [ ] **Step 9: Browser-check mobile modal usability**

Using Playwright MCP:

1. Resize viewport to 390 × 844.
2. Navigate to `/admin/destinations`.
3. Open a destination preview.
4. Confirm the modal fits within viewport height, content scrolls, and **Close** remains reachable.

Expected: preview remains usable on a mobile viewport.

- [ ] **Step 10: Review changed file list**

Run: `git status --short`

Expected: changed files include the new preview component, modified `AdminDestinationsPage`, and the spec/plan docs. Do not stage or commit unrelated Playwright logs, IDE files, screenshots, or travel component changes unless the user explicitly requests a commit.

---

## Self-Review Checklist

- Spec coverage:
  - In-page modal on `/admin/destinations`: Task 1 and Task 2.
  - Shows image, title, market, price, rating, commercial signal, descriptions, spotlight, related tours/hotels: Task 1.
  - Edit copy link to `/admin/destinations/[slug]/edit`: Task 1.
  - Close button, Escape, backdrop close: Task 1 and Task 3.
  - Focus management, focus trap, restore focus, scroll lock: Task 1.
  - Server page remains server-rendered: Task 2.
  - No new route or persistence: Task 1 and Task 2.
  - Validation commands and browser checks: Task 3.
- Placeholder scan: no `TBD`, `TODO`, `implement later`, or vague placeholders remain.
- Type consistency:
  - `AdminDestinationCatalogPreview` receives `readonly DestinationCard[]` and is rendered with `destinationCards`.
  - `slugifyDestinationTitle` is imported from the existing destination helper and used consistently for edit links.
  - `destinationDetails` is used only inside the client preview component for richer modal content.
