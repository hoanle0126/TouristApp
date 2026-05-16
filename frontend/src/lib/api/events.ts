import { toTravelEventCard } from "@/src/lib/api/adapters";
import { apiFetch } from "@/src/lib/api/client";
import type { ApiEvent } from "@/src/lib/api/types";

export type SaveEventInput = {
  readonly alt: string;
  readonly badge: string;
  readonly date: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
  readonly location: string;
  readonly sortOrder: number;
  readonly title: string;
};

export async function getEvents() {
  const events = await apiFetch<ApiEvent[]>("/events", { cache: "no-store" });
  return events.map(toTravelEventCard);
}

export async function getAdminEvents() {
  return apiFetch<ApiEvent[]>("/events", { cache: "no-store" });
}

export async function createEvent(input: SaveEventInput) {
  return apiFetch<ApiEvent>("/events", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateEvent(id: string, input: Partial<SaveEventInput>) {
  return apiFetch<ApiEvent>(`/events/${id}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteEvent(id: string) {
  return apiFetch<{ readonly deleted: boolean; readonly id: string }>(`/events/${id}`, {
    cache: "no-store",
    method: "DELETE",
  });
}
