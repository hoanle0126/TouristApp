import { toTravelMoment } from "@/src/lib/api/adapters";
import { apiFetch } from "@/src/lib/api/client";
import type { ApiTravelMoment } from "@/src/lib/api/types";

export type SaveTravelMomentInput = {
  readonly image: string;
  readonly alt: string;
  readonly caption?: string;
  readonly sortOrder: number;
};

export async function getTravelMoments() {
  const moments = await apiFetch<ApiTravelMoment[]>("/travel-moments", {
    cache: "no-store",
  });
  return moments.map(toTravelMoment);
}

export async function getAdminTravelMoments() {
  return apiFetch<ApiTravelMoment[]>("/travel-moments", {
    cache: "no-store",
  });
}

export async function createTravelMoment(input: SaveTravelMomentInput) {
  return apiFetch<ApiTravelMoment>("/travel-moments", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateTravelMoment(
  id: string,
  input: Partial<SaveTravelMomentInput>,
) {
  return apiFetch<ApiTravelMoment>(`/travel-moments/${id}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteTravelMoment(id: string) {
  return apiFetch<{ readonly deleted: boolean; readonly id: string }>(
    `/travel-moments/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    },
  );
}
