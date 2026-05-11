import { toVisualDiaryItem } from "@/src/lib/api/adapters";
import { apiFetch } from "@/src/lib/api/client";
import type { ApiMomentCaptured } from "@/src/lib/api/types";

export type SaveMomentCapturedInput = {
  readonly country: string;
  readonly image: string;
  readonly sortOrder: number;
  readonly title: string;
  readonly wide: boolean;
};

export async function getMomentsCaptured() {
  const moments = await apiFetch<ApiMomentCaptured[]>("/moments-captured", {
    cache: "no-store",
  });

  return moments.map(toVisualDiaryItem);
}

export async function createMomentCaptured(input: SaveMomentCapturedInput) {
  return apiFetch<ApiMomentCaptured>("/moments-captured", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateMomentCaptured(id: string, input: SaveMomentCapturedInput) {
  return apiFetch<ApiMomentCaptured>(`/moments-captured/${id}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteMomentCaptured(id: string) {
  return apiFetch<{ readonly deleted: boolean; readonly id: string }>(
    `/moments-captured/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    },
  );
}
