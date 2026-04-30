# Admin Destinations Add/Edit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build mock add and edit screens for admin destination category content, with local validation and navigation from the existing destinations admin listing.

**Architecture:** Keep admin page wrappers server-rendered through `AdminShell`, and isolate form interactivity in a single client component. Put destination form types, create defaults, slug generation, and edit-data resolution in a small data helper so routes and listing links share the same slug rules.

**Tech Stack:** Next.js App Router, React Server Components, React client state, TypeScript, Tailwind CSS, existing local UI components under `frontend/src/components/ui/*`.

---

## File Structure

- Create `frontend/src/components/admin/adminDestinationFormData.ts`
  - Defines destination form types, initial create values, `slugifyDestinationTitle`, and `resolveAdminDestinationEditData` using existing mock destination data.
- Create `frontend/src/components/admin/AdminDestinationForm.tsx`
  - Client component owning form state, validation errors, saved state, intro paragraph rows, spotlight rows, related tour rows, and related hotel rows.
- Create `frontend/src/components/admin/AdminNewDestinationPage.tsx`
  - Server component wrapping create form in `AdminShell` with back link to `/admin/destinations`.
- Create `frontend/src/components/admin/AdminEditDestinationPage.tsx`
  - Server component resolving `params.slug`, passing edit initial values/copy to the shared form, and rendering a not-found style state when no mock destination matches.
- Create `frontend/app/admin/destinations/new/page.tsx`
  - App Router entry for the add destination page.
- Create `frontend/app/admin/destinations/[slug]/edit/page.tsx`
  - App Router entry for editing a mock destination by slug.
- Modify `frontend/src/components/admin/AdminDestinationsPage.tsx`
  - Wire **Add destination** as a normal link and **Edit copy** as a per-card edit link using the shared slug helper.

---

### Task 1: Destination form data helper

**Files:**
- Create: `frontend/src/components/admin/adminDestinationFormData.ts`

- [ ] **Step 1: Create the destination form data module**

Create `frontend/src/components/admin/adminDestinationFormData.ts` with this content:

```ts
import { destinationDetails } from "@/src/data/mockData";

export type DestinationCommercialStatus = "Draft" | "Ready for review" | "Published";

export interface DestinationFormState {
  readonly title: string;
  readonly slug: string;
  readonly market: string;
  readonly price: string;
  readonly rating: string;
  readonly status: DestinationCommercialStatus;
  readonly cardImage: string;
  readonly cardAlt: string;
  readonly shortDescription: string;
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly summary: string;
}

export interface DestinationTextRow {
  readonly id: string;
  readonly value: string;
}

export interface DestinationFormInitialValues {
  readonly form: DestinationFormState;
  readonly intro: readonly DestinationTextRow[];
  readonly spotlight: readonly DestinationTextRow[];
  readonly relatedTours: readonly DestinationTextRow[];
  readonly relatedHotels: readonly DestinationTextRow[];
}

export interface ResolvedAdminDestinationEditData {
  readonly destinationTitle: string;
  readonly initialValues: DestinationFormInitialValues;
}

export const destinationStatusOptions: readonly DestinationCommercialStatus[] = [
  "Draft",
  "Ready for review",
  "Published",
];

export const createDestinationInitialValues: DestinationFormInitialValues = {
  form: {
    title: "",
    slug: "",
    market: "Asia Pacific",
    price: "",
    rating: "",
    status: "Draft",
    cardImage: "",
    cardAlt: "",
    shortDescription: "",
    heroImage: "",
    heroAlt: "",
    summary: "",
  },
  intro: [
    { id: "intro-1", value: "" },
    { id: "intro-2", value: "" },
  ],
  spotlight: [
    { id: "spotlight-1", value: "" },
    { id: "spotlight-2", value: "" },
    { id: "spotlight-3", value: "" },
  ],
  relatedTours: [
    { id: "related-tour-1", value: "" },
    { id: "related-tour-2", value: "" },
  ],
  relatedHotels: [
    { id: "related-hotel-1", value: "" },
    { id: "related-hotel-2", value: "" },
  ],
};

export function slugifyDestinationTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function textRows(prefix: string, values: readonly string[]) {
  if (values.length === 0) {
    return [{ id: `${prefix}-1`, value: "" }];
  }

  return values.map((value, index) => ({ id: `${prefix}-${index + 1}`, value }));
}

export function resolveAdminDestinationEditData(slug: string): ResolvedAdminDestinationEditData | null {
  const destination = destinationDetails.find((item) => slugifyDestinationTitle(item.card.title) === slug);

  if (!destination) {
    return null;
  }

  return {
    destinationTitle: destination.card.title,
    initialValues: {
      form: {
        title: destination.card.title,
        slug,
        market: destination.heroEyebrow,
        price: destination.card.price,
        rating: destination.card.rating,
        status: "Published",
        cardImage: destination.card.image,
        cardAlt: destination.card.alt,
        shortDescription: destination.card.description,
        heroImage: destination.heroImage,
        heroAlt: destination.card.alt,
        summary: destination.summary,
      },
      intro: textRows("intro", destination.intro),
      spotlight: textRows(
        "spotlight",
        destination.spotlight.map((item) => `${item.title}: ${item.description}`),
      ),
      relatedTours: textRows(
        "related-tour",
        destination.relatedTours.map((item) => item.title),
      ),
      relatedHotels: textRows(
        "related-hotel",
        destination.relatedHotels.map((item) => item.title),
      ),
    },
  };
}
```

- [ ] **Step 2: Run lint for the new helper**

Run: `npm run lint --prefix frontend`

Expected: command exits 0. If it fails, fix only issues introduced by this task.

---

### Task 2: Shared admin destination form

**Files:**
- Create: `frontend/src/components/admin/AdminDestinationForm.tsx`

- [ ] **Step 1: Create the client form component**

Create `frontend/src/components/admin/AdminDestinationForm.tsx` with this content:

```tsx
"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";

import {
  destinationStatusOptions,
  slugifyDestinationTitle,
  type DestinationCommercialStatus,
  type DestinationFormInitialValues,
  type DestinationFormState,
  type DestinationTextRow,
} from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";

interface AdminDestinationFormCopy {
  readonly readinessEyebrow: string;
  readonly submitLabel: string;
  readonly savedSubmitLabel: string;
  readonly successTitle: string;
  readonly successDescription: string;
}

interface AdminDestinationFormProps {
  readonly copy: AdminDestinationFormCopy;
  readonly initialValues: DestinationFormInitialValues;
}

type FormErrors = Partial<Record<keyof DestinationFormState, string>>;
type RowGroupName = "intro" | "spotlight" | "relatedTours" | "relatedHotels";

const requiredFields: readonly (keyof DestinationFormState)[] = [
  "title",
  "price",
  "rating",
  "cardImage",
  "heroImage",
  "shortDescription",
];

const fieldLabels: Record<(typeof requiredFields)[number], string> = {
  title: "Title",
  price: "Price / from price",
  rating: "Rating",
  cardImage: "Card image URL",
  heroImage: "Hero image URL",
  shortDescription: "Short description",
};

function FieldBlock({ children, error, htmlFor, label }: { readonly children: ReactNode; readonly error?: string; readonly htmlFor: string; readonly label: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function nextRowId(rows: readonly DestinationTextRow[], prefix: string) {
  return `${prefix}-${rows.length + 1}-${Date.now()}`;
}

function RowEditor({
  addLabel,
  emptyValueLabel,
  onAdd,
  onChange,
  onRemove,
  placeholder,
  rows,
  title,
}: {
  readonly addLabel: string;
  readonly emptyValueLabel: string;
  readonly onAdd: () => void;
  readonly onChange: (id: string, value: string) => void;
  readonly onRemove: (id: string) => void;
  readonly placeholder: string;
  readonly rows: readonly DestinationTextRow[];
  readonly title: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-stone-950">{title}</h3>
          <p className="mt-1 text-sm text-stone-500">Editable mock rows for merchandising copy.</p>
        </div>
        <Button onClick={onAdd} size="sm" type="button" variant="outline">
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div className="flex gap-2" key={row.id}>
            <Input
              aria-label={`${title} row ${index + 1}`}
              onChange={(event) => onChange(row.id, event.target.value)}
              placeholder={placeholder}
              value={row.value}
            />
            <Button
              aria-label={`Remove ${emptyValueLabel} row ${index + 1}`}
              disabled={rows.length === 1}
              onClick={() => onRemove(row.id)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDestinationForm({ copy, initialValues }: AdminDestinationFormProps) {
  const [form, setForm] = useState<DestinationFormState>(initialValues.form);
  const [intro, setIntro] = useState<readonly DestinationTextRow[]>(initialValues.intro);
  const [spotlight, setSpotlight] = useState<readonly DestinationTextRow[]>(initialValues.spotlight);
  const [relatedTours, setRelatedTours] = useState<readonly DestinationTextRow[]>(initialValues.relatedTours);
  const [relatedHotels, setRelatedHotels] = useState<readonly DestinationTextRow[]>(initialValues.relatedHotels);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  const generatedSlug = useMemo(() => slugifyDestinationTitle(form.title), [form.title]);

  function updateField<Key extends keyof DestinationFormState>(field: Key, value: DestinationFormState[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function rowStateFor(group: RowGroupName) {
    if (group === "intro") return [intro, setIntro, "intro"] as const;
    if (group === "spotlight") return [spotlight, setSpotlight, "spotlight"] as const;
    if (group === "relatedTours") return [relatedTours, setRelatedTours, "related-tour"] as const;
    return [relatedHotels, setRelatedHotels, "related-hotel"] as const;
  }

  function addRow(group: RowGroupName) {
    const [rows, setRows, prefix] = rowStateFor(group);
    setRows([...rows, { id: nextRowId(rows, prefix), value: "" }]);
    setSaved(false);
  }

  function updateRow(group: RowGroupName, id: string, value: string) {
    const [rows, setRows] = rowStateFor(group);
    setRows(rows.map((row) => (row.id === id ? { ...row, value } : row)));
    setSaved(false);
  }

  function removeRow(group: RowGroupName, id: string) {
    const [rows, setRows] = rowStateFor(group);
    if (rows.length === 1) return;
    setRows(rows.filter((row) => row.id !== id));
    setSaved(false);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required.`;
      }
    });

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }

    setSaved(true);
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      {saved ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex gap-3 p-5 text-emerald-950">
            <CheckCircle2 className="mt-1 size-5 shrink-0" />
            <div>
              <p className="font-bold tracking-tight">{copy.successTitle}</p>
              <p className="mt-1 text-sm leading-6 text-emerald-900/75">{copy.successDescription}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="grid gap-5 p-6 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Essentials</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">Destination category basics</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FieldBlock error={errors.title} htmlFor="destination-title" label="Title">
              <Input id="destination-title" onChange={(event) => updateField("title", event.target.value)} value={form.title} />
            </FieldBlock>
            <FieldBlock htmlFor="destination-slug" label="Slug">
              <Input
                id="destination-slug"
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder={generatedSlug || "auto-generated-from-title"}
                value={form.slug}
              />
            </FieldBlock>
            <FieldBlock htmlFor="destination-market" label="Market or region">
              <Input id="destination-market" onChange={(event) => updateField("market", event.target.value)} value={form.market} />
            </FieldBlock>
            <FieldBlock error={errors.price} htmlFor="destination-price" label="Price / from price">
              <Input id="destination-price" onChange={(event) => updateField("price", event.target.value)} value={form.price} />
            </FieldBlock>
            <FieldBlock error={errors.rating} htmlFor="destination-rating" label="Rating">
              <Input id="destination-rating" onChange={(event) => updateField("rating", event.target.value)} value={form.rating} />
            </FieldBlock>
            <div className="space-y-2">
              <Label htmlFor="destination-status">Commercial status</Label>
              <Select onValueChange={(value) => updateField("status", value as DestinationCommercialStatus)} value={form.status}>
                <SelectTrigger id="destination-status">
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  {destinationStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-5 p-6 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Listing card</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">Card content</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FieldBlock error={errors.cardImage} htmlFor="destination-card-image" label="Card image URL">
              <Input id="destination-card-image" onChange={(event) => updateField("cardImage", event.target.value)} value={form.cardImage} />
            </FieldBlock>
            <FieldBlock htmlFor="destination-card-alt" label="Card image alt text">
              <Input id="destination-card-alt" onChange={(event) => updateField("cardAlt", event.target.value)} value={form.cardAlt} />
            </FieldBlock>
          </div>
          <FieldBlock error={errors.shortDescription} htmlFor="destination-short-description" label="Short description">
            <Textarea id="destination-short-description" onChange={(event) => updateField("shortDescription", event.target.value)} value={form.shortDescription} />
          </FieldBlock>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-5 p-6 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Detail page</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">Hero and editorial content</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FieldBlock error={errors.heroImage} htmlFor="destination-hero-image" label="Hero image URL">
              <Input id="destination-hero-image" onChange={(event) => updateField("heroImage", event.target.value)} value={form.heroImage} />
            </FieldBlock>
            <FieldBlock htmlFor="destination-hero-alt" label="Hero image alt text">
              <Input id="destination-hero-alt" onChange={(event) => updateField("heroAlt", event.target.value)} value={form.heroAlt} />
            </FieldBlock>
          </div>
          <FieldBlock htmlFor="destination-summary" label="Summary">
            <Textarea id="destination-summary" onChange={(event) => updateField("summary", event.target.value)} value={form.summary} />
          </FieldBlock>
        </CardContent>
      </Card>

      <section className="grid gap-5 xl:grid-cols-2">
        <RowEditor
          addLabel="Add paragraph"
          emptyValueLabel="intro paragraph"
          onAdd={() => addRow("intro")}
          onChange={(id, value) => updateRow("intro", id, value)}
          onRemove={(id) => removeRow("intro", id)}
          placeholder="Intro paragraph"
          rows={intro}
          title="Intro paragraphs"
        />
        <RowEditor
          addLabel="Add spotlight"
          emptyValueLabel="spotlight"
          onAdd={() => addRow("spotlight")}
          onChange={(id, value) => updateRow("spotlight", id, value)}
          onRemove={(id) => removeRow("spotlight", id)}
          placeholder="Spotlight bullet"
          rows={spotlight}
          title="Spotlight bullets"
        />
        <RowEditor
          addLabel="Add tour"
          emptyValueLabel="related tour"
          onAdd={() => addRow("relatedTours")}
          onChange={(id, value) => updateRow("relatedTours", id, value)}
          onRemove={(id) => removeRow("relatedTours", id)}
          placeholder="Related tour title"
          rows={relatedTours}
          title="Related tours"
        />
        <RowEditor
          addLabel="Add hotel"
          emptyValueLabel="related hotel"
          onAdd={() => addRow("relatedHotels")}
          onChange={(id, value) => updateRow("relatedHotels", id, value)}
          onRemove={(id) => removeRow("relatedHotels", id)}
          placeholder="Related hotel title"
          rows={relatedHotels}
          title="Related hotels"
        />
      </section>

      <Card className="border-none bg-stone-950 text-white">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">{copy.readinessEyebrow}</p>
            <p className="mt-2 text-sm leading-6 text-white/65">Required fields must be complete before this mock submit can show the saved state.</p>
          </div>
          <Button className="bg-white text-stone-950 hover:bg-stone-100" type="submit">
            {saved ? copy.savedSubmitLabel : copy.submitLabel}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
```

- [ ] **Step 2: Run lint for the form**

Run: `npm run lint --prefix frontend`

Expected: command exits 0. If TypeScript or lint flags the `SelectTrigger` `id` prop or readonly state updater types, adjust to match the existing UI component APIs in this repository.

---

### Task 3: New and edit destination page wrappers

**Files:**
- Create: `frontend/src/components/admin/AdminNewDestinationPage.tsx`
- Create: `frontend/src/components/admin/AdminEditDestinationPage.tsx`

- [ ] **Step 1: Create `AdminNewDestinationPage`**

Create `frontend/src/components/admin/AdminNewDestinationPage.tsx` with this content:

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminDestinationForm } from "@/src/components/admin/AdminDestinationForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { createDestinationInitialValues } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";

export default function AdminNewDestinationPage() {
  return (
    <AdminShell
      activePath="/admin/destinations"
      action={
        <Button asChild className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
          <Link href="/admin/destinations">
            <ArrowLeft className="size-4" />
            Back to destinations
          </Link>
        </Button>
      }
      dateLabel="Thursday, April 30, 2026"
      pageTitle="Add destination"
      searchPlaceholder="Search destination content..."
      sectionLabel="Create a destination category for merchandising tours and hotels."
      teamValue="content"
    >
      <AdminDestinationForm
        copy={{
          readinessEyebrow: "Review readiness",
          submitLabel: "Save destination draft",
          savedSubmitLabel: "Saved draft",
          successTitle: "Destination draft ready for review",
          successDescription: "This mock submit keeps the data on this page and does not publish it.",
        }}
        initialValues={createDestinationInitialValues}
      />
    </AdminShell>
  );
}
```

- [ ] **Step 2: Create `AdminEditDestinationPage`**

Create `frontend/src/components/admin/AdminEditDestinationPage.tsx` with this content:

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminDestinationForm } from "@/src/components/admin/AdminDestinationForm";
import { AdminShell } from "@/src/components/admin/AdminShell";
import { resolveAdminDestinationEditData } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

interface AdminEditDestinationPageProps {
  readonly slug: string;
}

export default function AdminEditDestinationPage({ slug }: AdminEditDestinationPageProps) {
  const resolved = resolveAdminDestinationEditData(slug);

  return (
    <AdminShell
      activePath="/admin/destinations"
      action={
        <Button asChild className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
          <Link href="/admin/destinations">
            <ArrowLeft className="size-4" />
            Back to destinations
          </Link>
        </Button>
      }
      dateLabel="Thursday, April 30, 2026"
      pageTitle={resolved ? `Edit ${resolved.destinationTitle}` : "Destination not found"}
      searchPlaceholder="Search destination content..."
      sectionLabel="Update mock destination category content before review."
      teamValue="content"
    >
      {resolved ? (
        <AdminDestinationForm
          copy={{
            readinessEyebrow: "Update readiness",
            submitLabel: "Save destination changes",
            savedSubmitLabel: "Saved changes",
            successTitle: "Destination changes ready for review",
            successDescription: "This mock submit keeps the edited data on this page and does not publish it.",
          }}
          initialValues={resolved.initialValues}
        />
      ) : (
        <Card>
          <CardContent className="p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Missing destination</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">No mock destination matches this slug.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">Return to the destination listing and choose an existing destination card.</p>
            <Button asChild className="mt-5">
              <Link href="/admin/destinations">Back to destinations</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
```

- [ ] **Step 3: Run lint for the page wrappers**

Run: `npm run lint --prefix frontend`

Expected: command exits 0.

---

### Task 4: App Router destination routes

**Files:**
- Create: `frontend/app/admin/destinations/new/page.tsx`
- Create: `frontend/app/admin/destinations/[slug]/edit/page.tsx`

- [ ] **Step 1: Add the new destination route**

Create `frontend/app/admin/destinations/new/page.tsx` with this content:

```tsx
import AdminNewDestinationPage from "@/src/components/admin/AdminNewDestinationPage";

export default function AdminNewDestinationRoute() {
  return <AdminNewDestinationPage />;
}
```

- [ ] **Step 2: Add the edit destination route**

Create `frontend/app/admin/destinations/[slug]/edit/page.tsx` with this content:

```tsx
import AdminEditDestinationPage from "@/src/components/admin/AdminEditDestinationPage";

interface AdminEditDestinationRouteProps {
  readonly params: Promise<{ slug: string }>;
}

export default async function AdminEditDestinationRoute({ params }: AdminEditDestinationRouteProps) {
  const { slug } = await params;

  return <AdminEditDestinationPage slug={slug} />;
}
```

- [ ] **Step 3: Run lint for routes**

Run: `npm run lint --prefix frontend`

Expected: command exits 0. If this project's current Next.js route typing uses non-Promise `params`, match the existing route files in `frontend/app/admin/tours/[slug]/edit/page.tsx` instead.

---

### Task 5: Wire destinations listing navigation

**Files:**
- Modify: `frontend/src/components/admin/AdminDestinationsPage.tsx`

- [ ] **Step 1: Add imports for `Link` and slug helper**

Modify the top of `frontend/src/components/admin/AdminDestinationsPage.tsx` so it includes `Link` and `slugifyDestinationTitle`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { Building2, Compass, Globe2, Hotel, MapPinned, Plus, Star } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { slugifyDestinationTitle } from "@/src/components/admin/adminDestinationFormData";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { destinationCards } from "@/src/data/mockData";
```

- [ ] **Step 2: Link the header add action**

Replace the current `AdminShell` `action` button:

```tsx
action={
  <Button>
    <Plus className="size-4" />
    Add destination
  </Button>
}
```

with:

```tsx
action={
  <Button asChild>
    <Link href="/admin/destinations/new">
      <Plus className="size-4" />
      Add destination
    </Link>
  </Button>
}
```

- [ ] **Step 3: Link each card's edit action**

Inside the `destinationCards.map((destination) => (` card actions, replace the existing non-link edit button:

```tsx
<Button size="sm" variant="ghost">
  Edit copy
</Button>
```

with:

```tsx
<Button asChild size="sm" variant="ghost">
  <Link href={`/admin/destinations/${slugifyDestinationTitle(destination.title)}/edit`}>Edit copy</Link>
</Button>
```

Keep the existing `Preview` button unchanged unless it already has behavior elsewhere.

- [ ] **Step 4: Run lint for listing changes**

Run: `npm run lint --prefix frontend`

Expected: command exits 0.

---

### Task 6: Full validation and browser check

**Files:**
- Validate all files changed in Tasks 1-5.

- [ ] **Step 1: Run lint**

Run: `npm run lint --prefix frontend`

Expected: command exits 0 with no lint errors.

- [ ] **Step 2: Run production build**

Run: `npm run build --prefix frontend`

Expected: command exits 0 and Next.js build completes successfully.

- [ ] **Step 3: Start or reuse the frontend dev server**

Run: `npm run dev --prefix frontend`

Expected: dev server starts on `http://localhost:3000` or reports an existing Next dev server for `/home/hoanle0126/FreelanceProject/TouristWeb/frontend`. If an existing server is already running, reuse it instead of killing it unless the user explicitly approves killing processes.

- [ ] **Step 4: Browser-check destination listing navigation**

Using Playwright MCP:

1. Navigate to `http://localhost:3000/admin/destinations`.
2. Confirm the existing destination dashboard/listing renders.
3. Click **Add destination**.
4. Confirm the URL is `/admin/destinations/new` and the page title says **Add destination**.

Expected: navigation uses a normal link and the new page renders inside the admin shell.

- [ ] **Step 5: Browser-check required validation**

On `/admin/destinations/new`:

1. Click **Save destination draft** with required fields empty.
2. Confirm visible validation messages appear for:
   - Title
   - Price / from price
   - Rating
   - Card image URL
   - Hero image URL
   - Short description
3. Confirm no saved/review success state appears.

Expected: each required field has nearby visible validation text.

- [ ] **Step 6: Browser-check valid mock submit**

On `/admin/destinations/new`:

1. Fill title with `Test Destination`.
2. Fill price with `From $999`.
3. Fill rating with `4.8`.
4. Fill card image URL with `/images/destinations/kyoto.jpg`.
5. Fill hero image URL with `/images/destinations/kyoto.jpg`.
6. Fill short description with `A focused mock destination category.`
7. Click **Save destination draft**.
8. Confirm the saved state appears with **Destination draft ready for review**.

Expected: submit stays on-page and does not persist or publish data.

- [ ] **Step 7: Browser-check edit route navigation**

Using Playwright MCP:

1. Navigate back to `http://localhost:3000/admin/destinations`.
2. Click **Edit copy** on at least one destination card.
3. Confirm the URL matches `/admin/destinations/[slug]/edit`.
4. Confirm the edit page title includes that destination title.
5. Confirm fields are prefilled from mock destination data.
6. Click **Save destination changes** and confirm the saved state appears when required fields are present.

Expected: edit route resolves existing mock data and uses the same form.

- [ ] **Step 8: Browser-check mobile usability**

Using Playwright MCP:

1. Resize viewport to a mobile width such as 390 × 844.
2. Navigate to `/admin/destinations/new`.
3. Confirm inputs, textareas, row add/remove buttons, and submit button are reachable without horizontal layout breakage.
4. Add and remove one related tour row.

Expected: the form remains usable on a mobile viewport.

- [ ] **Step 9: Review changed file list**

Run: `git status --short`

Expected: changed files include only destination add/edit implementation files plus any pre-existing unrelated files already present before this task. Do not stage or commit unrelated Playwright logs, IDE files, or unrelated travel component changes.

---

## Self-Review Checklist

- Spec coverage:
  - `/admin/destinations` keeps current layout: Task 5 only wires navigation.
  - Header Add links to `/admin/destinations/new`: Task 5.
  - Card Edit links to `/admin/destinations/[slug]/edit`: Task 5.
  - New route and edit route exist: Task 4.
  - Server wrappers use `AdminShell`: Task 3.
  - Shared client form owns state, validation, rows, saved state: Task 2.
  - Helper owns types, create values, slug, edit resolution: Task 1.
  - Required validation fields are implemented: Task 2 and verified in Task 6.
  - Browser validation covers listing, new, edit, submit, mobile: Task 6.
- Placeholder scan: no `TBD`, `TODO`, `implement later`, or “similar to” placeholders remain.
- Type consistency:
  - `DestinationFormInitialValues`, `DestinationTextRow`, and `DestinationFormState` are defined in Task 1 and imported consistently in Task 2.
  - `slugifyDestinationTitle` is defined in Task 1 and reused by Task 5.
  - `resolveAdminDestinationEditData` is defined in Task 1 and used by Task 3.
