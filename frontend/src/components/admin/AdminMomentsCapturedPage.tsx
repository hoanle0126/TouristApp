"use client";

import { FormEvent, useMemo, useState } from "react";
import { Camera, ImagePlus, Plus, Save, Trash2 } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  createMomentCaptured,
  deleteMomentCaptured,
  updateMomentCaptured,
  type SaveMomentCapturedInput,
} from "@/src/lib/api/moments-captured";
import type { VisualDiaryItem } from "@/src/types/travel";

interface AdminMomentsCapturedPageProps {
  readonly initialMoments: readonly VisualDiaryItem[];
}

interface MomentFormState {
  readonly alt: string;
  readonly country: string;
  readonly id?: string;
  readonly image: string;
  readonly sortOrder: string;
  readonly title: string;
  readonly wide: boolean;
}

function createEmptyFormState(nextSortOrder: number): MomentFormState {
  return {
    alt: "",
    country: "",
    image: "",
    sortOrder: String(nextSortOrder),
    title: "",
    wide: false,
  };
}

function toFormState(moment: VisualDiaryItem): MomentFormState {
  return {
    alt: moment.alt,
    country: moment.country,
    id: moment.id,
    image: moment.image,
    sortOrder: String(moment.sortOrder ?? 0),
    title: moment.title,
    wide: Boolean(moment.wide),
  };
}

function toPayload(form: MomentFormState): SaveMomentCapturedInput {
  return {
    alt: form.alt.trim(),
    country: form.country.trim(),
    image: form.image.trim(),
    sortOrder: Number(form.sortOrder),
    title: form.title.trim(),
    wide: form.wide,
  };
}

function toMomentItem(moment: {
  alt: string;
  country: string;
  id: string;
  image: string;
  sortOrder: number;
  title: string;
  wide: boolean;
}): VisualDiaryItem {
  return {
    alt: moment.alt,
    country: moment.country,
    id: moment.id,
    image: moment.image,
    sortOrder: moment.sortOrder,
    title: moment.title,
    wide: moment.wide,
  };
}

export default function AdminMomentsCapturedPage({
  initialMoments,
}: Readonly<AdminMomentsCapturedPageProps>) {
  const [moments, setMoments] = useState<readonly VisualDiaryItem[]>(initialMoments);
  const [selectedId, setSelectedId] = useState<string | null>(initialMoments[0]?.id ?? null);
  const selectedMoment = moments.find((moment) => moment.id === selectedId) ?? null;
  const nextSortOrder = useMemo(
    () =>
      moments.length === 0
        ? 10
        : Math.max(...moments.map((moment) => moment.sortOrder ?? 0)) + 10,
    [moments],
  );
  const [form, setForm] = useState<MomentFormState>(
    selectedMoment ? toFormState(selectedMoment) : createEmptyFormState(nextSortOrder),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function resetForCreate() {
    setSelectedId(null);
    setForm(createEmptyFormState(nextSortOrder));
    setSaved(false);
    setSubmitError(null);
  }

  function selectMoment(moment: VisualDiaryItem) {
    setSelectedId(moment.id ?? null);
    setForm(toFormState(moment));
    setSaved(false);
    setSubmitError(null);
  }

  function updateField<K extends keyof MomentFormState>(field: K, value: MomentFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSaved(false);
    setIsSubmitting(true);

    try {
      const payload = toPayload(form);
      const response = form.id
        ? await updateMomentCaptured(form.id, payload)
        : await createMomentCaptured(payload);
      const nextMoment = toMomentItem(response);
      const nextMoments = form.id
        ? moments.map((moment) => (moment.id === form.id ? nextMoment : moment))
        : [...moments, nextMoment];
      const sortedMoments = [...nextMoments].sort(
        (left, right) =>
          (left.sortOrder ?? 0) - (right.sortOrder ?? 0) ||
          left.title.localeCompare(right.title),
      );

      setMoments(sortedMoments);
      setSelectedId(nextMoment.id ?? null);
      setForm(toFormState(nextMoment));
      setSaved(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save moment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!form.id) {
      resetForCreate();
      return;
    }

    setSubmitError(null);
    setSaved(false);
    setIsDeleting(true);
    try {
      await deleteMomentCaptured(form.id);
      const remainingMoments = moments.filter((moment) => moment.id !== form.id);
      setMoments(remainingMoments);
      if (remainingMoments[0]) {
        setSelectedId(remainingMoments[0].id ?? null);
        setForm(toFormState(remainingMoments[0]));
      } else {
        setSelectedId(null);
        setForm(createEmptyFormState(10));
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to delete moment.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminShell
      activePath="/admin/moments-captured"
      action={
        <Button onClick={resetForCreate} type="button">
          <Plus className="size-4" />
          Add moment
        </Button>
      }
      dateLabel="Thursday, May 7, 2026"
      pageTitle="Moments Captured"
      searchPlaceholder="Search title, country, image..."
      sectionLabel="Manage the visual diary cards shown on the public landing page."
      teamValue="sales"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Published moments", note: "Visible on homepage carousel", value: `${moments.length}` },
          {
            label: "Wide layouts",
            note: "Feature cards with expanded width",
            value: `${moments.filter((moment) => moment.wide).length}`,
          },
          {
            label: "Countries covered",
            note: "Distinct regions in current diary",
            value: `${new Set(moments.map((moment) => moment.country)).size}`,
          },
        ].map((item) => (
          <Card className="border-none bg-white" key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-stone-500">{item.label}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight text-stone-950">{item.value}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_480px]">
        <Card>
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
                  Visual diary
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Homepage carousel order
                </h3>
              </div>
              <Camera className="size-5 text-emerald-800" />
            </div>

            <div className="mt-6 space-y-3">
              {moments.map((moment) => {
                const active = moment.id === selectedId;

                return (
                  <button
                    className={
                      active
                        ? "w-full rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-left"
                        : "w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left transition-colors hover:border-stone-300 hover:bg-white"
                    }
                    key={moment.id ?? moment.title}
                    onClick={() => selectMoment(moment)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">
                          {moment.country}
                        </p>
                        <p className="mt-2 text-lg font-bold tracking-tight text-stone-950">
                          {moment.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                          Order {moment.sortOrder ?? 0} · {moment.wide ? "Wide card" : "Standard card"}
                        </p>
                      </div>
                      <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {moment.wide ? "Wide" : "Standard"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white">
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
                  {form.id ? "Edit moment" : "New moment"}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {form.id ? "Update carousel card" : "Create carousel card"}
                </h3>
              </div>
              <ImagePlus className="size-5 text-emerald-800" />
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="moment-title">Title</Label>
                  <Input
                    id="moment-title"
                    onChange={(event) => updateField("title", event.target.value)}
                    value={form.title}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moment-country">Country</Label>
                  <Input
                    id="moment-country"
                    onChange={(event) => updateField("country", event.target.value)}
                    value={form.country}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="moment-image">Image URL</Label>
                <Input
                  id="moment-image"
                  onChange={(event) => updateField("image", event.target.value)}
                  value={form.image}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moment-alt">Alt text</Label>
                <Input
                  id="moment-alt"
                  onChange={(event) => updateField("alt", event.target.value)}
                  value={form.alt}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="moment-sort-order">Sort order</Label>
                  <Input
                    id="moment-sort-order"
                    min="0"
                    onChange={(event) => updateField("sortOrder", event.target.value)}
                    type="number"
                    value={form.sortOrder}
                  />
                </div>
                <label className="flex items-center gap-3 self-end rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
                  <input
                    checked={form.wide}
                    className="size-4 rounded border-stone-400 accent-emerald-800"
                    onChange={(event) => updateField("wide", event.target.checked)}
                    type="checkbox"
                  />
                  Render as wide card
                </label>
              </div>

              {submitError ? (
                <p className="text-sm font-semibold text-rose-700">{submitError}</p>
              ) : null}
              {saved ? (
                <p className="text-sm font-semibold text-emerald-800">
                  Moment saved successfully.
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Button disabled={isSubmitting} type="submit">
                  <Save className="size-4" />
                  {isSubmitting ? "Saving..." : form.id ? "Save changes" : "Create moment"}
                </Button>
                <Button onClick={resetForCreate} type="button" variant="outline">
                  <Plus className="size-4" />
                  New draft
                </Button>
                {form.id ? (
                  <Button
                    className="text-rose-700 hover:text-rose-800"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="size-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AdminShell>
  );
}
