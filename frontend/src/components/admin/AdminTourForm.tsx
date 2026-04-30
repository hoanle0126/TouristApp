"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  CircleAlert,
  ImageIcon,
  ListChecks,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import {
  type AdminTourFormInitialValues,
  type GalleryItem,
  type GalleryLayout,
  type HighlightIcon,
  type HighlightItem,
  type ItineraryItem,
  type OperationalStatus,
  type TourBadge,
  type TourFormState,
} from "@/src/components/admin/adminTourFormData";

interface AdminTourFormCopy {
  readonly readinessEyebrow: string;
  readonly modeBadge?: string;
  readonly submitLabel: string;
  readonly savedSubmitLabel: string;
  readonly successTitle: string;
  readonly successDescription: string;
}

interface AdminTourFormProps {
  readonly initialValues: AdminTourFormInitialValues;
  readonly copy: AdminTourFormCopy;
}

interface FormErrors {
  title?: string;
  duration?: string;
  guests?: string;
  price?: string;
  cardImage?: string;
  heroImage?: string;
  shortDescription?: string;
}

function updateItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
  patch: Partial<T>,
) {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

function removeItem<T extends { readonly id: string }>(items: readonly T[], id: string) {
  return items.length > 1 ? items.filter((item) => item.id !== id) : items;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasValue(value: string) {
  return value.trim().length > 0;
}

export function AdminTourForm({ copy, initialValues }: AdminTourFormProps) {
  const [form, setForm] = useState<TourFormState>(initialValues.form);
  const [highlights, setHighlights] = useState<readonly HighlightItem[]>(initialValues.highlights);
  const [itinerary, setItinerary] = useState<readonly ItineraryItem[]>(initialValues.itinerary);
  const [gallery, setGallery] = useState<readonly GalleryItem[]>(initialValues.gallery);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  const readiness = useMemo(
    () => [
      {
        label: "Essentials",
        ready: [form.title, form.duration, form.guests, form.price, form.shortDescription].every(hasValue),
      },
      {
        label: "Media",
        ready:
          hasValue(form.cardImage) &&
          hasValue(form.heroImage) &&
          gallery.some((item) => hasValue(item.image) && hasValue(item.alt)),
      },
      {
        label: "Detail",
        ready:
          hasValue(form.subtitle) &&
          highlights.some((item) => hasValue(item.title)) &&
          itinerary.some((item) => hasValue(item.title)),
      },
      {
        label: "Operations",
        ready: [form.departureDate, form.guide, form.bookedSeats, form.capacitySeats].every(hasValue),
      },
    ],
    [form, gallery, highlights, itinerary],
  );

  function updateField<K extends keyof TourFormState>(field: K, value: TourFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    }
    if (!form.duration.trim()) {
      nextErrors.duration = "Duration is required.";
    }
    if (!form.guests.trim()) {
      nextErrors.guests = "Guest capacity is required.";
    }
    if (!form.price.trim()) {
      nextErrors.price = "Price is required.";
    }
    if (!form.cardImage.trim()) {
      nextErrors.cardImage = "Card image URL is required.";
    }
    if (!form.heroImage.trim()) {
      nextErrors.heroImage = "Hero image URL is required.";
    }
    if (!form.shortDescription.trim()) {
      nextErrors.shortDescription = "Short description is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);

    if (!validateForm()) {
      return;
    }

    setSaved(true);
  }

  function updateHighlights(items: readonly HighlightItem[]) {
    setHighlights(items);
    setSaved(false);
  }

  function updateItinerary(items: readonly ItineraryItem[]) {
    setItinerary(items);
    setSaved(false);
  }

  function updateGallery(items: readonly GalleryItem[]) {
    setGallery(items);
    setSaved(false);
  }

  return (
    <form className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_420px]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <EssentialsSection errors={errors} form={form} updateField={updateField} />
        <MediaSection errors={errors} form={form} gallery={gallery} setGallery={updateGallery} updateField={updateField} />
        <ClientDetailSection
          form={form}
          highlights={highlights}
          itinerary={itinerary}
          setHighlights={updateHighlights}
          setItinerary={updateItinerary}
          updateField={updateField}
        />
        <OperationsSection form={form} updateField={updateField} />
      </div>

      <TourDraftSidebar copy={copy} form={form} readiness={readiness} saved={saved} />
    </form>
  );
}

function TourDraftSidebar({
  copy,
  form,
  readiness,
  saved,
}: Readonly<{
  copy: AdminTourFormCopy;
  form: TourFormState;
  readiness: readonly { readonly label: string; readonly ready: boolean }[];
  saved: boolean;
}>) {
  const completed = readiness.filter((item) => item.ready).length;

  return (
    <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <Card className="border-none bg-stone-950 text-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.85)]">
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
                {copy.readinessEyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                {completed} of {readiness.length} sections ready
              </h3>
              {copy.modeBadge ? (
                <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                  {copy.modeBadge}
                </p>
              ) : null}
            </div>
            <BadgeCheck className="size-6 text-emerald-200" />
          </div>

          <div className="mt-6 space-y-3">
            {readiness.map((item) => (
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3" key={item.label}>
                <span className="text-sm font-semibold">
                  {item.label}
                  <span className="sr-only">: {item.ready ? "ready" : "incomplete"}</span>
                </span>
                {item.ready ? (
                  <CheckCircle2 className="size-4 text-emerald-200" />
                ) : (
                  <CircleAlert className="size-4 text-white/45" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
            Live summary
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-950">
            {form.title || "Untitled tour"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {form.shortDescription || "Add a short description to preview the listing card copy."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <SummaryPill label="Badge" value={form.badge === "none" ? "No badge" : form.badge} />
            <SummaryPill label="Duration" value={form.duration || "Not set"} />
            <SummaryPill label="Guests" value={form.guests || "Not set"} />
            <SummaryPill label="Price" value={form.price || "Not set"} />
          </div>
        </CardContent>
      </Card>

      {saved ? (
        <Card aria-live="polite" className="border-none bg-emerald-100 text-emerald-950" role="status">
          <CardContent className="flex gap-3 p-5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-bold">{copy.successTitle}</p>
              <p className="mt-1 text-sm text-emerald-900/75">
                {copy.successDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Button className="w-full" size="lg" type="submit">
        <Save className="size-4" />
        {saved ? copy.savedSubmitLabel : copy.submitLabel}
      </Button>
    </aside>
  );
}

function SummaryPill({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-stone-950">{value}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: Readonly<{ eyebrow: string; title: string; description: string }>) {
  return (
    <div className="border-b border-stone-200 pb-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}

function FieldError({ id, message }: Readonly<{ id?: string; message?: string }>) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-semibold text-rose-700" id={id}>{message}</p>;
}

function TextField({
  error,
  id,
  label,
  onChange,
  placeholder,
  value,
}: Readonly<{
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}>) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function EssentialsSection({
  errors,
  form,
  updateField,
}: Readonly<{
  errors: FormErrors;
  form: TourFormState;
  updateField: <K extends keyof TourFormState>(field: K, value: TourFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Fields that power the tour listing card, booking summary, and high-level detail metadata."
          eyebrow="Essentials"
          title="Core tour information"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.title} id="tour-title" label="Title" onChange={(value) => updateField("title", value)} value={form.title} />
          <TextField id="tour-slug" label="Slug" onChange={(value) => updateField("slug", value)} value={form.slug} />
          <div>
            <Label htmlFor="tour-badge">Badge</Label>
            <Select value={form.badge} onValueChange={(value: TourBadge) => updateField("badge", value)}>
              <SelectTrigger id="tour-badge">
                <SelectValue placeholder="Select badge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Featured">Featured</SelectItem>
                <SelectItem value="New">New</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TextField id="tour-type" label="Type" onChange={(value) => updateField("type", value)} value={form.type} />
          <TextField error={errors.duration} id="tour-duration" label="Duration" onChange={(value) => updateField("duration", value)} value={form.duration} />
          <TextField error={errors.guests} id="tour-guests" label="Guests / capacity label" onChange={(value) => updateField("guests", value)} value={form.guests} />
          <TextField error={errors.price} id="tour-price" label="Price" onChange={(value) => updateField("price", value)} value={form.price} />
          <TextField id="tour-availability" label="Availability" onChange={(value) => updateField("availability", value)} value={form.availability} />
        </div>
        <div>
          <Label htmlFor="tour-short-description">Short description</Label>
          <Textarea
            aria-describedby={errors.shortDescription ? "tour-short-description-error" : undefined}
            aria-invalid={Boolean(errors.shortDescription)}
            id="tour-short-description"
            onChange={(event) => updateField("shortDescription", event.target.value)}
            value={form.shortDescription}
          />
          <FieldError id="tour-short-description-error" message={errors.shortDescription} />
        </div>
      </CardContent>
    </Card>
  );
}

function ClientDetailSection({
  form,
  highlights,
  itinerary,
  setHighlights,
  setItinerary,
  updateField,
}: Readonly<{
  form: TourFormState;
  highlights: readonly HighlightItem[];
  itinerary: readonly ItineraryItem[];
  setHighlights: (items: readonly HighlightItem[]) => void;
  setItinerary: (items: readonly ItineraryItem[]) => void;
  updateField: <K extends keyof TourFormState>(field: K, value: TourFormState[K]) => void;
}>) {
  const inclusions = splitLines(form.inclusions);
  const exclusions = splitLines(form.exclusions);

  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Content blocks used by the public tour detail page and booking confidence sections."
          eyebrow="Client detail"
          title="Experience, journey, and inclusions"
        />
        <TextField id="tour-subtitle" label="Subtitle" onChange={(value) => updateField("subtitle", value)} value={form.subtitle} />
        <div>
          <Label htmlFor="description-paragraphs">Description paragraphs</Label>
          <Textarea
            id="description-paragraphs"
            onChange={(event) => updateField("descriptionParagraphs", event.target.value)}
            value={form.descriptionParagraphs}
          />
          <p className="mt-2 text-xs font-medium text-stone-500">Each line becomes one paragraph.</p>
        </div>

        <RepeatableHeader
          addLabel="Add highlight"
          icon={<Sparkles className="size-4" />}
          label="Highlights"
          onAdd={() =>
            setHighlights([
              ...highlights,
              { id: `highlight-${crypto.randomUUID()}`, icon: "eco", title: "", description: "" },
            ])
          }
        />
        <div className="space-y-4">
          {highlights.map((item, index) => (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={item.id}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-stone-950">Highlight {index + 1}</p>
                <Button
                  aria-label={`Remove highlight ${index + 1}`}
                  disabled={highlights.length <= 1}
                  onClick={() => setHighlights(removeItem(highlights, item.id))}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <Label htmlFor={`${item.id}-icon`}>Icon</Label>
                  <Select value={item.icon} onValueChange={(value: HighlightIcon) => setHighlights(updateItem(highlights, item.id, { icon: value }))}>
                    <SelectTrigger id={`${item.id}-icon`}>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boat">Boat</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="eco">Eco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <TextField id={`${item.id}-title`} label="Title" onChange={(value) => setHighlights(updateItem(highlights, item.id, { title: value }))} value={item.title} />
                <div className="md:col-span-2">
                  <Label htmlFor={`${item.id}-description`}>Description</Label>
                  <Textarea
                    id={`${item.id}-description`}
                    onChange={(event) => setHighlights(updateItem(highlights, item.id, { description: event.target.value }))}
                    value={item.description}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <RepeatableHeader
          addLabel="Add itinerary step"
          icon={<ListChecks className="size-4" />}
          label="Itinerary"
          onAdd={() =>
            setItinerary([
              ...itinerary,
              { id: `itinerary-${crypto.randomUUID()}`, title: "", description: "" },
            ])
          }
        />
        <div className="space-y-4">
          {itinerary.map((item, index) => (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={item.id}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-stone-950">Journey step {index + 1}</p>
                <Button
                  aria-label={`Remove itinerary step ${index + 1}`}
                  disabled={itinerary.length <= 1}
                  onClick={() => setItinerary(removeItem(itinerary, item.id))}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <TextField id={`${item.id}-title`} label="Title" onChange={(value) => setItinerary(updateItem(itinerary, item.id, { title: value }))} value={item.title} />
              <div className="mt-4">
                <Label htmlFor={`${item.id}-description`}>Description</Label>
                <Textarea
                  id={`${item.id}-description`}
                  onChange={(event) => setItinerary(updateItem(itinerary, item.id, { description: event.target.value }))}
                  value={item.description}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="tour-inclusions">Inclusions</Label>
            <Textarea id="tour-inclusions" onChange={(event) => updateField("inclusions", event.target.value)} value={form.inclusions} />
            <p className="mt-2 text-xs font-medium text-stone-500">{inclusions.length} inclusion items</p>
          </div>
          <div>
            <Label htmlFor="tour-exclusions">Exclusions</Label>
            <Textarea id="tour-exclusions" onChange={(event) => updateField("exclusions", event.target.value)} value={form.exclusions} />
            <p className="mt-2 text-xs font-medium text-stone-500">{exclusions.length} exclusion items</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OperationsSection({
  form,
  updateField,
}: Readonly<{
  form: TourFormState;
  updateField: <K extends keyof TourFormState>(field: K, value: TourFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Admin-facing controls for upcoming departures, staffing, seat posture, and merchandising notes."
          eyebrow="Operations"
          title="Departure and sales posture"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField id="departure-date" label="Departure date" onChange={(value) => updateField("departureDate", value)} value={form.departureDate} />
          <TextField id="tour-guide" label="Guide" onChange={(value) => updateField("guide", value)} value={form.guide} />
          <TextField id="booked-seats" label="Booked seats" onChange={(value) => updateField("bookedSeats", value)} value={form.bookedSeats} />
          <TextField id="capacity-seats" label="Capacity seats" onChange={(value) => updateField("capacitySeats", value)} value={form.capacitySeats} />
          <div className="md:col-span-2">
            <Label htmlFor="operational-status">Operational status</Label>
            <Select value={form.operationalStatus} onValueChange={(value: OperationalStatus) => updateField("operationalStatus", value)}>
              <SelectTrigger id="operational-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Push sales">Push sales</SelectItem>
                <SelectItem value="Almost full">Almost full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="merchandising-note">Merchandising note / priority</Label>
          <Textarea
            id="merchandising-note"
            onChange={(event) => updateField("merchandisingNote", event.target.value)}
            value={form.merchandisingNote}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MediaSection({
  errors,
  form,
  gallery,
  setGallery,
  updateField,
}: Readonly<{
  errors: FormErrors;
  form: TourFormState;
  gallery: readonly GalleryItem[];
  setGallery: (items: readonly GalleryItem[]) => void;
  updateField: <K extends keyof TourFormState>(field: K, value: TourFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Image URLs and alt text for listing cards, detail hero, curator profile, and gallery layouts."
          eyebrow="Media"
          title="Tour imagery"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.cardImage} id="card-image" label="Card image URL" onChange={(value) => updateField("cardImage", value)} value={form.cardImage} />
          <TextField id="card-alt" label="Card image alt text" onChange={(value) => updateField("cardAlt", value)} value={form.cardAlt} />
          <TextField error={errors.heroImage} id="hero-image" label="Hero image URL" onChange={(value) => updateField("heroImage", value)} value={form.heroImage} />
          <TextField id="hero-alt" label="Hero image alt text" onChange={(value) => updateField("heroAlt", value)} value={form.heroAlt} />
          <TextField id="curator-image" label="Curator image URL" onChange={(value) => updateField("curatorImage", value)} value={form.curatorImage} />
          <TextField id="curator-alt" label="Curator image alt text" onChange={(value) => updateField("curatorAlt", value)} value={form.curatorAlt} />
        </div>
        <RepeatableHeader
          addLabel="Add gallery image"
          icon={<ImageIcon className="size-4" />}
          label="Gallery"
          onAdd={() =>
            setGallery([
              ...gallery,
              { id: `gallery-${crypto.randomUUID()}`, image: "", alt: "", layout: "landscape" },
            ])
          }
        />
        <div className="space-y-4">
          {gallery.map((item, index) => (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={item.id}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-stone-950">Gallery image {index + 1}</p>
                <Button
                  aria-label={`Remove gallery image ${index + 1}`}
                  disabled={gallery.length <= 1}
                  onClick={() => setGallery(removeItem(gallery, item.id))}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField id={`${item.id}-image`} label="Image URL" onChange={(value) => setGallery(updateItem(gallery, item.id, { image: value }))} value={item.image} />
                <TextField id={`${item.id}-alt`} label="Alt text" onChange={(value) => setGallery(updateItem(gallery, item.id, { alt: value }))} value={item.alt} />
                <div className="md:col-span-2">
                  <Label htmlFor={`${item.id}-layout`}>Layout</Label>
                  <Select value={item.layout} onValueChange={(value: GalleryLayout) => setGallery(updateItem(gallery, item.id, { layout: value }))}>
                    <SelectTrigger id={`${item.id}-layout`}>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RepeatableHeader({
  addLabel,
  icon,
  label,
  onAdd,
}: Readonly<{ addLabel?: string; icon: ReactNode; label: string; onAdd: () => void }>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-5">
      <div className="flex items-center gap-2 text-sm font-bold text-stone-950">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
          {icon}
        </span>
        {label}
      </div>
      <Button onClick={onAdd} size="sm" type="button" variant="outline">
        <Plus className="size-4" />
        {addLabel ?? "Add item"}
      </Button>
    </div>
  );
}
