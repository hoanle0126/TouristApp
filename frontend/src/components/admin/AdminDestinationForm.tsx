"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, CircleAlert, Hotel, ImageIcon, MapPinned, Plus, Save, Sparkles, Trash2 } from "lucide-react";

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
  destinationStatusOptions,
  slugifyDestinationTitle,
  type DestinationCommercialStatus,
  type DestinationFormInitialValues,
  type DestinationFormState,
  type DestinationTextRow,
} from "@/src/components/admin/adminDestinationFormData";

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

interface FormErrors {
  title?: string;
  price?: string;
  rating?: string;
  cardImage?: string;
  heroImage?: string;
  shortDescription?: string;
}

function hasValue(value: string) {
  return value.trim().length > 0;
}

function updateRow(items: readonly DestinationTextRow[], id: string, value: string) {
  return items.map((item) => (item.id === id ? { ...item, value } : item));
}

function removeRow(items: readonly DestinationTextRow[], id: string) {
  return items.length > 1 ? items.filter((item) => item.id !== id) : items;
}

function createRow(prefix: string): DestinationTextRow {
  return { id: `${prefix}-${crypto.randomUUID()}`, value: "" };
}

export function AdminDestinationForm({ copy, initialValues }: AdminDestinationFormProps) {
  const [form, setForm] = useState<DestinationFormState>(initialValues.form);
  const [intro, setIntro] = useState<readonly DestinationTextRow[]>(initialValues.intro);
  const [spotlight, setSpotlight] = useState<readonly DestinationTextRow[]>(initialValues.spotlight);
  const [relatedTours, setRelatedTours] = useState<readonly DestinationTextRow[]>(initialValues.relatedTours);
  const [relatedHotels, setRelatedHotels] = useState<readonly DestinationTextRow[]>(initialValues.relatedHotels);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  const readiness = useMemo(
    () => [
      {
        label: "Essentials",
        ready: [form.title, form.price, form.rating, form.shortDescription].every(hasValue),
      },
      {
        label: "Media",
        ready: hasValue(form.cardImage) && hasValue(form.heroImage),
      },
      {
        label: "Story",
        ready: hasValue(form.summary) && intro.some((item) => hasValue(item.value)) && spotlight.some((item) => hasValue(item.value)),
      },
      {
        label: "Connections",
        ready: relatedTours.some((item) => hasValue(item.value)) || relatedHotels.some((item) => hasValue(item.value)),
      },
    ],
    [form, intro, relatedHotels, relatedTours, spotlight],
  );

  function updateField<K extends keyof DestinationFormState>(field: K, value: DestinationFormState[K]) {
    setForm((current) => {
      if (field === "title") {
        return { ...current, title: value, slug: current.slug || slugifyDestinationTitle(String(value)) };
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
    if (!form.price.trim()) {
      nextErrors.price = "Price is required.";
    }
    if (!form.rating.trim()) {
      nextErrors.rating = "Rating is required.";
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

  function updateRows(setRows: (items: readonly DestinationTextRow[]) => void, items: readonly DestinationTextRow[]) {
    setRows(items);
    setSaved(false);
  }

  return (
    <form className="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_420px]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <DestinationEssentialsSection errors={errors} form={form} updateField={updateField} />
        <DestinationMediaSection errors={errors} form={form} updateField={updateField} />
        <DestinationStorySection
          form={form}
          intro={intro}
          setIntro={(items) => updateRows(setIntro, items)}
          setSpotlight={(items) => updateRows(setSpotlight, items)}
          spotlight={spotlight}
          updateField={updateField}
        />
        <DestinationRelatedSection
          relatedHotels={relatedHotels}
          relatedTours={relatedTours}
          setRelatedHotels={(items) => updateRows(setRelatedHotels, items)}
          setRelatedTours={(items) => updateRows(setRelatedTours, items)}
        />
      </div>

      <DestinationDraftSidebar copy={copy} form={form} readiness={readiness} saved={saved} />
    </form>
  );
}

function DestinationDraftSidebar({
  copy,
  form,
  readiness,
  saved,
}: Readonly<{
  copy: AdminDestinationFormCopy;
  form: DestinationFormState;
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
            {form.title || "Untitled destination"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            {form.shortDescription || "Add a short description to preview the destination card copy."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <SummaryPill label="Market" value={form.market || "Not set"} />
            <SummaryPill label="Price" value={form.price || "Not set"} />
            <SummaryPill label="Rating" value={form.rating || "Not set"} />
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

function DestinationEssentialsSection({
  errors,
  form,
  updateField,
}: Readonly<{
  errors: FormErrors;
  form: DestinationFormState;
  updateField: <K extends keyof DestinationFormState>(field: K, value: DestinationFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Fields that power the destination card, detail hero, and merchandising status."
          eyebrow="Essentials"
          title="Core destination information"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.title} id="destination-title" label="Title" onChange={(value) => updateField("title", value)} value={form.title} />
          <TextField id="destination-slug" label="Slug" onChange={(value) => updateField("slug", value)} value={form.slug} />
          <TextField id="destination-market" label="Market / region" onChange={(value) => updateField("market", value)} value={form.market} />
          <TextField error={errors.price} id="destination-price" label="Price" onChange={(value) => updateField("price", value)} value={form.price} />
          <TextField error={errors.rating} id="destination-rating" label="Rating" onChange={(value) => updateField("rating", value)} value={form.rating} />
          <div>
            <Label htmlFor="destination-status">Commercial status</Label>
            <Select value={form.status} onValueChange={(value: DestinationCommercialStatus) => updateField("status", value)}>
              <SelectTrigger id="destination-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {destinationStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="destination-short-description">Short description</Label>
          <Textarea
            aria-describedby={errors.shortDescription ? "destination-short-description-error" : undefined}
            aria-invalid={Boolean(errors.shortDescription)}
            id="destination-short-description"
            onChange={(event) => updateField("shortDescription", event.target.value)}
            value={form.shortDescription}
          />
          <FieldError id="destination-short-description-error" message={errors.shortDescription} />
        </div>
      </CardContent>
    </Card>
  );
}

function DestinationMediaSection({
  errors,
  form,
  updateField,
}: Readonly<{
  errors: FormErrors;
  form: DestinationFormState;
  updateField: <K extends keyof DestinationFormState>(field: K, value: DestinationFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Image URLs and alt text for the listing card and destination hero."
          eyebrow="Media"
          title="Destination imagery"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField error={errors.cardImage} id="destination-card-image" label="Card image URL" onChange={(value) => updateField("cardImage", value)} value={form.cardImage} />
          <TextField id="destination-card-alt" label="Card image alt text" onChange={(value) => updateField("cardAlt", value)} value={form.cardAlt} />
          <TextField error={errors.heroImage} id="destination-hero-image" label="Hero image URL" onChange={(value) => updateField("heroImage", value)} value={form.heroImage} />
          <TextField id="destination-hero-alt" label="Hero image alt text" onChange={(value) => updateField("heroAlt", value)} value={form.heroAlt} />
        </div>
      </CardContent>
    </Card>
  );
}

function DestinationStorySection({
  form,
  intro,
  setIntro,
  setSpotlight,
  spotlight,
  updateField,
}: Readonly<{
  form: DestinationFormState;
  intro: readonly DestinationTextRow[];
  setIntro: (items: readonly DestinationTextRow[]) => void;
  setSpotlight: (items: readonly DestinationTextRow[]) => void;
  spotlight: readonly DestinationTextRow[];
  updateField: <K extends keyof DestinationFormState>(field: K, value: DestinationFormState[K]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Editorial content used on the destination detail page."
          eyebrow="Story"
          title="Intro, summary, and spotlight"
        />
        <div>
          <Label htmlFor="destination-summary">Summary</Label>
          <Textarea id="destination-summary" onChange={(event) => updateField("summary", event.target.value)} value={form.summary} />
        </div>

        <TextRowsEditor
          addLabel="Add intro paragraph"
          icon={<MapPinned className="size-4" />}
          label="Intro paragraphs"
          onAdd={() => setIntro([...intro, createRow("intro")])}
          onRemove={(id) => setIntro(removeRow(intro, id))}
          onUpdate={(id, value) => setIntro(updateRow(intro, id, value))}
          removeLabel="Remove intro paragraph"
          rows={intro}
          textareaLabel="Paragraph"
        />

        <TextRowsEditor
          addLabel="Add spotlight point"
          icon={<Sparkles className="size-4" />}
          label="Spotlight points"
          onAdd={() => setSpotlight([...spotlight, createRow("spotlight")])}
          onRemove={(id) => setSpotlight(removeRow(spotlight, id))}
          onUpdate={(id, value) => setSpotlight(updateRow(spotlight, id, value))}
          removeLabel="Remove spotlight point"
          rows={spotlight}
          textareaLabel="Point"
        />
      </CardContent>
    </Card>
  );
}

function DestinationRelatedSection({
  relatedHotels,
  relatedTours,
  setRelatedHotels,
  setRelatedTours,
}: Readonly<{
  relatedHotels: readonly DestinationTextRow[];
  relatedTours: readonly DestinationTextRow[];
  setRelatedHotels: (items: readonly DestinationTextRow[]) => void;
  setRelatedTours: (items: readonly DestinationTextRow[]) => void;
}>) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6 sm:p-7">
        <SectionHeader
          description="Attach suggested tours and hotels that should appear around this destination."
          eyebrow="Related inventory"
          title="Tours and hotels"
        />
        <TextRowsEditor
          addLabel="Add related tour"
          icon={<ImageIcon className="size-4" />}
          label="Related tours"
          onAdd={() => setRelatedTours([...relatedTours, createRow("related-tour")])}
          onRemove={(id) => setRelatedTours(removeRow(relatedTours, id))}
          onUpdate={(id, value) => setRelatedTours(updateRow(relatedTours, id, value))}
          removeLabel="Remove related tour"
          rows={relatedTours}
          textareaLabel="Tour title"
        />
        <TextRowsEditor
          addLabel="Add related hotel"
          icon={<Hotel className="size-4" />}
          label="Related hotels"
          onAdd={() => setRelatedHotels([...relatedHotels, createRow("related-hotel")])}
          onRemove={(id) => setRelatedHotels(removeRow(relatedHotels, id))}
          onUpdate={(id, value) => setRelatedHotels(updateRow(relatedHotels, id, value))}
          removeLabel="Remove related hotel"
          rows={relatedHotels}
          textareaLabel="Hotel title"
        />
      </CardContent>
    </Card>
  );
}

function TextRowsEditor({
  addLabel,
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
  icon: ReactNode;
  label: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, value: string) => void;
  removeLabel: string;
  rows: readonly DestinationTextRow[];
  textareaLabel: string;
}>) {
  return (
    <div className="space-y-4 border-t border-stone-200 pt-5">
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
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4" key={row.id}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-stone-950">{label} {index + 1}</p>
              <Button
                aria-label={`${removeLabel} ${index + 1}`}
                disabled={rows.length <= 1}
                onClick={() => onRemove(row.id)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <Label htmlFor={`${row.id}-value`}>{textareaLabel}</Label>
            <Textarea id={`${row.id}-value`} onChange={(event) => onUpdate(row.id, event.target.value)} value={row.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
