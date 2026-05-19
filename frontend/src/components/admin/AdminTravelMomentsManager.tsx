"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { Camera, ImageIcon, Plus, Save, Trash2 } from "lucide-react";

import { ImageUploadInput } from "@/src/components/admin/ImageUploadInput";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  createTravelMoment,
  deleteTravelMoment,
  updateTravelMoment,
  type SaveTravelMomentInput,
} from "@/src/lib/api/travel-moments";
import type { ApiTravelMoment } from "@/src/lib/api/types";

interface MomentFormState {
  readonly id?: string;
  readonly image: string;
  readonly alt: string;
  readonly caption: string;
  readonly sortOrder: string;
}

function sortMoments(moments: readonly ApiTravelMoment[]) {
  return [...moments].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder || left.alt.localeCompare(right.alt),
  );
}

function createEmptyMomentForm(nextSortOrder: number): MomentFormState {
  return {
    alt: "",
    caption: "",
    image: "",
    sortOrder: String(nextSortOrder),
  };
}

function toMomentForm(moment: ApiTravelMoment): MomentFormState {
  return {
    alt: moment.alt,
    caption: moment.caption ?? "",
    id: moment.id,
    image: moment.image,
    sortOrder: String(moment.sortOrder),
  };
}

function toMomentPayload(form: MomentFormState): SaveTravelMomentInput {
  return {
    alt: form.alt.trim(),
    caption: form.caption.trim() || undefined,
    image: form.image.trim(),
    sortOrder: Number(form.sortOrder),
  };
}

export function AdminTravelMomentsManager({
  initialMoments,
}: Readonly<{ initialMoments: readonly ApiTravelMoment[] }>) {
  const [moments, setMoments] = useState<readonly ApiTravelMoment[]>(
    sortMoments(initialMoments),
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMoments[0]?.id ?? null,
  );

  const selected = moments.find((moment) => moment.id === selectedId) ?? null;
  const nextSortOrder = useMemo(
    () =>
      moments.length === 0
        ? 10
        : Math.max(...moments.map((moment) => moment.sortOrder)) + 10,
    [moments],
  );

  const [form, setForm] = useState<MomentFormState>(
    selected ? toMomentForm(selected) : createEmptyMomentForm(nextSortOrder),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForCreate() {
    setSelectedId(null);
    setForm(createEmptyMomentForm(nextSortOrder));
    setSaved(false);
    setError(null);
  }

  function selectMoment(moment: ApiTravelMoment) {
    setSelectedId(moment.id);
    setForm(toMomentForm(moment));
    setSaved(false);
    setError(null);
  }

  function updateField<K extends keyof MomentFormState>(
    field: K,
    value: MomentFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSubmitting(true);

    try {
      const payload = toMomentPayload(form);
      if (!payload.image) {
        throw new Error("Please upload an image first.");
      }

      const response = form.id
        ? await updateTravelMoment(form.id, payload)
        : await createTravelMoment(payload);

      const next = form.id
        ? moments.map((moment) =>
            moment.id === form.id ? response : moment,
          )
        : [...moments, response];

      setMoments(sortMoments(next));
      setSelectedId(response.id);
      setForm(toMomentForm(response));
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save travel moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!form.id) {
      resetForCreate();
      return;
    }

    setError(null);
    setSaved(false);
    setIsDeleting(true);

    try {
      await deleteTravelMoment(form.id);
      const remaining = moments.filter((moment) => moment.id !== form.id);
      setMoments(remaining);
      if (remaining[0]) {
        setSelectedId(remaining[0].id);
        setForm(toMomentForm(remaining[0]));
      } else {
        setSelectedId(null);
        setForm(createEmptyMomentForm(10));
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to delete travel moment.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_520px]">
      <Card>
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                Travel moments
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                Carousel below testimonials
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={resetForCreate} size="sm" type="button">
                <Plus className="size-4" />
                Add moment
              </Button>
              <Camera className="size-5 text-red-800" />
            </div>
          </div>

          {moments.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
              <ImageIcon className="mx-auto mb-3 size-8 text-stone-400" />
              <p className="text-sm font-medium text-stone-600">
                No travel moments yet. Add the first photo to populate the
                homepage carousel.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {moments.map((moment) => {
                const active = moment.id === selectedId;

                return (
                  <button
                    className={
                      active
                        ? "group overflow-hidden rounded-2xl border border-red-300 bg-red-50 text-left"
                        : "group overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 text-left transition-colors hover:border-stone-300 hover:bg-white"
                    }
                    key={moment.id}
                    onClick={() => selectMoment(moment)}
                    type="button"
                  >
                    <div className="relative aspect-[4/3] w-full bg-stone-200">
                      <Image
                        alt={moment.alt}
                        className="object-cover"
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        src={moment.image}
                      />
                    </div>
                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-stone-950">
                          {moment.alt}
                        </p>
                        {moment.caption ? (
                          <p className="mt-1 line-clamp-2 text-xs text-stone-500">
                            {moment.caption}
                          </p>
                        ) : null}
                      </div>
                      <span className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {moment.sortOrder}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none bg-white">
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                {form.id ? "Edit moment" : "New moment"}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                {form.id ? "Update photo card" : "Add carousel photo"}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={resetForCreate}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="size-4" />
                Add moment
              </Button>
              <Button
                className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                disabled={isDeleting}
                onClick={handleDelete}
                size="sm"
                type="button"
                variant="outline"
              >
                <Trash2 className="size-4" />
                {form.id ? "Delete moment" : "Reset form"}
              </Button>
              <ImageIcon className="size-5 text-red-800" />
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <ImageUploadInput
              id="moment-image"
              label="Photo"
              onChange={(value) => updateField("image", value)}
              value={form.image}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="moment-alt">Alt text</Label>
                <Input
                  id="moment-alt"
                  onChange={(event) => updateField("alt", event.target.value)}
                  placeholder="Group photo at Ba Na Hills"
                  value={form.alt}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moment-sort-order">Sort order</Label>
                <Input
                  id="moment-sort-order"
                  inputMode="numeric"
                  onChange={(event) =>
                    updateField("sortOrder", event.target.value)
                  }
                  value={form.sortOrder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moment-caption">Caption (optional)</Label>
              <Input
                id="moment-caption"
                onChange={(event) =>
                  updateField("caption", event.target.value)
                }
                placeholder="Hue - Quang Tri - Quang Binh 2025"
                value={form.caption}
              />
            </div>

            {saved ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
                Travel moment saved.
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 pt-5">
              <Button disabled={isSubmitting} type="submit">
                <Save className="size-4" />
                {isSubmitting
                  ? "Saving..."
                  : form.id
                    ? "Save changes"
                    : "Create moment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
