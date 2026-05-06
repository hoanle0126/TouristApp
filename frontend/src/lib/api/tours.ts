import { apiFetch } from "@/src/lib/api/client";
import { toTourCard, toTourDetail } from "@/src/lib/api/adapters";
import type { ApiTourCard, ApiTourDetail } from "@/src/lib/api/types";

export type UpdateTourDeparturesInput = readonly {
  readonly id?: string;
  readonly date: string;
  readonly capacity: number;
  readonly status: "open" | "closed";
}[];

export type SaveTourInput = {
  readonly slug: string;
  readonly title: string;
  readonly badge?: "Featured" | "New";
  readonly type: string;
  readonly duration: string;
  readonly guests: string;
  readonly price: string;
  readonly availability: string;
  readonly description: readonly string[];
  readonly shortDescription: string;
  readonly image: string;
  readonly alt: string;
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly curatorImage: string;
  readonly curatorImageAlt: string;
  readonly subtitle: string;
  readonly highlights: readonly { readonly icon: string; readonly title: string; readonly description: string }[];
  readonly itinerary: readonly { readonly title: string; readonly description: string }[];
  readonly gallery: readonly { readonly image: string; readonly alt: string; readonly layout: "portrait" | "landscape" }[];
  readonly inclusions: readonly string[];
  readonly exclusions: readonly string[];
  readonly destinationSlug: string;
};

export async function getTours() {
  const tours = await apiFetch<ApiTourCard[]>("/tours", { cache: "no-store" });
  return tours.map(toTourCard);
}

export async function getTour(slug: string) {
  const tour = await apiFetch<ApiTourDetail>(`/tours/${slug}`, { cache: "no-store" });
  return toTourDetail(tour);
}

export async function createTour(input: SaveTourInput) {
  return apiFetch<ApiTourDetail>("/tours", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateTour(slug: string, input: SaveTourInput) {
  return apiFetch<ApiTourDetail>(`/tours/${slug}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function updateTourDepartures(slug: string, input: UpdateTourDeparturesInput) {
  return apiFetch<ApiTourDetail>(`/tours/${slug}/departures`, {
    body: { departures: input },
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteTour(slug: string) {
  return apiFetch<{ readonly deleted: boolean; readonly slug: string }>(`/tours/${slug}`, {
    cache: "no-store",
    method: "DELETE",
  });
}
