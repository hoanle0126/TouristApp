"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  CircleAlert,
  Coffee,
  Compass,
  Fish,
  Footprints,
  Hotel,
  ImageIcon,
  Leaf,
  ListChecks,
  Map,
  Mountain,
  Plus,
  Sailboat,
  Save,
  Sparkles,
  Trash2,
  Utensils,
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
  type AdminTourDepartureFormRow,
  type GalleryItem,
  type GalleryLayout,
  type HighlightIcon,
  type HighlightItem,
  type ItineraryItem,
  type OperationalStatus,
  type TourBadge,
  type TourFormState,
  slugifyTourTitle,
} from "@/src/components/admin/adminTourFormData";
import { getDestinationDetails } from "@/src/lib/api/destinations";
import { createTour, updateTour, updateTourDepartures, type SaveTourInput, type UpdateTourDeparturesInput } from "@/src/lib/api/tours";
import type { ApiTourDetail } from "@/src/lib/api/types";

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
  readonly mode?: "create" | "update";
  readonly originalSlug?: string;
}

interface FormErrors {
  title?: string;
  duration?: string;
  guests?: string;
  price?: string;
  cardImage?: string;
  heroImage?: string;
  shortDescription?: string;
  destinationSlug?: string;
}

const highlightIconOptions = [
  { value: "boat", label: "Boat", icon: Sailboat },
  { value: "fish", label: "Fish", icon: Fish },
  { value: "food", label: "Food", icon: Utensils },
  { value: "eco", label: "Eco", icon: Leaf },
  { value: "camera", label: "Camera", icon: Camera },
  { value: "map", label: "Map", icon: Map },
  { value: "mountain", label: "Mountain", icon: Mountain },
  { value: "sparkles", label: "Signature", icon: Sparkles },
  { value: "hotel", label: "Hotel", icon: Hotel },
  { value: "walk", label: "Walking", icon: Footprints },
  { value: "coffee", label: "Coffee", icon: Coffee },
  { value: "compass", label: "Compass", icon: Compass },
] satisfies readonly { value: HighlightIcon; label: string; icon: typeof Sailboat }[];

const DESTINATION_ERROR_ID = "tour-destination-error";

interface InventoryValidationResult {
  readonly errors: readonly string[];
  readonly payload: UpdateTourDeparturesInput;
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

function removeDeparture(items: readonly AdminTourDepartureFormRow[], rowId: string) {
  const row = items.find((item) => item.rowId === rowId);

  if (!row || row.id || items.length <= 1) {
    return items;
  }

  return items.filter((item) => item.rowId !== rowId);
}

function updateDeparture<K extends keyof AdminTourDepartureFormRow>(items: readonly AdminTourDepartureFormRow[], rowId: string, field: K, value: AdminTourDepartureFormRow[K]) {
  return items.map((item) => (item.rowId === rowId ? { ...item, [field]: value } : item));
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

function isStrictDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseNonNegativeInteger(value: string) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number(value);
}

function rowsFromTourDetail(detail: ApiTourDetail): readonly AdminTourDepartureFormRow[] {
  return detail.departures.length > 0 ? detail.departures.map((departure, index) => ({
    id: departure.id,
    rowId: `departure-${index + 1}`,
    date: departure.date,
    capacity: String(departure.capacity),
    booked: String(departure.booked),
    status: departure.status,
  })) : [{ rowId: "departure-1", date: "", capacity: "", booked: "0", status: "open" }];
}

function validateTourDepartures(departures: readonly AdminTourDepartureFormRow[]): InventoryValidationResult {
  const errors: string[] = [];
  const dates = new Set<string>();
  const payload: {
    readonly id?: string;
    readonly date: string;
    readonly capacity: number;
    readonly status: "open" | "closed";
  }[] = [];

  departures.forEach(({ booked, capacity, date, id, status }, index) => {
    const label = `Departure ${index + 1}`;
    const trimmedDate = date.trim();
    const trimmedCapacity = capacity.trim();
    const parsedCapacity = parseNonNegativeInteger(trimmedCapacity);
    const parsedBooked = parseNonNegativeInteger(booked.trim()) ?? 0;

    if (!isStrictDateOnly(trimmedDate)) {
      errors.push(`${label}: Date must be a real YYYY-MM-DD date.`);
    } else if (dates.has(trimmedDate)) {
      errors.push(`${label}: Duplicate departure date ${trimmedDate}.`);
    } else {
      dates.add(trimmedDate);
    }

    if (parsedCapacity === null) {
      errors.push(`${label}: Capacity must be a non-negative whole number.`);
    } else if (parsedCapacity < parsedBooked) {
      errors.push(`${label}: Capacity cannot be lower than current bookings.`);
    }

    if (isStrictDateOnly(trimmedDate) && parsedCapacity !== null && parsedCapacity >= parsedBooked) {
      payload.push({ ...(id ? { id } : {}), date: trimmedDate, capacity: parsedCapacity, status });
    }
  });

  return { errors, payload };
}

function toTourPayload(
  form: TourFormState,
  highlights: readonly HighlightItem[],
  itinerary: readonly ItineraryItem[],
  gallery: readonly GalleryItem[],
): SaveTourInput {
  return {
    slug: slugifyTourTitle(form.title),
    title: form.title,
    ...(form.badge === "none" ? {} : { badge: form.badge }),
    type: form.type,
    duration: form.duration,
    guests: form.guests,
    price: form.price,
    availability: form.availability,
    description: splitLines(form.descriptionParagraphs),
    shortDescription: form.shortDescription,
    image: form.cardImage,
    heroImage: form.heroImage,
    subtitle: form.subtitle,
    highlights: highlights.map(({ description, icon, title }) => ({ description, icon, title })),
    itinerary: itinerary.map(({ description, title }) => ({ description, title })),
    gallery: gallery.map(({ image, layout }) => ({ image, layout })),
    inclusions: splitLines(form.inclusions),
    exclusions: splitLines(form.exclusions),
    destinationSlug: form.destinationSlug,
  };
}

export function AdminTourForm({ copy, initialValues, mode = "create", originalSlug }: AdminTourFormProps) {
  const [form, setForm] = useState<TourFormState>(initialValues.form);
  const [departures, setDepartures] = useState<readonly AdminTourDepartureFormRow[]>(initialValues.departures);
  const [highlights, setHighlights] = useState<readonly HighlightItem[]>(initialValues.highlights);
  const [itinerary, setItinerary] = useState<readonly ItineraryItem[]>(initialValues.itinerary);
  const [gallery, setGallery] = useState<readonly GalleryItem[]>(initialValues.gallery);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinationOptions, setDestinationOptions] = useState<readonly { readonly slug: string; readonly title: string }[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [destinationLoadError, setDestinationLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getDestinationDetails({ perPage: 100 })
      .then((items) => {
        if (!isActive) {
          return;
        }

        setDestinationOptions(
          items.map((item) => ({ slug: item.slug, title: item.title })),
        );
        setDestinationLoadError(null);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setDestinationOptions([]);
        setDestinationLoadError("Unable to load destinations. Refresh and try again.");
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingDestinations(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const readiness = useMemo(
    () => [
      {
        label: "Essentials",
        ready: [form.title, form.duration, form.guests, form.price, form.shortDescription, form.destinationSlug].every(hasValue),
      },
      {
        label: "Media",
        ready:
          hasValue(form.cardImage) &&
          hasValue(form.heroImage) &&
          gallery.some((item) => hasValue(item.image)),
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
    setForm((current) => {
      if (field === "title") {
        return {
          ...current,
          title: value as TourFormState["title"],
          slug: slugifyTourTitle(String(value)),
        };
      }
      return { ...current, [field]: value };
    });
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
    if (destinationLoadError) {
      nextErrors.destinationSlug = destinationLoadError;
    } else if (!hasValue(form.destinationSlug)) {
      nextErrors.destinationSlug = "Choose a destination.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const inventoryValidation = validateTourDepartures(departures);

      if (inventoryValidation.errors.length > 0) {
        setSubmitError(inventoryValidation.errors.join(" "));
        return;
      }

      const payload = toTourPayload(form, highlights, itinerary, gallery);
      const savedTour = mode === "update"
        ? await updateTour(originalSlug ?? form.slug, payload)
        : await createTour(payload);

      try {
        const savedTourWithDepartures = await updateTourDepartures(savedTour.slug ?? form.slug, inventoryValidation.payload);
        setDepartures(rowsFromTourDetail(savedTourWithDepartures));
        if (savedTourWithDepartures.slug) {
          setForm((current) => ({ ...current, slug: savedTourWithDepartures.slug }));
        }
        setSaved(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save tour inventory.";
        setSubmitError(`Core details were saved, but inventory failed: ${message}`);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save tour.");
    } finally {
      setIsSubmitting(false);
    }
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

  function updateDepartures(items: readonly AdminTourDepartureFormRow[]) {
    setDepartures(items);
    setSaved(false);
  }

  return (
    <form className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_420px]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <EssentialsSection
          destinationOptions={destinationOptions}
          errors={errors}
          form={form}
          isLoadingDestinations={isLoadingDestinations}
          updateField={updateField}
        />
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
        <TourDeparturesSection departures={departures} setDepartures={updateDepartures} />
      </div>

      <TourDraftSidebar copy={copy} form={form} isSubmitting={isSubmitting} readiness={readiness} saved={saved} submitError={submitError} />
    </form>
  );
}

function TourDraftSidebar({
  copy,
  form,
  isSubmitting,
  readiness,
  saved,
  submitError,
}: Readonly<{
  copy: AdminTourFormCopy;
  form: TourFormState;
  isSubmitting: boolean;
  readiness: readonly { readonly label: string; readonly ready: boolean }[];
  saved: boolean;
  submitError: string | null;
}>) {
  const completed = readiness.filter((item) => item.ready).length;

  return (
    <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <Card className="border-none bg-stone-950 text-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.85)]">
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-200">
                {copy.readinessEyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                {completed} of {readiness.length} sections ready
              </h3>
              {copy.modeBadge ? (
                <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-100">
                  {copy.modeBadge}
                </p>
              ) : null}
            </div>
            <BadgeCheck className="size-6 text-red-200" />
          </div>

          <div className="mt-6 space-y-3">
            {readiness.map((item) => (
              <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3" key={item.label}>
                <span className="text-sm font-semibold">
                  {item.label}
                  <span className="sr-only">: {item.ready ? "ready" : "incomplete"}</span>
                </span>
                {item.ready ? (
                  <CheckCircle2 className="size-4 text-red-200" />
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
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
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
        <Card aria-live="polite" className="border-none bg-red-100 text-red-950" role="status">
          <CardContent className="flex gap-3 p-5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-bold">{copy.successTitle}</p>
              <p className="mt-1 text-sm text-red-900/75">
                {copy.successDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {submitError ? (
        <Card aria-live="polite" className="border-none bg-rose-100 text-rose-950" role="alert">
          <CardContent className="p-5 text-sm font-semibold">{submitError}</CardContent>
        </Card>
      ) : null}

      <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
        <Save className="size-4" />
        {isSubmitting ? "Saving..." : saved ? copy.savedSubmitLabel : copy.submitLabel}
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
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">{eyebrow}</p>
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
  disabled,
  hint,
}: Readonly<{
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  hint?: string;
}>) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function ImagePreview({ alt, src, variant }: Readonly<{ alt: string; src: string; variant: "portrait" | "square" | "wide" }>) {
  const [failedSrc, setFailedSrc] = useState("");
  const trimmedSrc = src.trim();
  const hasError = failedSrc === trimmedSrc;
  const aspectClass = variant === "portrait" ? "aspect-[4/5]" : variant === "square" ? "aspect-square" : "aspect-video";

  if (!trimmedSrc || hasError) {
    return (
      <div className={`flex ${aspectClass} items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-center text-sm font-semibold text-stone-400`}>
        <div>
          <ImageIcon className="mx-auto mb-2 size-5" />
          {trimmedSrc ? "Preview unavailable" : "No image selected"}
        </div>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} overflow-hidden rounded-2xl border border-stone-200 bg-stone-100`}>
      <img alt={alt} className="size-full object-cover" onError={() => setFailedSrc(trimmedSrc)} src={trimmedSrc} />
    </div>
  );
}

function ImageUrlField({
  error,
  id,
  label,
  onChange,
  previewAlt,
  previewVariant = "wide",
  value,
}: Readonly<{
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  previewAlt: string;
  previewVariant?: "portrait" | "square" | "wide";
  value: string;
}>) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(file: File) {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        setUploadError(payload.error ?? "Upload failed. Please try another image.");
        return;
      }

      onChange(payload.url);
    } catch {
      setUploadError("Upload failed. Please try another image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <ImagePreview alt={previewAlt} src={value} variant={previewVariant} />
      <TextField error={error} id={id} label={label} onChange={onChange} value={value} />
      <div>
        <Label htmlFor={`${id}-upload`}>Upload from computer</Label>
        <Input
          accept="image/gif,image/jpeg,image/png,image/webp"
          disabled={isUploading}
          id={`${id}-upload`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) {
              void uploadImage(file);
            }
          }}
          type="file"
        />
        <p aria-live="polite" className="mt-2 text-xs font-medium text-stone-500">
          {isUploading ? "Uploading..." : "JPG, PNG, WebP, or GIF up to 5MB."}
        </p>
        <FieldError message={uploadError ?? undefined} />
      </div>
    </div>
  );
}

function EssentialsSection({
  destinationOptions,
  errors,
  form,
  isLoadingDestinations,
  updateField,
}: Readonly<{
  destinationOptions: readonly { readonly slug: string; readonly title: string }[];
  errors: FormErrors;
  form: TourFormState;
  isLoadingDestinations: boolean;
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
          <TextField id="tour-slug" label="Slug" disabled hint="Auto-generated from the title." onChange={() => undefined} value={slugifyTourTitle(form.title)} />
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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tour-destination">Destination</Label>
            <Select
              disabled={isLoadingDestinations || destinationOptions.length === 0}
              value={form.destinationSlug}
              onValueChange={(value) => updateField("destinationSlug", value)}
            >
              <SelectTrigger
                aria-describedby={errors.destinationSlug ? DESTINATION_ERROR_ID : undefined}
                aria-invalid={errors.destinationSlug ? true : undefined}
                id="tour-destination"
              >
                <SelectValue placeholder={isLoadingDestinations ? "Loading destinations..." : "Choose a destination"} />
              </SelectTrigger>
              <SelectContent>
                {destinationOptions.map((destination) => (
                  <SelectItem key={destination.slug} value={destination.slug}>
                    {destination.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id={DESTINATION_ERROR_ID} message={errors.destinationSlug} />
          </div>
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
                      {(() => {
                        const selectedOption = highlightIconOptions.find((option) => option.value === item.icon) ?? highlightIconOptions[0];
                        const SelectedIcon = selectedOption.icon;

                        return (
                          <div className="flex items-center gap-2">
                            <SelectedIcon className="size-4 text-red-800" />
                            <span>{selectedOption.label}</span>
                          </div>
                        );
                      })()}
                    </SelectTrigger>
                    <SelectContent>
                      {highlightIconOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <Icon className="size-4 text-red-800" />
                              <span>{option.label}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
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

function TourDeparturesSection({
  departures,
  setDepartures,
}: Readonly<{
  departures: readonly AdminTourDepartureFormRow[];
  setDepartures: (items: readonly AdminTourDepartureFormRow[]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Manage dated seat inventory. Booked seats are read-only and capacity cannot drop below current bookings."
          eyebrow="Inventory"
          title="Departure inventory"
        />
        <RepeatableHeader
          addLabel="Add departure"
          icon={<ListChecks className="size-4" />}
          label="Departures"
          onAdd={() => setDepartures([...departures, { rowId: `departure-${crypto.randomUUID()}`, date: "", capacity: "", booked: "0", status: "open" }])}
        />
        <div className="space-y-4">
          {departures.map((departure, index) => (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={departure.rowId}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-stone-950">Departure {index + 1}</p>
                <Button
                  aria-describedby={departure.id ? `${departure.rowId}-remove-help` : undefined}
                  aria-label={`Remove departure ${index + 1}`}
                  disabled={departures.length <= 1 || Boolean(departure.id)}
                  onClick={() => setDepartures(removeDeparture(departures, departure.rowId))}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {departure.id ? (
                <p className="mb-4 text-xs font-medium text-stone-500" id={`${departure.rowId}-remove-help`}>
                  Saved departures cannot be deleted here. Remove unsaved rows before saving.
                </p>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <TextField id={`${departure.rowId}-date`} label="Date" onChange={(value) => setDepartures(updateDeparture(departures, departure.rowId, "date", value))} value={departure.date} />
                <TextField id={`${departure.rowId}-capacity`} label="Capacity" onChange={(value) => setDepartures(updateDeparture(departures, departure.rowId, "capacity", value))} value={departure.capacity} />
                <div>
                  <Label htmlFor={`${departure.rowId}-booked`}>Booked</Label>
                  <Input id={`${departure.rowId}-booked`} readOnly value={departure.booked} />
                  <p className="mt-2 text-xs font-medium text-stone-500">Booked seats are read-only and updated by bookings.</p>
                </div>
                <div>
                  <Label htmlFor={`${departure.rowId}-status`}>Status</Label>
                  <Select value={departure.status} onValueChange={(value: "open" | "closed") => setDepartures(updateDeparture(departures, departure.rowId, "status", value))}>
                    <SelectTrigger id={`${departure.rowId}-status`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
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
          description="Image URLs for listing cards, detail hero, and gallery layouts."
          eyebrow="Media"
          title="Tour imagery"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <ImageUrlField
            error={errors.cardImage}
            id="card-image"
            label="Card image URL"
            onChange={(value) => updateField("cardImage", value)}
            previewAlt={`${form.title || "Tour"} card image preview`}
            value={form.cardImage}
          />
          <ImageUrlField
            error={errors.heroImage}
            id="hero-image"
            label="Hero image URL"
            onChange={(value) => updateField("heroImage", value)}
            previewAlt={`${form.title || "Tour"} hero image preview`}
            value={form.heroImage}
          />
        </div>
        <RepeatableHeader
          addLabel="Add gallery image"
          icon={<ImageIcon className="size-4" />}
          label="Gallery"
          onAdd={() =>
            setGallery([
              ...gallery,
              { id: `gallery-${crypto.randomUUID()}`, image: "", layout: "landscape" },
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
                <ImageUrlField
                  id={`${item.id}-image`}
                  label="Image URL"
                  onChange={(value) => setGallery(updateItem(gallery, item.id, { image: value }))}
                  previewAlt={`${form.title || "Tour"} gallery image ${index + 1} preview`}
                  previewVariant={item.layout === "portrait" ? "portrait" : "wide"}
                  value={item.image}
                />
                <div>
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
        <span className="flex size-9 items-center justify-center rounded-2xl bg-red-100 text-red-900">
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
