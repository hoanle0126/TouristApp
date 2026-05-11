import { apiFetch } from "@/src/lib/api/client";
import { toDestinationCard, toDestinationDetail } from "@/src/lib/api/adapters";
import type { ApiDestinationDetail } from "@/src/lib/api/types";

export type SaveDestinationInput = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly summary: string;
  readonly intro: readonly string[];
  readonly facts: readonly { readonly label: string; readonly value: string }[];
  readonly spotlight: readonly { readonly title: string; readonly description: string }[];
};

export async function getDestinations(query: { readonly search?: string; readonly market?: string; readonly perPage?: number } = {}) {
  const destinations = await apiFetch<ApiDestinationDetail[]>("/destinations", {
    cache: "no-store",
    query: {
      market: query.market,
      search: query.search,
      per_page: query.perPage,
    },
  });

  return destinations.map(toDestinationCard);
}

export async function getDestination(slug: string) {
  const destination = await apiFetch<ApiDestinationDetail>(`/destinations/${slug}`, { cache: "no-store" });
  return toDestinationDetail(destination);
}

export async function getDestinationDetails(query: { readonly search?: string; readonly market?: string; readonly perPage?: number } = {}) {
  return apiFetch<ApiDestinationDetail[]>("/destinations", {
    cache: "no-store",
    query: {
      market: query.market,
      search: query.search,
      per_page: query.perPage,
    },
  });
}

export async function createDestination(input: SaveDestinationInput) {
  return apiFetch<ApiDestinationDetail>("/destinations", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateDestination(slug: string, input: SaveDestinationInput) {
  return apiFetch<ApiDestinationDetail>(`/destinations/${slug}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteDestination(slug: string) {
  return apiFetch<{ readonly deleted: boolean; readonly slug: string }>(`/destinations/${slug}`, {
    cache: "no-store",
    method: "DELETE",
  });
}
