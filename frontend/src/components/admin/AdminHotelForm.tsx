"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { BadgeCheck, BedDouble, CheckCircle2, CircleAlert, ImageIcon, ListChecks, MapPinned, Plus, Save, Trash2 } from "lucide-react";

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
  createEmptyGalleryImage,
  createEmptyReview,
  createEmptyReviewScore,
  createEmptySuite,
  hotelStatusOptions,
  slugifyHotelName,
  type HotelCommercialStatus,
  type HotelFormInitialValues,
  type HotelFormState,
  type HotelGalleryRow,
  type HotelReviewRow,
  type HotelReviewScoreRow,
  type HotelSuiteRow,
  type HotelTextRow,
} from "@/src/components/admin/adminHotelFormData";
import { createHotel, updateHotel, type SaveHotelInput } from "@/src/lib/api/hotels";

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
  price?: string;
  listingImage?: string;
  listingAlt?: string;
  heroImage?: string;
  heroAlt?: string;
  description?: string;
}

function hasValue(value: string) {
  return value.trim().length > 0;
}

function createTextRow(prefix: string): HotelTextRow {
  return { id: `${prefix}-${crypto.randomUUID()}`, value: "" };
}

function updateTextRow(items: readonly HotelTextRow[], id: string, value: string) {
  return items.map((item) => (item.id === id ? { ...item, value } : item));
}

function removeRow<T extends { readonly id: string }>(items: readonly T[], id: string) {
  return items.length > 1 ? items.filter((item) => item.id !== id) : items;
}

function updateSuiteRow<K extends keyof HotelSuiteRow>(items: readonly HotelSuiteRow[], id: string, field: K, value: HotelSuiteRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function updateGalleryRow<K extends keyof HotelGalleryRow>(items: readonly HotelGalleryRow[], id: string, field: K, value: HotelGalleryRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function updateReviewScoreRow<K extends keyof HotelReviewScoreRow>(items: readonly HotelReviewScoreRow[], id: string, field: K, value: HotelReviewScoreRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function updateReviewRow<K extends keyof HotelReviewRow>(items: readonly HotelReviewRow[], id: string, field: K, value: HotelReviewRow[K]) {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

function toApiStatus(status: HotelCommercialStatus): SaveHotelInput["status"] {
  return status === "Published" ? "published" : status === "Ready for review" ? "draft" : "draft";
}

function toNumber(value: string) {
  return Number(value) || 0;
}

function toHotelPayload(
  form: HotelFormState,
  amenities: readonly HotelTextRow[],
  description: readonly HotelTextRow[],
  suites: readonly HotelSuiteRow[],
  gallery: readonly HotelGalleryRow[],
  reviewScores: readonly HotelReviewScoreRow[],
  reviews: readonly HotelReviewRow[],
): SaveHotelInput {
  return {
    slug: form.slug,
    name: form.name,
    location: form.location,
    address: form.address,
    price: form.price,
    ...(form.badge ? { badge: form.badge } : {}),
    score: toNumber(form.score),
    scoreLabel: form.scoreLabel,
    scoreSummary: form.scoreSummary,
    status: toApiStatus(form.status),
    listingImage: form.listingImage,
    listingAlt: form.listingAlt,
    heroImage: form.heroImage,
    heroAlt: form.heroAlt,
    description: description.map((item) => item.value.trim()).filter(Boolean),
    amenities: amenities.map((item) => item.value.trim()).filter(Boolean),
    suites: suites
      .filter((suite) => [suite.name, suite.price, suite.description, suite.image, suite.alt].every(hasValue))
      .map(({ alt, badge, description, image, name, price }) => ({ alt, ...(badge ? { badge } : {}), description, image, name, price })),
    gallery: gallery
      .filter((image) => [image.image, image.alt].every(hasValue))
      .map(({ alt, image }) => ({ alt, image })),
    reviewScores: reviewScores
      .filter((score) => hasValue(score.label) && hasValue(score.score))
      .map(({ label, score }) => ({ label, score: toNumber(score) })),
    reviews: reviews
      .filter((review) => [review.author, review.initials, review.quote, review.stayed].every(hasValue))
      .map(({ author, initials, quote, stayed }) => ({ author, initials, quote, stayed })),
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
  };
}

export function AdminHotelForm({ copy, initialValues, mode = "create", originalSlug }: AdminHotelFormProps) {
  const [form, setForm] = useState<HotelFormState>(initialValues.form);
  const [amenities, setAmenities] = useState<readonly HotelTextRow[]>(initialValues.amenities);
  const [description, setDescription] = useState<readonly HotelTextRow[]>(initialValues.description);
  const [suites, setSuites] = useState<readonly HotelSuiteRow[]>(initialValues.suites);
  const [gallery, setGallery] = useState<readonly HotelGalleryRow[]>(initialValues.gallery);
  const [reviewScores, setReviewScores] = useState<readonly HotelReviewScoreRow[]>(initialValues.reviewScores);
  const [reviews, setReviews] = useState<readonly HotelReviewRow[]>(initialValues.reviews);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readiness = useMemo(
    () => [
      {
        label: "Essentials",
        ready: [form.name, form.location, form.price].every(hasValue),
      },
      {
        label: "Media",
        ready: [form.listingImage, form.listingAlt, form.heroImage, form.heroAlt].every(hasValue),
      },
      {
        label: "Story",
        ready: description.some((item) => hasValue(item.value)),
      },
      {
        label: "Inventory",
        ready:
          amenities.some((item) => hasValue(item.value)) &&
          suites.some((suite) => [suite.name, suite.price, suite.description].some(hasValue)) &&
          gallery.some((image) => hasValue(image.image) && hasValue(image.alt)),
      },
      {
        label: "Reviews",
        ready:
          [form.scoreLabel, form.scoreSummary].every(hasValue) &&
          reviewScores.some((score) => hasValue(score.label) && hasValue(score.score)) &&
          reviews.some((review) => [review.author, review.initials, review.quote, review.stayed].every(hasValue)),
      },
      {
        label: "Booking",
        ready: [form.bookingCheckIn, form.bookingCheckOut, form.bookingNights, form.bookingRating, form.bookingTotal].every(hasValue),
      },
    ],
    [amenities, description, form, gallery, reviewScores, reviews, suites],
  );

  function updateField<K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) {
    setForm((current) => {
      if (field === "name") {
        return { ...current, name: value, slug: current.slug || slugifyHotelName(String(value)) };
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
    if (!form.price.trim()) {
      nextErrors.price = "Price is required.";
    }
    if (!form.listingImage.trim()) {
      nextErrors.listingImage = "Listing image URL is required.";
    }
    if (!form.listingAlt.trim()) {
      nextErrors.listingAlt = "Listing image alt text is required.";
    }
    if (!form.heroImage.trim()) {
      nextErrors.heroImage = "Hero image URL is required.";
    }
    if (!form.heroAlt.trim()) {
      nextErrors.heroAlt = "Hero image alt text is required.";
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
      const payload = toHotelPayload(form, amenities, description, suites, gallery, reviewScores, reviews);
      if (mode === "update") {
        await updateHotel(originalSlug ?? form.slug, payload);
      } else {
        await createHotel(payload);
      }
      setSaved(true);
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
        <HotelEssentialsSection errors={errors} form={form} updateField={updateField} />
        <HotelMediaSection errors={errors} form={form} updateField={updateField} />
        <HotelStorySection
          description={description}
          error={errors.description}
          setDescription={(items) => updateCollection(setDescription, items)}
        />
        <HotelInventorySection
          amenities={amenities}
          gallery={gallery}
          setAmenities={(items) => updateCollection(setAmenities, items)}
          setGallery={(items) => updateCollection(setGallery, items)}
          setSuites={(items) => updateCollection(setSuites, items)}
          suites={suites}
        />
        <HotelReviewsSection
          form={form}
          reviewScores={reviewScores}
          reviews={reviews}
          setReviewScores={(items) => updateCollection(setReviewScores, items)}
          setReviews={(items) => updateCollection(setReviews, items)}
          updateField={updateField}
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
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">
                {copy.readinessEyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                {completed} of {readiness.length} sections ready
              </h3>
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
            {form.name || "Untitled hotel"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {form.address || form.location || "Add the hotel location and address to preview detail page copy."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <SummaryPill label="Location" value={form.location || "Not set"} />
            <SummaryPill label="Price" value={form.price || "Not set"} />
            <SummaryPill label="Score" value={form.score || "Not set"} />
            <SummaryPill label="Status" value={form.status} />
          </div>
        </CardContent>
      </Card>

      {saved ? (
        <Card aria-live="polite" className="border-none bg-emerald-100 text-emerald-950" role="status">
          <CardContent className="flex gap-3 p-5">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-bold">{copy.successTitle}</p>
              <p className="mt-1 text-sm text-emerald-900/75">{copy.successDescription}</p>
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

function HotelEssentialsSection({
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
          description="Fields that power the hotel listing card, detail route, merchandising badge, and review workflow."
          eyebrow="Essentials"
          title="Core hotel information"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.name} id="hotel-name" label="Hotel name" onChange={(value) => updateField("name", value)} value={form.name} />
          <TextField id="hotel-slug" label="Slug" onChange={(value) => updateField("slug", value)} value={form.slug} />
          <TextField error={errors.location} id="hotel-location" label="Location" onChange={(value) => updateField("location", value)} value={form.location} />
          <TextField error={errors.price} id="hotel-price" label="Price" onChange={(value) => updateField("price", value)} value={form.price} />
          <TextField id="hotel-badge" label="Badge" onChange={(value) => updateField("badge", value)} value={form.badge} />
          <TextField id="hotel-score" label="Score" onChange={(value) => updateField("score", value)} value={form.score} />
          <TextField id="hotel-score-label" label="Score label" onChange={(value) => updateField("scoreLabel", value)} value={form.scoreLabel} />
          <div>
            <Label htmlFor="hotel-status">Commercial status</Label>
            <Select value={form.status} onValueChange={(value) => updateField("status", value as HotelCommercialStatus)}>
              <SelectTrigger id="hotel-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {hotelStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
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
          description="Listing and hero image URLs, accessible alt text, and the public-facing hotel address."
          eyebrow="Media"
          title="Hotel imagery and address"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.listingImage} id="hotel-listing-image" label="Listing image URL" onChange={(value) => updateField("listingImage", value)} value={form.listingImage} />
          <TextField error={errors.listingAlt} id="hotel-listing-alt" label="Listing image alt text" onChange={(value) => updateField("listingAlt", value)} value={form.listingAlt} />
          <TextField error={errors.heroImage} id="hotel-hero-image" label="Hero image URL" onChange={(value) => updateField("heroImage", value)} value={form.heroImage} />
          <TextField error={errors.heroAlt} id="hotel-hero-alt" label="Hero image alt text" onChange={(value) => updateField("heroAlt", value)} value={form.heroAlt} />
        </div>
        <div>
          <Label htmlFor="hotel-address">Address</Label>
          <Textarea id="hotel-address" onChange={(event) => updateField("address", event.target.value)} value={form.address} />
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
  amenities: readonly HotelTextRow[];
  gallery: readonly HotelGalleryRow[];
  setAmenities: (items: readonly HotelTextRow[]) => void;
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
        <TextRowsEditor
          addLabel="Add amenity"
          icon={<ListChecks className="size-4" />}
          label="Amenities"
          onAdd={() => setAmenities([...amenities, createTextRow("amenity")])}
          onRemove={(id) => setAmenities(removeRow(amenities, id))}
          onUpdate={(id, value) => setAmenities(updateTextRow(amenities, id, value))}
          removeLabel="Remove amenity"
          rows={amenities}
          textareaLabel="Amenity"
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

function HotelReviewsSection({
  form,
  reviewScores,
  reviews,
  setReviewScores,
  setReviews,
  updateField,
}: Readonly<{
  form: HotelFormState;
  reviewScores: readonly HotelReviewScoreRow[];
  reviews: readonly HotelReviewRow[];
  setReviewScores: (items: readonly HotelReviewScoreRow[]) => void;
  setReviews: (items: readonly HotelReviewRow[]) => void;
  updateField: <K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Review summary, review score rows, and guest quotes required by the hotel detail page."
          eyebrow="Reviews"
          title="Guest review content"
        />
        <div>
          <Label htmlFor="hotel-score-summary">Score summary</Label>
          <Textarea id="hotel-score-summary" onChange={(event) => updateField("scoreSummary", event.target.value)} value={form.scoreSummary} />
        </div>
        <ReviewScoresEditor
          onAdd={() => setReviewScores([...reviewScores, createEmptyReviewScore(`review-score-${crypto.randomUUID()}`)])}
          onRemove={(id) => setReviewScores(removeRow(reviewScores, id))}
          onUpdate={(id, field, value) => setReviewScores(updateReviewScoreRow(reviewScores, id, field, value))}
          reviewScores={reviewScores}
        />
        <ReviewsEditor
          onAdd={() => setReviews([...reviews, createEmptyReview(`review-${crypto.randomUUID()}`)])}
          onRemove={(id) => setReviews(removeRow(reviews, id))}
          onUpdate={(id, field, value) => setReviews(updateReviewRow(reviews, id, field, value))}
          reviews={reviews}
        />
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

function ReviewScoresEditor({
  onAdd,
  onRemove,
  onUpdate,
  reviewScores,
}: Readonly<{
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof HotelReviewScoreRow>(id: string, field: K, value: HotelReviewScoreRow[K]) => void;
  reviewScores: readonly HotelReviewScoreRow[];
}>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
      <CollectionHeader addLabel="Add review score" icon={<ListChecks className="size-4" />} label="Review scores" onAdd={onAdd} />
      <div className="space-y-4">
        {reviewScores.map((score, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={score.id}>
            <RowHeader disabled={reviewScores.length <= 1} label={`Review score ${index + 1}`} onRemove={() => onRemove(score.id)} removeLabel={`Remove review score ${index + 1}`} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id={`${score.id}-label`} label="Label" onChange={(value) => onUpdate(score.id, "label", value)} value={score.label} />
              <TextField id={`${score.id}-score`} label="Score" onChange={(value) => onUpdate(score.id, "score", value)} value={score.score} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsEditor({
  onAdd,
  onRemove,
  onUpdate,
  reviews,
}: Readonly<{
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: <K extends keyof HotelReviewRow>(id: string, field: K, value: HotelReviewRow[K]) => void;
  reviews: readonly HotelReviewRow[];
}>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
      <CollectionHeader addLabel="Add review" icon={<BadgeCheck className="size-4" />} label="Guest reviews" onAdd={onAdd} />
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={review.id}>
            <RowHeader disabled={reviews.length <= 1} label={`Guest review ${index + 1}`} onRemove={() => onRemove(review.id)} removeLabel={`Remove guest review ${index + 1}`} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id={`${review.id}-author`} label="Author" onChange={(value) => onUpdate(review.id, "author", value)} value={review.author} />
              <TextField id={`${review.id}-initials`} label="Initials" onChange={(value) => onUpdate(review.id, "initials", value)} value={review.initials} />
              <TextField id={`${review.id}-stayed`} label="Stayed" onChange={(value) => onUpdate(review.id, "stayed", value)} value={review.stayed} />
            </div>
            <div className="mt-4">
              <Label htmlFor={`${review.id}-quote`}>Quote</Label>
              <Textarea id={`${review.id}-quote`} onChange={(event) => onUpdate(review.id, "quote", event.target.value)} value={review.quote} />
            </div>
          </div>
        ))}
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
              <TextField id={`${suite.id}-alt`} label="Suite image alt text" onChange={(value) => onUpdate(suite.id, "alt", value)} value={suite.alt} />
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
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
      <CollectionHeader addLabel="Add gallery image" icon={<ImageIcon className="size-4" />} label="Gallery" onAdd={onAdd} />
      <div className="space-y-4">
        {gallery.map((image, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={image.id}>
            <RowHeader
              disabled={gallery.length <= 1}
              label={`Gallery image ${index + 1}`}
              onRemove={() => onRemove(image.id)}
              removeLabel={`Remove gallery image ${index + 1}`}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id={`${image.id}-image`} label="Image URL" onChange={(value) => onUpdate(image.id, "image", value)} value={image.image} />
              <TextField id={`${image.id}-alt`} label="Image alt text" onChange={(value) => onUpdate(image.id, "alt", value)} value={image.alt} />
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
        <span className="flex size-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
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
  label,
  onRemove,
  removeLabel,
}: Readonly<{
  disabled: boolean;
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
    </div>
  );
}
