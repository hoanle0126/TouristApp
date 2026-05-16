import { toTravelPartner } from "@/src/lib/api/adapters";
import { apiFetch } from "@/src/lib/api/client";
import type { ApiPartner } from "@/src/lib/api/types";

export type SavePartnerInput = {
  readonly description: string;
  readonly name: string;
  readonly sortOrder: number;
};

export async function getPartners() {
  const partners = await apiFetch<ApiPartner[]>("/partners", {
    cache: "no-store",
  });
  return partners.map(toTravelPartner);
}

export async function getAdminPartners() {
  return apiFetch<ApiPartner[]>("/partners", { cache: "no-store" });
}

export async function createPartner(input: SavePartnerInput) {
  return apiFetch<ApiPartner>("/partners", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updatePartner(
  id: string,
  input: Partial<SavePartnerInput>,
) {
  return apiFetch<ApiPartner>(`/partners/${id}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deletePartner(id: string) {
  return apiFetch<{ readonly deleted: boolean; readonly id: string }>(
    `/partners/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    },
  );
}
