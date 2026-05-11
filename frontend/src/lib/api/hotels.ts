import { apiFetch } from "@/src/lib/api/client";
import { toHotelCard, toHotelDetail } from "@/src/lib/api/adapters";
import type { ApiHotelCard, ApiHotelDetail } from "@/src/lib/api/types";

export type UpdateHotelInventoryInput = readonly {
  readonly id?: string;
  readonly date: string;
  readonly totalRooms: number;
  readonly status: "open" | "closed";
}[];

export type SaveHotelInput = {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  readonly address: string;
  readonly price: string;
  readonly badge?: string;
  readonly status: "draft" | "published" | "archived";
  readonly listingImage: string;
  readonly heroImage: string;
  readonly description: readonly string[];
  readonly amenities: readonly { readonly icon: string; readonly title: string }[];
  readonly suites: readonly { readonly name: string; readonly price: string; readonly badge?: string; readonly description: string; readonly image: string }[];
  readonly gallery: readonly { readonly image: string }[];
  readonly booking: {
    readonly checkIn: string;
    readonly checkOut: string;
    readonly fee: string;
    readonly nightlyTotal: string;
    readonly nights: number;
    readonly rating: number;
    readonly travelers: string;
    readonly total: string;
  };
  readonly destinationSlugs?: readonly string[];
};

export async function getHotels(query: { readonly search?: string; readonly location?: string; readonly perPage?: number } = {}) {
  const hotels = await apiFetch<ApiHotelCard[]>("/hotels", {
    cache: "no-store",
    query: {
      location: query.location,
      search: query.search,
      per_page: query.perPage,
    },
  });

  return hotels.map(toHotelCard);
}

export async function getHotel(slug: string) {
  const hotel = await apiFetch<ApiHotelDetail>(`/hotels/${slug}`, { cache: "no-store" });
  return toHotelDetail(hotel);
}

export async function createHotel(input: SaveHotelInput) {
  return apiFetch<ApiHotelDetail>("/hotels", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateHotel(slug: string, input: SaveHotelInput) {
  return apiFetch<ApiHotelDetail>(`/hotels/${slug}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function updateHotelInventory(slug: string, input: UpdateHotelInventoryInput) {
  return apiFetch<ApiHotelDetail>(`/hotels/${slug}/inventory`, {
    body: { inventory: input },
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteHotel(slug: string) {
  return apiFetch<{ readonly deleted: boolean; readonly slug: string }>(`/hotels/${slug}`, {
    cache: "no-store",
    method: "DELETE",
  });
}
