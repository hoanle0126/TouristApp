"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Handshake,
  MessageSquareQuote,
  Plus,
  Quote,
  Save,
  Trash2,
} from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { AdminTravelMomentsManager } from "@/src/components/admin/AdminTravelMomentsManager";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  createPartner,
  deletePartner,
  updatePartner,
  type SavePartnerInput,
} from "@/src/lib/api/partners";
import {
  createTravelerReview,
  deleteTravelerReview,
  updateTravelerReview,
  type SaveTravelerReviewInput,
} from "@/src/lib/api/traveler-reviews";
import type {
  ApiPartner,
  ApiTravelMoment,
  ApiTravelerReview,
} from "@/src/lib/api/types";

interface AdminFeedbackPageProps {
  readonly initialMoments: readonly ApiTravelMoment[];
  readonly initialPartners: readonly ApiPartner[];
  readonly initialReviews: readonly ApiTravelerReview[];
}

interface ReviewFormState {
  readonly id?: string;
  readonly name: string;
  readonly quote: string;
  readonly role: string;
  readonly sortOrder: string;
  readonly trip: string;
}

interface PartnerFormState {
  readonly description: string;
  readonly id?: string;
  readonly name: string;
  readonly sortOrder: string;
}

function sortReviews(reviews: readonly ApiTravelerReview[]) {
  return [...reviews].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
  );
}

function sortPartners(partners: readonly ApiPartner[]) {
  return [...partners].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
  );
}

function createEmptyReviewForm(nextSortOrder: number): ReviewFormState {
  return {
    name: "",
    quote: "",
    role: "",
    sortOrder: String(nextSortOrder),
    trip: "",
  };
}

function createEmptyPartnerForm(nextSortOrder: number): PartnerFormState {
  return {
    description: "",
    name: "",
    sortOrder: String(nextSortOrder),
  };
}

function toReviewForm(review: ApiTravelerReview): ReviewFormState {
  return {
    id: review.id,
    name: review.name,
    quote: review.quote,
    role: review.role,
    sortOrder: String(review.sortOrder),
    trip: review.trip,
  };
}

function toPartnerForm(partner: ApiPartner): PartnerFormState {
  return {
    description: partner.description,
    id: partner.id,
    name: partner.name,
    sortOrder: String(partner.sortOrder),
  };
}

function toReviewPayload(form: ReviewFormState): SaveTravelerReviewInput {
  return {
    name: form.name.trim(),
    quote: form.quote.trim(),
    role: form.role.trim(),
    sortOrder: Number(form.sortOrder),
    trip: form.trip.trim(),
  };
}

function toPartnerPayload(form: PartnerFormState): SavePartnerInput {
  return {
    description: form.description.trim(),
    name: form.name.trim(),
    sortOrder: Number(form.sortOrder),
  };
}

export default function AdminFeedbackPage({
  initialMoments,
  initialPartners,
  initialReviews,
}: Readonly<AdminFeedbackPageProps>) {
  const [reviews, setReviews] = useState<readonly ApiTravelerReview[]>(
    sortReviews(initialReviews),
  );
  const [partners, setPartners] = useState<readonly ApiPartner[]>(
    sortPartners(initialPartners),
  );
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(
    initialReviews[0]?.id ?? null,
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    initialPartners[0]?.id ?? null,
  );
  const selectedReview =
    reviews.find((review) => review.id === selectedReviewId) ?? null;
  const selectedPartner =
    partners.find((partner) => partner.id === selectedPartnerId) ?? null;

  const nextReviewSortOrder = useMemo(
    () =>
      reviews.length === 0
        ? 10
        : Math.max(...reviews.map((review) => review.sortOrder)) + 10,
    [reviews],
  );
  const nextPartnerSortOrder = useMemo(
    () =>
      partners.length === 0
        ? 10
        : Math.max(...partners.map((partner) => partner.sortOrder)) + 10,
    [partners],
  );

  const [reviewForm, setReviewForm] = useState<ReviewFormState>(
    selectedReview
      ? toReviewForm(selectedReview)
      : createEmptyReviewForm(nextReviewSortOrder),
  );
  const [partnerForm, setPartnerForm] = useState<PartnerFormState>(
    selectedPartner
      ? toPartnerForm(selectedPartner)
      : createEmptyPartnerForm(nextPartnerSortOrder),
  );

  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [isReviewDeleting, setIsReviewDeleting] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [isPartnerSubmitting, setIsPartnerSubmitting] = useState(false);
  const [isPartnerDeleting, setIsPartnerDeleting] = useState(false);
  const [partnerSaved, setPartnerSaved] = useState(false);
  const [partnerError, setPartnerError] = useState<string | null>(null);

  function resetReviewForCreate() {
    setSelectedReviewId(null);
    setReviewForm(createEmptyReviewForm(nextReviewSortOrder));
    setReviewSaved(false);
    setReviewError(null);
  }

  function resetPartnerForCreate() {
    setSelectedPartnerId(null);
    setPartnerForm(createEmptyPartnerForm(nextPartnerSortOrder));
    setPartnerSaved(false);
    setPartnerError(null);
  }

  function selectReview(review: ApiTravelerReview) {
    setSelectedReviewId(review.id);
    setReviewForm(toReviewForm(review));
    setReviewSaved(false);
    setReviewError(null);
  }

  function selectPartner(partner: ApiPartner) {
    setSelectedPartnerId(partner.id);
    setPartnerForm(toPartnerForm(partner));
    setPartnerSaved(false);
    setPartnerError(null);
  }

  function updateReviewField<K extends keyof ReviewFormState>(
    field: K,
    value: ReviewFormState[K],
  ) {
    setReviewForm((current) => ({ ...current, [field]: value }));
    setReviewSaved(false);
  }

  function updatePartnerField<K extends keyof PartnerFormState>(
    field: K,
    value: PartnerFormState[K],
  ) {
    setPartnerForm((current) => ({ ...current, [field]: value }));
    setPartnerSaved(false);
  }

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewError(null);
    setReviewSaved(false);
    setIsReviewSubmitting(true);

    try {
      const payload = toReviewPayload(reviewForm);
      const response = reviewForm.id
        ? await updateTravelerReview(reviewForm.id, payload)
        : await createTravelerReview(payload);
      const nextReviews = reviewForm.id
        ? reviews.map((review) =>
            review.id === reviewForm.id ? response : review,
          )
        : [...reviews, response];

      setReviews(sortReviews(nextReviews));
      setSelectedReviewId(response.id);
      setReviewForm(toReviewForm(response));
      setReviewSaved(true);
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "Unable to save traveler review.",
      );
    } finally {
      setIsReviewSubmitting(false);
    }
  }

  async function handlePartnerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPartnerError(null);
    setPartnerSaved(false);
    setIsPartnerSubmitting(true);

    try {
      const payload = toPartnerPayload(partnerForm);
      const response = partnerForm.id
        ? await updatePartner(partnerForm.id, payload)
        : await createPartner(payload);
      const nextPartners = partnerForm.id
        ? partners.map((partner) =>
            partner.id === partnerForm.id ? response : partner,
          )
        : [...partners, response];

      setPartners(sortPartners(nextPartners));
      setSelectedPartnerId(response.id);
      setPartnerForm(toPartnerForm(response));
      setPartnerSaved(true);
    } catch (error) {
      setPartnerError(
        error instanceof Error ? error.message : "Unable to save partner.",
      );
    } finally {
      setIsPartnerSubmitting(false);
    }
  }

  async function handleReviewDelete() {
    if (!reviewForm.id) {
      resetReviewForCreate();
      return;
    }

    setReviewError(null);
    setReviewSaved(false);
    setIsReviewDeleting(true);
    try {
      await deleteTravelerReview(reviewForm.id);
      const remaining = reviews.filter((review) => review.id !== reviewForm.id);
      setReviews(remaining);
      if (remaining[0]) {
        setSelectedReviewId(remaining[0].id);
        setReviewForm(toReviewForm(remaining[0]));
      } else {
        setSelectedReviewId(null);
        setReviewForm(createEmptyReviewForm(10));
      }
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "Unable to delete traveler review.",
      );
    } finally {
      setIsReviewDeleting(false);
    }
  }

  async function handlePartnerDelete() {
    if (!partnerForm.id) {
      resetPartnerForCreate();
      return;
    }

    setPartnerError(null);
    setPartnerSaved(false);
    setIsPartnerDeleting(true);
    try {
      await deletePartner(partnerForm.id);
      const remaining = partners.filter(
        (partner) => partner.id !== partnerForm.id,
      );
      setPartners(remaining);
      if (remaining[0]) {
        setSelectedPartnerId(remaining[0].id);
        setPartnerForm(toPartnerForm(remaining[0]));
      } else {
        setSelectedPartnerId(null);
        setPartnerForm(createEmptyPartnerForm(10));
      }
    } catch (error) {
      setPartnerError(
        error instanceof Error ? error.message : "Unable to delete partner.",
      );
    } finally {
      setIsPartnerDeleting(false);
    }
  }

  return (
    <AdminShell
      activePath="/admin/feedback"
      dateLabel="Saturday, May 16, 2026"
      pageTitle="Feedback"
      searchPlaceholder="Search traveler, quote, partner..."
      sectionLabel="Manage the testimonial cards and partner badges shown in the public feedback section."
      teamValue="sales"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {[
          {
            label: "Published reviews",
            note: "Traveler proof points live on homepage",
            value: `${reviews.length}`,
          },
          {
            label: "Trusted partners",
            note: "Operational and merchandising network",
            value: `${partners.length}`,
          },
          {
            label: "Distinct itineraries",
            note: "Review trip labels currently in rotation",
            value: `${new Set(reviews.map((review) => review.trip)).size}`,
          },
          {
            label: "Partner categories",
            note: "Distinct positioning labels under each partner",
            value: `${new Set(partners.map((partner) => partner.description)).size}`,
          },
        ].map((item) => (
          <Card className="border-none bg-white" key={item.label}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-stone-500">{item.label}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight text-stone-950">
                {item.value}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-800">
                {item.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_520px]">
        <Card>
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Traveler reviews
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Homepage testimonial order
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={resetReviewForCreate} size="sm" type="button">
                  <Plus className="size-4" />
                  Add review
                </Button>
                <Quote className="size-5 text-red-800" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {reviews.map((review) => {
                const active = review.id === selectedReviewId;

                return (
                  <button
                    className={
                      active
                        ? "w-full rounded-2xl border border-red-300 bg-red-50 p-4 text-left"
                        : "w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left transition-colors hover:border-stone-300 hover:bg-white"
                    }
                    key={review.id}
                    onClick={() => selectReview(review)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-800">
                          {review.trip}
                        </p>
                        <p className="mt-2 text-lg font-bold tracking-tight text-stone-950">
                          {review.name}
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          {review.role}
                        </p>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">
                          {review.quote}
                        </p>
                      </div>
                      <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {review.sortOrder}
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  {reviewForm.id ? "Edit review" : "New review"}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {reviewForm.id
                    ? "Update testimonial card"
                    : "Create testimonial card"}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={resetReviewForCreate}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Plus className="size-4" />
                  Add review
                </Button>
                <Button
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  disabled={isReviewDeleting}
                  onClick={handleReviewDelete}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="size-4" />
                  {reviewForm.id ? "Delete review" : "Reset form"}
                </Button>
                <MessageSquareQuote className="size-5 text-red-800" />
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleReviewSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="review-name">Traveler name</Label>
                  <Input
                    id="review-name"
                    onChange={(event) =>
                      updateReviewField("name", event.target.value)
                    }
                    value={reviewForm.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-role">Role or city</Label>
                  <Input
                    id="review-role"
                    onChange={(event) =>
                      updateReviewField("role", event.target.value)
                    }
                    value={reviewForm.role}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="review-trip">Trip label</Label>
                  <Input
                    id="review-trip"
                    onChange={(event) =>
                      updateReviewField("trip", event.target.value)
                    }
                    value={reviewForm.trip}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review-sort-order">Sort order</Label>
                  <Input
                    id="review-sort-order"
                    inputMode="numeric"
                    onChange={(event) =>
                      updateReviewField("sortOrder", event.target.value)
                    }
                    value={reviewForm.sortOrder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-quote">Quote</Label>
                <Textarea
                  id="review-quote"
                  onChange={(event) =>
                    updateReviewField("quote", event.target.value)
                  }
                  rows={5}
                  value={reviewForm.quote}
                />
              </div>

              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Live preview
                </p>
                <p className="mt-4 text-lg font-medium leading-8 tracking-tight text-stone-800">
                  {reviewForm.quote
                    ? `“${reviewForm.quote}”`
                    : "Add a quote to preview the homepage testimonial card."}
                </p>
                <div className="mt-5 border-t border-stone-200 pt-4">
                  <p className="font-black text-stone-950">
                    {reviewForm.name || "Traveler name"}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {reviewForm.role || "Role or location"}
                  </p>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-800">
                    {reviewForm.trip || "Trip label"}
                  </p>
                </div>
              </div>

              {reviewSaved ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
                  Traveler review saved.
                </p>
              ) : null}
              {reviewError ? (
                <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
                  {reviewError}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 pt-5">
                <Button disabled={isReviewSubmitting} type="submit">
                  <Save className="size-4" />
                  {isReviewSubmitting
                    ? "Saving..."
                    : reviewForm.id
                      ? "Save changes"
                      : "Create review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <AdminTravelMomentsManager initialMoments={initialMoments} />

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_480px]">
        <Card>
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Partner network
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  Trusted partner order
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={resetPartnerForCreate} size="sm" type="button">
                  <Plus className="size-4" />
                  Add partner
                </Button>
                <Handshake className="size-5 text-red-800" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {partners.map((partner) => {
                const active = partner.id === selectedPartnerId;

                return (
                  <button
                    className={
                      active
                        ? "w-full rounded-2xl border border-red-300 bg-red-50 p-4 text-left"
                        : "w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left transition-colors hover:border-stone-300 hover:bg-white"
                    }
                    key={partner.id}
                    onClick={() => selectPartner(partner)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight text-stone-950">
                          {partner.name}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                          {partner.description}
                        </p>
                      </div>
                      <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {partner.sortOrder}
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
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  {partnerForm.id ? "Edit partner" : "New partner"}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {partnerForm.id
                    ? "Update network card"
                    : "Create network card"}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={resetPartnerForCreate}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Plus className="size-4" />
                  Add partner
                </Button>
                <Button
                  className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  disabled={isPartnerDeleting}
                  onClick={handlePartnerDelete}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="size-4" />
                  {partnerForm.id ? "Delete partner" : "Reset form"}
                </Button>
                <Handshake className="size-5 text-red-800" />
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handlePartnerSubmit}>
              <div className="space-y-2">
                <Label htmlFor="partner-name">Partner name</Label>
                <Input
                  id="partner-name"
                  onChange={(event) =>
                    updatePartnerField("name", event.target.value)
                  }
                  value={partnerForm.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-description">Description</Label>
                <Input
                  id="partner-description"
                  onChange={(event) =>
                    updatePartnerField("description", event.target.value)
                  }
                  value={partnerForm.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-sort-order">Sort order</Label>
                <Input
                  id="partner-sort-order"
                  inputMode="numeric"
                  onChange={(event) =>
                    updatePartnerField("sortOrder", event.target.value)
                  }
                  value={partnerForm.sortOrder}
                />
              </div>

              <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-800">
                  Homepage pill preview
                </p>
                <p className="mt-4 text-sm font-black uppercase tracking-tight text-stone-950">
                  {partnerForm.name || "Partner name"}
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  {partnerForm.description ||
                    "Add a short category line for the partner card."}
                </p>
              </div>

              {partnerSaved ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
                  Partner saved.
                </p>
              ) : null}
              {partnerError ? (
                <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
                  {partnerError}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 pt-5">
                <Button disabled={isPartnerSubmitting} type="submit">
                  <Save className="size-4" />
                  {isPartnerSubmitting
                    ? "Saving..."
                    : partnerForm.id
                      ? "Save changes"
                      : "Create partner"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AdminShell>
  );
}
