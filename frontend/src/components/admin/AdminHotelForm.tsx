"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { BadgeCheck, BedDouble, Car, CheckCircle2, CircleAlert, Coffee, Dumbbell, ImageIcon, ListChecks, MapPinned, Plus, Save, Sparkles, Trash2, Utensils, Waves, Wifi } from "lucide-react";

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
  type AdminHotelInventoryFormRow,
  createEmptyAmenity,
  createEmptyGalleryImage,
  createEmptySuite,
  slugifyHotelName,
  type HotelAmenityIcon,
  type HotelAmenityRow,
  type HotelCommercialStatus,
  type HotelFormInitialValues,
  type HotelFormState,
  type HotelGalleryRow,
  type HotelSuiteRow,
  type HotelTextRow,
} from "@/src/components/admin/adminHotelFormData";
import { getDestinationDetails } from "@/src/lib/api/destinations";
import { createHotel, updateHotel, updateHotelInventory, type SaveHotelInput, type UpdateHotelInventoryInput } from "@/src/lib/api/hotels";
import type { ApiDestinationDetail, ApiHotelDetail } from "@/src/lib/api/types";

interface AdminHotelFormCopy {
  readonly readinessEyebrow: string;
  readonly submitLabel: string;
  readonly savedSubmitLabel: string;
  readonly successTitle: string;
  readonly successDescription: string;
}

interface AdminHotelFormProps {
  readonly copy: AdminHotelFormCopy;
  readonly initialValues: HotelFormInitialValues;
  readonly mode?: "create" | "update";
  readonly originalSlug?: string;
}

interface FormErrors {
  name?: string;
  location?: string;
  address?: string;
  price?: string;
  listingImage?: string;
  heroImage?: string;
  destinationSlug?: string;
  description?: string;
}

interface InventoryValidationResult {
  readonly errors: readonly string[];
  readonly payload: UpdateHotelInventoryInput;
}

const amenityIconOptions = [
  { value: "pool", label: "Pool", icon: Waves },
  { value: "spa", label: "Spa", icon: Sparkles },
  { value: "dining", label: "Dining", icon: Utensils },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "wifi", label: "Wi-Fi", icon: Wifi },
  { value: "coffee", label: "Coffee", icon: Coffee },
  { value: "parking", label: "Parking", icon: Car },
  { value: "beach", label: "Beach", icon: Waves },
] satisfies readonly { value: HotelAmenityIcon; label: string; icon: typeof Waves }[];

function hasValue(value: string | undefined) {
  return (value ?? "").trim().length > 0;
}

function createTextRow(prefix: string): HotelTextRow {
  return { id: `${prefix}-${crypto.randomUUID()}`, value: "" };
}

function updateTextRow(items: readonly HotelTextRow[], id: string, value: string) {
  return items.map((item) => (item.id === id ? { ...item, value } : item));
}

function updateAmenityRow<K extends keyof HotelAmenityRow>(items: readonly HotelAmenityRow[], id: string, field: K, value: HotelAmenityRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function removeRow<T extends { readonly id: string }>(items: readonly T[], id: string) {
  return items.length > 1 ? items.filter((item) => item.id !== id) : items;
}

function removeInventoryRow(items: readonly AdminHotelInventoryFormRow[], rowId: string) {
  const row = items.find((item) => item.rowId === rowId);

  if (!row || row.id || items.length <= 1) {
    return items;
  }

  return items.filter((item) => item.rowId !== rowId);
}

function updateSuiteRow<K extends keyof HotelSuiteRow>(items: readonly HotelSuiteRow[], id: string, field: K, value: HotelSuiteRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function updateGalleryRow<K extends keyof HotelGalleryRow>(items: readonly HotelGalleryRow[], id: string, field: K, value: HotelGalleryRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function toApiStatus(status: HotelCommercialStatus): SaveHotelInput["status"] {
  return status === "Published" ? "published" : status === "Ready for review" ? "draft" : "draft";
}

function toNumber(value: string) {
  return Number(value) || 0;
}

async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    body: formData,
    method: "POST",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Unable to upload image.");
  }

  return String(payload.url);
}

function updateInventoryRow<K extends keyof AdminHotelInventoryFormRow>(items: readonly AdminHotelInventoryFormRow[], rowId: string, field: K, value: AdminHotelInventoryFormRow[K]) {
  return items.map((item) => (item.rowId === rowId ? { ...item, [field]: value } : item));
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

function rowsFromHotelDetail(detail: ApiHotelDetail): readonly AdminHotelInventoryFormRow[] {
  return detail.inventory.length > 0 ? detail.inventory.map((day, index) => ({
    id: day.id,
    rowId: `inventory-${index + 1}`,
    date: day.date,
    totalRooms: String(day.totalRooms),
    bookedRooms: String(day.bookedRooms),
    status: day.status,
  })) : [{ rowId: "inventory-1", date: "", totalRooms: "", bookedRooms: "0", status: "open" }];
}

function validateHotelInventory(inventory: readonly AdminHotelInventoryFormRow[]): InventoryValidationResult {
  const errors: string[] = [];
  const dates = new Set<string>();
  const payload: {
    readonly id?: string;
    readonly date: string;
    readonly totalRooms: number;
    readonly status: "open" | "closed";
  }[] = [];

  inventory.forEach(({ bookedRooms, date, id, status, totalRooms }, index) => {
    const label = `Inventory day ${index + 1}`;
    const trimmedDate = date.trim();
    const trimmedTotalRooms = totalRooms.trim();
    const parsedTotalRooms = parseNonNegativeInteger(trimmedTotalRooms);
    const parsedBookedRooms = parseNonNegativeInteger(bookedRooms.trim()) ?? 0;

    if (!isStrictDateOnly(trimmedDate)) {
      errors.push(`${label}: Date must be a real YYYY-MM-DD date.`);
    } else if (dates.has(trimmedDate)) {
      errors.push(`${label}: Duplicate inventory date ${trimmedDate}.`);
    } else {
      dates.add(trimmedDate);
    }

    if (parsedTotalRooms === null) {
      errors.push(`${label}: Total rooms must be a non-negative whole number.`);
    } else if (parsedTotalRooms < parsedBookedRooms) {
      errors.push(`${label}: Capacity cannot be lower than current bookings.`);
    }

    if (isStrictDateOnly(trimmedDate) && parsedTotalRooms !== null && parsedTotalRooms >= parsedBookedRooms) {
      payload.push({ ...(id ? { id } : {}), date: trimmedDate, totalRooms: parsedTotalRooms, status });
    }
  });

  return { errors, payload };
}

function toHotelPayload(
  form: HotelFormState,
  amenities: readonly HotelAmenityRow[],
  description: readonly HotelTextRow[],
  suites: readonly HotelSuiteRow[],
  gallery: readonly HotelGalleryRow[],
): SaveHotelInput {
  return {
    slug: slugifyHotelName(form.name),
    name: form.name,
    location: form.location,
    address: form.address,
    price: form.price,
    ...(form.badge ? { badge: form.badge } : {}),
    status: toApiStatus(form.status),
    listingImage: form.listingImage,
    heroImage: form.heroImage,
    description: description.map((item) => item.value.trim()).filter(Boolean),
    amenities: amenities
      .filter((item) => hasValue(item.title))
      .map((item) => ({ icon: item.icon, title: item.title.trim() })),
    suites: suites
      .filter((suite) => [suite.name, suite.price, suite.description, suite.image].every(hasValue))
      .map(({ badge, description, image, name, price }) => ({ ...(badge ? { badge } : {}), description, image, name, price })),
    gallery: gallery
      .filter((image) => hasValue(image.image))
      .map(({ image }) => ({ image })),
    booking: {
      checkIn: form.bookingCheckIn,
      checkOut: form.bookingCheckOut,
      fee: form.bookingFee,
      nightlyTotal: form.bookingNightlyTotal,
      nights: toNumber(form.bookingNights),
      rating: toNumber(form.bookingRating),
      travelers: form.bookingTravelers,
      total: form.bookingTotal,
    },
    destinationSlugs: form.destinationSlug ? [form.destinationSlug] : [],
  };
}

export function AdminHotelForm({ copy, initialValues, mode = "create", originalSlug }: AdminHotelFormProps) {
  const [form, setForm] = useState<HotelFormState>(initialValues.form);
  const [inventory, setInventory] = useState<readonly AdminHotelInventoryFormRow[]>(initialValues.inventory);
  const [amenities, setAmenities] = useState<readonly HotelAmenityRow[]>(initialValues.amenities);
  const [description, setDescription] = useState<readonly HotelTextRow[]>(initialValues.description);
  const [suites, setSuites] = useState<readonly HotelSuiteRow[]>(initialValues.suites);
  const [gallery, setGallery] = useState<readonly HotelGalleryRow[]>(initialValues.gallery);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<readonly ApiDestinationDetail[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [destinationLoadError, setDestinationLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getDestinationDetails({ perPage: 100 })
      .then((items) => {
        if (!cancelled) {
          setDestinations(items);
          setDestinationLoadError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDestinationLoadError("Unable to load destinations. Refresh and try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingDestinations(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const readiness = useMemo(
    () => [
      {
        label: "Essentials",
        ready: [form.name, form.price, form.destinationSlug].every(hasValue),
      },
      {
        label: "Media",
        ready: [form.listingImage, form.heroImage].every(hasValue),
      },
      {
        label: "Story",
        ready: description.some((item) => hasValue(item.value)),
      },
      {
        label: "Inventory",
        ready:
          amenities.some((item) => hasValue(item.title)) &&
          suites.some((suite) => [suite.name, suite.price, suite.description].some(hasValue)) &&
          gallery.some((image) => hasValue(image.image)),
      },
      {
        label: "Booking",
        ready: [form.bookingCheckIn, form.bookingCheckOut, form.bookingNights, form.bookingRating, form.bookingTotal].every(hasValue),
      },
    ],
    [amenities, description, form, gallery, suites],
  );

  function updateField<K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) {
    setForm((current) => {
      if (field === "name") {
        return { ...current, name: value, slug: slugifyHotelName(String(value)) };
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

    if (!form.name.trim()) {
      nextErrors.name = "Hotel name is required.";
    }
    if (!form.location.trim()) {
      nextErrors.location = "Location is required.";
    }
    if (!form.address.trim()) {
      nextErrors.address = "Address is required.";
    }
    if (!form.price.trim()) {
      nextErrors.price = "Price is required.";
    }
    if (!form.listingImage.trim()) {
      nextErrors.listingImage = "Listing image URL is required.";
    }
    if (!form.heroImage.trim()) {
      nextErrors.heroImage = "Hero image URL is required.";
    }
    if (!form.destinationSlug.trim()) {
      nextErrors.destinationSlug = "Destination is required.";
    }
    if (!description[0]?.value.trim()) {
      nextErrors.description = "First description paragraph is required.";
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
      const inventoryValidation = validateHotelInventory(inventory);

      if (inventoryValidation.errors.length > 0) {
        setSubmitError(inventoryValidation.errors.join(" "));
        return;
      }

      const payload = toHotelPayload(form, amenities, description, suites, gallery);
      const savedHotel = mode === "update"
        ? await updateHotel(originalSlug ?? form.slug, payload)
        : await createHotel(payload);

      try {
        const savedHotelWithInventory = await updateHotelInventory(savedHotel.slug ?? form.slug, inventoryValidation.payload);
        setInventory(rowsFromHotelDetail(savedHotelWithInventory));
        if (savedHotelWithInventory.slug) {
          setForm((current) => ({ ...current, slug: savedHotelWithInventory.slug }));
        }
        setSaved(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save hotel inventory.";
        setSubmitError(`Core details were saved, but inventory failed: ${message}`);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save hotel.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateCollection<T>(setRows: (items: readonly T[]) => void, items: readonly T[]) {
    setRows(items);
    setSaved(false);
  }

  return (
    <form className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_420px]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <HotelEssentialsSection
          destinationLoadError={destinationLoadError}
          destinations={destinations}
          errors={errors}
          form={form}
          isLoadingDestinations={isLoadingDestinations}
          updateField={updateField}
        />
        <HotelMediaSection errors={errors} form={form} updateField={updateField} />
        <HotelStorySection
          description={description}
          error={errors.description}
          setDescription={(items) => updateCollection(setDescription, items)}
        />
        <HotelDailyRoomInventorySection
          inventory={inventory}
          setInventory={(items) => updateCollection(setInventory, items)}
        />
        <HotelInventorySection
          amenities={amenities}
          gallery={gallery}
          setAmenities={(items) => updateCollection(setAmenities, items)}
          setGallery={(items) => updateCollection(setGallery, items)}
          setSuites={(items) => updateCollection(setSuites, items)}
          suites={suites}
        />
        <HotelBookingSection form={form} updateField={updateField} />
      </div>

      <HotelDraftSidebar copy={copy} form={form} isSubmitting={isSubmitting} readiness={readiness} saved={saved} submitError={submitError} />
    </form>
  );
}

function HotelDraftSidebar({
  copy,
  form,
  isSubmitting,
  readiness,
  saved,
  submitError,
}: Readonly<{
  copy: AdminHotelFormCopy;
  form: HotelFormState;
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
            {form.name || "Untitled hotel"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {form.address || form.location || "Add the hotel location and address to preview detail page copy."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <SummaryPill label="Location" value={form.location || "Not set"} />
            <SummaryPill label="Price" value={form.price || "Not set"} />
            <SummaryPill label="Status" value={form.status} />
          </div>
        </CardContent>
      </Card>

      {saved ? (
        <Card aria-live="polite" className="border-none bg-red-100 text-red-950" role="status">
          <CardContent className="flex gap-3 p-5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-bold">{copy.successTitle}</p>
              <p className="mt-1 text-sm text-red-900/75">{copy.successDescription}</p>
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

function HotelEssentialsSection({
  destinationLoadError,
  destinations,
  errors,
  form,
  isLoadingDestinations,
  updateField,
}: Readonly<{
  destinationLoadError: string | null;
  destinations: readonly ApiDestinationDetail[];
  errors: FormErrors;
  form: HotelFormState;
  isLoadingDestinations: boolean;
  updateField: <K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Fields that power the hotel listing card, detail route, merchandising badge, and review workflow."
          eyebrow="Essentials"
          title="Core hotel information"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.name} id="hotel-name" label="Hotel name" onChange={(value) => updateField("name", value)} value={form.name} />
          <TextField id="hotel-slug" label="Slug" disabled hint="Auto-generated from the hotel name." onChange={() => undefined} value={slugifyHotelName(form.name)} />
          <div>
            <Label htmlFor="hotel-destination">Destination</Label>
            <Select disabled={isLoadingDestinations} value={form.destinationSlug} onValueChange={(value) => updateField("destinationSlug", value)}>
              <SelectTrigger id="hotel-destination">
                <SelectValue placeholder={isLoadingDestinations ? "Loading destinations..." : "Choose a destination"} />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((destination) => (
                  <SelectItem key={destination.slug} value={destination.slug}>{destination.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinationSlug ? <p className="mt-2 text-xs font-semibold text-rose-600">{errors.destinationSlug}</p> : null}
            {destinationLoadError ? <p className="mt-2 text-xs font-semibold text-rose-600">{destinationLoadError}</p> : null}
          </div>
          <TextField error={errors.price} id="hotel-price" label="Price" onChange={(value) => updateField("price", value)} value={form.price} />
          <TextField id="hotel-badge" label="Badge" onChange={(value) => updateField("badge", value)} value={form.badge} />
        </div>
      </CardContent>
    </Card>
  );
}

function HotelImageUploadField({
  error,
  id,
  label,
  onChange,
  previewLabel,
  value,
}: Readonly<{
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  previewLabel: string;
  value: string;
}>) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const url = await uploadAdminImage(file);
      onChange(url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
        {value ? (
          <div className="relative aspect-[4/3]">
            <img alt={`${previewLabel} preview`} className="object-cover absolute inset-0 w-full h-full" src={value} />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-stone-100 text-sm font-semibold text-stone-400">
            No preview
          </div>
        )}
      </div>
      <div className="mt-4 space-y-4">
        <TextField error={error} id={id} label={label} onChange={onChange} value={value} />
        <div>
          <Label htmlFor={`${id}-upload`}>Upload image</Label>
          <Input
            accept="image/gif,image/jpeg,image/png,image/webp"
            disabled={isUploading}
            id={`${id}-upload`}
            onChange={(event) => void handleUpload(event.target.files?.[0])}
            type="file"
          />
          <p className="mt-2 text-xs font-medium text-stone-500">
            {isUploading ? "Uploading..." : "JPG, PNG, WebP, or GIF up to 5MB."}
          </p>
          {uploadError ? <p className="mt-2 text-xs font-semibold text-rose-700">{uploadError}</p> : null}
        </div>
      </div>
    </div>
  );
}

function HotelMediaSection({
  errors,
  form,
  updateField,
}: Readonly<{
  errors: FormErrors;
  form: HotelFormState;
  updateField: <K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Listing and hero image URLs, plus the public-facing hotel address."
          eyebrow="Media"
          title="Hotel imagery and address"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <HotelImageUploadField
            error={errors.listingImage}
            id="hotel-listing-image"
            label="Listing image URL"
            onChange={(value) => updateField("listingImage", value)}
            previewLabel="Listing image"
            value={form.listingImage}
          />
          <HotelImageUploadField
            error={errors.heroImage}
            id="hotel-hero-image"
            label="Hero image URL"
            onChange={(value) => updateField("heroImage", value)}
            previewLabel="Hero image"
            value={form.heroImage}
          />
        </div>
        <div>
          <Label htmlFor="hotel-location">Location</Label>
          <Input
            id="hotel-location"
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="e.g. Hoi An, Vietnam"
            value={form.location}
          />
          {errors.location ? <p className="mt-1 text-sm text-red-600">{errors.location}</p> : null}
        </div>
        <div>
          <Label htmlFor="hotel-address">Address</Label>
          <Textarea id="hotel-address" onChange={(event) => updateField("address", event.target.value)} value={form.address} />
          {errors.address ? <p className="mt-1 text-sm text-red-600">{errors.address}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function HotelStorySection({
  description,
  error,
  setDescription,
}: Readonly<{
  description: readonly HotelTextRow[];
  error?: string;
  setDescription: (items: readonly HotelTextRow[]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Editable paragraphs used on the hotel detail page story and overview areas."
          eyebrow="Story"
          title="Hotel description"
        />
        <TextRowsEditor
          addLabel="Add description paragraph"
          error={error}
          icon={<MapPinned className="size-4" />}
          label="Description paragraphs"
          onAdd={() => setDescription([...description, createTextRow("description")])}
          onRemove={(id) => setDescription(removeRow(description, id))}
          onUpdate={(id, value) => setDescription(updateTextRow(description, id, value))}
          removeLabel="Remove description paragraph"
          rows={description}
          textareaLabel="Paragraph"
        />
      </CardContent>
    </Card>
  );
}

function HotelInventorySection({
  amenities,
  gallery,
  setAmenities,
  setGallery,
  setSuites,
  suites,
}: Readonly<{
  amenities: readonly HotelAmenityRow[];
  gallery: readonly HotelGalleryRow[];
  setAmenities: (items: readonly HotelAmenityRow[]) => void;
  setGallery: (items: readonly HotelGalleryRow[]) => void;
  setSuites: (items: readonly HotelSuiteRow[]) => void;
  suites: readonly HotelSuiteRow[];
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Amenities, room suites, and gallery images that guests compare before checkout."
          eyebrow="Inventory"
          title="Amenities, suites, and gallery"
        />
        <AmenitiesEditor
          amenities={amenities}
          onAdd={() => setAmenities([...amenities, createEmptyAmenity(`amenity-${crypto.randomUUID()}`)])}
          onRemove={(id) => setAmenities(removeRow(amenities, id))}
          onUpdate={(id, field, value) => setAmenities(updateAmenityRow(amenities, id, field, value))}
        />
        <SuitesEditor
          onAdd={() => setSuites([...suites, createEmptySuite(`suite-${crypto.randomUUID()}`)])}
          onRemove={(id) => setSuites(removeRow(suites, id))}
          onUpdate={(id, field, value) => setSuites(updateSuiteRow(suites, id, field, value))}
          suites={suites}
        />
        <GalleryEditor
          gallery={gallery}
          onAdd={() => setGallery([...gallery, createEmptyGalleryImage(`gallery-${crypto.randomUUID()}`)])}
          onRemove={(id) => setGallery(removeRow(gallery, id))}
          onUpdate={(id, field, value) => setGallery(updateGalleryRow(gallery, id, field, value))}
        />
      </CardContent>
    </Card>
  );
}

function HotelDailyRoomInventorySection({
  inventory,
  setInventory,
}: Readonly<{
  inventory: readonly AdminHotelInventoryFormRow[];
  setInventory: (items: readonly AdminHotelInventoryFormRow[]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Manage room availability by date. Booked rooms are read-only and total rooms cannot drop below existing bookings."
          eyebrow="Inventory"
          title="Daily room inventory"
        />
        <CollectionHeader
          addLabel="Add inventory day"
          icon={<BedDouble className="size-4" />}
          label="Room inventory"
          onAdd={() => setInventory([...inventory, { rowId: `inventory-${crypto.randomUUID()}`, date: "", totalRooms: "", bookedRooms: "0", status: "open" }])}
        />
        <div className="space-y-4">
          {inventory.map((day, index) => (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={day.rowId}>
              <RowHeader
                disabled={inventory.length <= 1 || Boolean(day.id)}
                helper={day.id ? "Saved inventory days cannot be deleted here. Remove unsaved rows before saving." : undefined}
                label={`Inventory day ${index + 1}`}
                onRemove={() => setInventory(removeInventoryRow(inventory, day.rowId))}
                removeLabel={`Remove inventory day ${index + 1}`}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField id={`${day.rowId}-date`} label="Date" onChange={(value) => setInventory(updateInventoryRow(inventory, day.rowId, "date", value))} value={day.date} />
                <TextField id={`${day.rowId}-total-rooms`} label="Total rooms" onChange={(value) => setInventory(updateInventoryRow(inventory, day.rowId, "totalRooms", value))} value={day.totalRooms} />
                <div>
                  <Label htmlFor={`${day.rowId}-booked-rooms`}>Booked rooms</Label>
                  <Input id={`${day.rowId}-booked-rooms`} readOnly value={day.bookedRooms} />
                  <p className="mt-2 text-xs font-medium text-stone-500">Booked rooms are read-only and updated by bookings.</p>
                </div>
                <div>
                  <Label htmlFor={`${day.rowId}-status`}>Status</Label>
                  <Select value={day.status} onValueChange={(value: "open" | "closed") => setInventory(updateInventoryRow(inventory, day.rowId, "status", value))}>
                    <SelectTrigger id={`${day.rowId}-status`}>
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

function HotelBookingSection({
  form,
  updateField,
}: Readonly<{
  form: HotelFormState;
  updateField: <K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Default booking summary shown before guests adjust their stay."
          eyebrow="Booking"
          title="Hotel booking defaults"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField id="hotel-booking-check-in" label="Check-in" onChange={(value) => updateField("bookingCheckIn", value)} value={form.bookingCheckIn} />
          <TextField id="hotel-booking-check-out" label="Check-out" onChange={(value) => updateField("bookingCheckOut", value)} value={form.bookingCheckOut} />
          <TextField id="hotel-booking-fee" label="Fee" onChange={(value) => updateField("bookingFee", value)} value={form.bookingFee} />
          <TextField id="hotel-booking-nightly-total" label="Nightly total" onChange={(value) => updateField("bookingNightlyTotal", value)} value={form.bookingNightlyTotal} />
          <TextField id="hotel-booking-nights" label="Nights" onChange={(value) => updateField("bookingNights", value)} value={form.bookingNights} />
          <TextField id="hotel-booking-rating" label="Booking rating" onChange={(value) => updateField("bookingRating", value)} value={form.bookingRating} />
          <TextField id="hotel-booking-travelers" label="Travelers" onChange={(value) => updateField("bookingTravelers", value)} value={form.bookingTravelers} />
          <TextField id="hotel-booking-total" label="Total" onChange={(value) => updateField("bookingTotal", value)} value={form.bookingTotal} />
        </div>
      </CardContent>
    </Card>
  );
}

function AmenitiesEditor({
  amenities,
  onAdd,
  onRemove,
  onUpdate,
}: Readonly<{
  amenities: readonly HotelAmenityRow[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof HotelAmenityRow>(id: string, field: K, value: HotelAmenityRow[K]) => void;
}>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5 first:border-t-0 first:pt-0">
      <CollectionHeader addLabel="Add amenity" icon={<ListChecks className="size-4" />} label="Amenities" onAdd={onAdd} />
      <div className="space-y-4">
        {amenities.map((amenity, index) => {
          const selectedOption = amenityIconOptions.find((option) => option.value === amenity.icon) ?? amenityIconOptions[0];
          const SelectedIcon = selectedOption.icon;

          return (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={amenity.id}>
              <RowHeader
                disabled={amenities.length <= 1}
                label={`Amenity ${index + 1}`}
                onRemove={() => onRemove(amenity.id)}
                removeLabel={`Remove amenity ${index + 1}`}
              />
              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
                <div>
                  <Label htmlFor={`${amenity.id}-icon`}>Icon</Label>
                  <Select value={amenity.icon} onValueChange={(value: HotelAmenityIcon) => onUpdate(amenity.id, "icon", value)}>
                    <SelectTrigger id={`${amenity.id}-icon`}>
                      <div className="flex items-center gap-2">
                        <SelectedIcon className="size-4 text-red-800" />
                        <span>{selectedOption.label}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {amenityIconOptions.map((option) => {
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
                <TextField id={`${amenity.id}-title`} label="Title" onChange={(value) => onUpdate(amenity.id, "title", value)} value={amenity.title} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TextRowsEditor({
  addLabel,
  error,
  icon,
  label,
  onAdd,
  onRemove,
  onUpdate,
  removeLabel,
  rows,
  textareaLabel,
}: Readonly<{
  addLabel: string;
  error?: string;
  icon: ReactNode;
  label: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, value: string) => void;
  removeLabel: string;
  rows: readonly HotelTextRow[];
  textareaLabel: string;
}>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5 first:border-t-0 first:pt-0">
      <CollectionHeader addLabel={addLabel} icon={icon} label={label} onAdd={onAdd} />
      <div className="space-y-4">
        {rows.map((row, index) => {
          const errorId = error && index === 0 ? `${row.id}-error` : undefined;

          return (
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={row.id}>
              <RowHeader
                disabled={rows.length <= 1}
                label={`${label} ${index + 1}`}
                onRemove={() => onRemove(row.id)}
                removeLabel={`${removeLabel} ${index + 1}`}
              />
              <Label htmlFor={`${row.id}-value`}>{textareaLabel}</Label>
              <Textarea
                aria-describedby={errorId}
                aria-invalid={Boolean(errorId)}
                id={`${row.id}-value`}
                onChange={(event) => onUpdate(row.id, event.target.value)}
                value={row.value}
              />
              <FieldError id={errorId} message={index === 0 ? error : undefined} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SuitesEditor({
  onAdd,
  onRemove,
  onUpdate,
  suites,
}: Readonly<{
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof HotelSuiteRow>(id: string, field: K, value: HotelSuiteRow[K]) => void;
  suites: readonly HotelSuiteRow[];
}>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
      <CollectionHeader addLabel="Add suite" icon={<BedDouble className="size-4" />} label="Suites" onAdd={onAdd} />
      <div className="space-y-4">
        {suites.map((suite, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={suite.id}>
            <RowHeader
              disabled={suites.length <= 1}
              label={`Suite ${index + 1}`}
              onRemove={() => onRemove(suite.id)}
              removeLabel={`Remove suite ${index + 1}`}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id={`${suite.id}-name`} label="Suite name" onChange={(value) => onUpdate(suite.id, "name", value)} value={suite.name} />
              <TextField id={`${suite.id}-price`} label="Suite price" onChange={(value) => onUpdate(suite.id, "price", value)} value={suite.price} />
              <TextField id={`${suite.id}-badge`} label="Suite badge" onChange={(value) => onUpdate(suite.id, "badge", value)} value={suite.badge} />
              <TextField id={`${suite.id}-image`} label="Suite image URL" onChange={(value) => onUpdate(suite.id, "image", value)} value={suite.image} />
            </div>
            <div className="mt-4">
              <Label htmlFor={`${suite.id}-description`}>Suite description</Label>
              <Textarea id={`${suite.id}-description`} onChange={(event) => onUpdate(suite.id, "description", event.target.value)} value={suite.description} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryEditor({
  gallery,
  onAdd,
  onRemove,
  onUpdate,
}: Readonly<{
  gallery: readonly HotelGalleryRow[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof HotelGalleryRow>(id: string, field: K, value: HotelGalleryRow[K]) => void;
}>) {
  const [uploadingRowId, setUploadingRowId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(rowId: string, file: File | undefined) {
    if (!file) {
      return;
    }

    setUploadingRowId(rowId);
    setUploadError(null);

    try {
      const url = await uploadAdminImage(file);
      onUpdate(rowId, "image", url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploadingRowId(null);
    }
  }

  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
      <CollectionHeader addLabel="Add gallery image" icon={<ImageIcon className="size-4" />} label="Gallery" onAdd={onAdd} />
      {uploadError ? <p className="text-xs font-semibold text-rose-700">{uploadError}</p> : null}
      <div className="space-y-4">
        {gallery.map((image, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={image.id}>
            <RowHeader
              disabled={gallery.length <= 1}
              label={`Gallery image ${index + 1}`}
              onRemove={() => onRemove(image.id)}
              removeLabel={`Remove gallery image ${index + 1}`}
            />
            <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
                {image.image ? (
                  <div className="relative aspect-[4/3]">
                    <img alt={`Gallery preview ${index + 1}`} className="object-cover absolute inset-0 w-full h-full" src={image.image} />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-stone-100 text-sm font-semibold text-stone-400">
                    No preview
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <TextField id={`${image.id}-image`} label="Image URL" onChange={(value) => onUpdate(image.id, "image", value)} value={image.image} />
                <div>
                  <Label htmlFor={`${image.id}-upload`}>Upload image</Label>
                  <Input
                    accept="image/gif,image/jpeg,image/png,image/webp"
                    disabled={uploadingRowId === image.id}
                    id={`${image.id}-upload`}
                    onChange={(event) => void handleUpload(image.id, event.target.files?.[0])}
                    type="file"
                  />
                  <p className="mt-2 text-xs font-medium text-stone-500">
                    {uploadingRowId === image.id ? "Uploading..." : "JPG, PNG, WebP, or GIF up to 5MB."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionHeader({
  addLabel,
  icon,
  label,
  onAdd,
}: Readonly<{
  addLabel: string;
  icon: ReactNode;
  label: string;
  onAdd: () => void;
}>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-bold text-stone-950">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-red-100 text-red-900">
          {icon}
        </span>
        {label}
      </div>
      <Button aria-label={addLabel} onClick={onAdd} size="sm" type="button" variant="outline">
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}

function RowHeader({
  disabled,
  helper,
  label,
  onRemove,
  removeLabel,
}: Readonly<{
  disabled: boolean;
  helper?: string;
  label: string;
  onRemove: () => void;
  removeLabel: string;
}>) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-sm font-bold text-stone-950">{label}</p>
      <Button
        aria-label={removeLabel}
        disabled={disabled}
        onClick={onRemove}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Trash2 className="size-4" />
      </Button>
      {helper ? <p className="basis-full text-xs font-medium text-stone-500">{helper}</p> : null}
    </div>
  );
}
