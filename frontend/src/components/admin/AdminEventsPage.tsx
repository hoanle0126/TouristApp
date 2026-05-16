"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, ImagePlus, Plus, Save, Trash2 } from "lucide-react";

import { AdminShell } from "@/src/components/admin/AdminShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { createEvent, deleteEvent, updateEvent, type SaveEventInput } from "@/src/lib/api/events";
import type { ApiEvent } from "@/src/lib/api/types";

interface AdminEventsPageProps {
  readonly initialEvents: readonly ApiEvent[];
}

interface EventFormState {
  readonly alt: string;
  readonly badge: string;
  readonly date: string;
  readonly description: string;
  readonly href: string;
  readonly id?: string;
  readonly image: string;
  readonly location: string;
  readonly sortOrder: string;
  readonly title: string;
}

function createEmptyFormState(nextSortOrder: number): EventFormState {
  return {
    alt: "",
    badge: "Featured",
    date: "",
    description: "",
    href: "/tours",
    image: "",
    location: "",
    sortOrder: String(nextSortOrder),
    title: "",
  };
}

function toFormState(event: ApiEvent): EventFormState {
  return {
    alt: event.alt,
    badge: event.badge,
    date: event.date,
    description: event.description,
    href: event.href,
    id: event.id,
    image: event.image,
    location: event.location,
    sortOrder: String(event.sortOrder),
    title: event.title,
  };
}

function toPayload(form: EventFormState): SaveEventInput {
  return {
    alt: form.alt.trim(),
    badge: form.badge.trim(),
    date: form.date.trim(),
    description: form.description.trim(),
    href: form.href.trim(),
    image: form.image.trim(),
    location: form.location.trim(),
    sortOrder: Number(form.sortOrder),
    title: form.title.trim(),
  };
}

export default function AdminEventsPage({ initialEvents }: Readonly<AdminEventsPageProps>) {
  const [events, setEvents] = useState<readonly ApiEvent[]>(initialEvents);
  const [selectedId, setSelectedId] = useState<string | null>(initialEvents[0]?.id ?? null);
  const selectedEvent = events.find((event) => event.id === selectedId) ?? null;
  const nextSortOrder = useMemo(
    () => (events.length === 0 ? 10 : Math.max(...events.map((event) => event.sortOrder)) + 10),
    [events],
  );
  const [form, setForm] = useState<EventFormState>(
    selectedEvent ? toFormState(selectedEvent) : createEmptyFormState(nextSortOrder),
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

  function selectEvent(event: ApiEvent) {
    setSelectedId(event.id);
    setForm(toFormState(event));
    setSaved(false);
    setSubmitError(null);
  }

  function updateField<K extends keyof EventFormState>(field: K, value: EventFormState[K]) {
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
      const response = form.id ? await updateEvent(form.id, payload) : await createEvent(payload);
      const nextEvents = form.id
        ? events.map((item) => (item.id === form.id ? response : item))
        : [...events, response];
      const sortedEvents = [...nextEvents].sort(
        (left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title),
      );

      setEvents(sortedEvents);
      setSelectedId(response.id);
      setForm(toFormState(response));
      setSaved(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save event.");
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
      await deleteEvent(form.id);
      const remainingEvents = events.filter((event) => event.id !== form.id);
      setEvents(remainingEvents);
      if (remainingEvents[0]) {
        setSelectedId(remainingEvents[0].id);
        setForm(toFormState(remainingEvents[0]));
      } else {
        setSelectedId(null);
        setForm(createEmptyFormState(10));
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to delete event.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminShell
      activePath="/admin/events"
      action={
        <Button onClick={resetForCreate} type="button">
          <Plus className="size-4" />
          Add event
        </Button>
      }
      dateLabel="Thursday, May 7, 2026"
      pageTitle="Events"
      searchPlaceholder="Search title, badge, location..."
      sectionLabel="Manage the event cards shown on the public landing page."
      teamValue="sales"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Published events", note: "Visible on the homepage", value: `${events.length}` },
          { label: "Featured badges", note: "Distinct campaign labels", value: `${new Set(events.map((event) => event.badge)).size}` },
          { label: "Locations", note: "Distinct event locations", value: `${new Set(events.map((event) => event.location)).size}` },
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

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_520px]">
        <Card>
          <CardContent className="p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Homepage events</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">Landing page display order</h3>
              </div>
              <CalendarDays className="size-5 text-emerald-800" />
            </div>

            <div className="mt-6 space-y-3">
              {events.map((event) => {
                const active = event.id === selectedId;

                return (
                  <button
                    className={
                      active
                        ? "w-full rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-left"
                        : "w-full rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left transition-colors hover:border-stone-300 hover:bg-white"
                    }
                    key={event.id}
                    onClick={() => selectEvent(event)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">{event.badge}</p>
                        <p className="mt-2 text-lg font-bold tracking-tight text-stone-950">{event.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                          Order {event.sortOrder} · {event.date} · {event.location}
                        </p>
                      </div>
                      <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                        {event.href}
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
                  {form.id ? "Edit event" : "New event"}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
                  {form.id ? "Update homepage card" : "Create homepage card"}
                </h3>
              </div>
              <ImagePlus className="size-5 text-emerald-800" />
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input id="event-title" onChange={(event) => updateField("title", event.target.value)} value={form.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-badge">Badge</Label>
                  <Input id="event-badge" onChange={(event) => updateField("badge", event.target.value)} value={form.badge} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Date label</Label>
                  <Input id="event-date" onChange={(event) => updateField("date", event.target.value)} value={form.date} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input id="event-location" onChange={(event) => updateField("location", event.target.value)} value={form.location} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea id="event-description" onChange={(event) => updateField("description", event.target.value)} value={form.description} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-image">Image URL</Label>
                <Input id="event-image" onChange={(event) => updateField("image", event.target.value)} placeholder="https://images.unsplash.com/..." value={form.image} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-alt">Image alt text</Label>
                <Input id="event-alt" onChange={(event) => updateField("alt", event.target.value)} value={form.alt} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-href">Link href</Label>
                  <Input id="event-href" onChange={(event) => updateField("href", event.target.value)} value={form.href} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-sort-order">Sort order</Label>
                  <Input id="event-sort-order" min="0" onChange={(event) => updateField("sortOrder", event.target.value)} type="number" value={form.sortOrder} />
                </div>
              </div>

              {submitError ? <p className="text-sm font-semibold text-rose-700">{submitError}</p> : null}
              {saved ? <p className="text-sm font-semibold text-emerald-800">Event saved successfully.</p> : null}

              <div className="flex flex-wrap items-center gap-3">
                <Button disabled={isSubmitting} type="submit">
                  <Save className="size-4" />
                  {isSubmitting ? "Saving..." : form.id ? "Save changes" : "Create event"}
                </Button>
                <Button onClick={resetForCreate} type="button" variant="outline">
                  <Plus className="size-4" />
                  New draft
                </Button>
                {form.id ? (
                  <Button className="text-rose-700 hover:text-rose-800" disabled={isDeleting} onClick={handleDelete} type="button" variant="ghost">
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
