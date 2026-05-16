import { toTravelerFeedback } from "@/src/lib/api/adapters";
import { apiFetch } from "@/src/lib/api/client";
import type { ApiTravelerReview } from "@/src/lib/api/types";

export type SaveTravelerReviewInput = {
  readonly name: string;
  readonly quote: string;
  readonly role: string;
  readonly sortOrder: number;
  readonly trip: string;
};

export async function getTravelerReviews() {
  const reviews = await apiFetch<ApiTravelerReview[]>("/traveler-reviews", {
    cache: "no-store",
  });
  return reviews.map(toTravelerFeedback);
}

export async function getAdminTravelerReviews() {
  return apiFetch<ApiTravelerReview[]>("/traveler-reviews", {
    cache: "no-store",
  });
}

export async function createTravelerReview(input: SaveTravelerReviewInput) {
  return apiFetch<ApiTravelerReview>("/traveler-reviews", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateTravelerReview(
  id: string,
  input: Partial<SaveTravelerReviewInput>,
) {
  return apiFetch<ApiTravelerReview>(`/traveler-reviews/${id}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteTravelerReview(id: string) {
  return apiFetch<{ readonly deleted: boolean; readonly id: string }>(
    `/traveler-reviews/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    },
  );
}
