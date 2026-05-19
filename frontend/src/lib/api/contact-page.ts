import { apiFetch } from "@/src/lib/api/client";

export type ContactPageContent = {
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly formTitle: string;
  readonly formSubtitle: string;
  readonly offices: readonly {
    readonly name: string;
    readonly address: readonly string[];
  }[];
  readonly departments: readonly {
    readonly name: string;
    readonly email: string;
  }[];
  readonly mapImage: string;
  readonly mapAlt: string;
  readonly mapTitle: string;
  readonly mapNote: string;
};

export async function getContactPage() {
  return apiFetch<ContactPageContent>("/contact-page", { cache: "no-store" });
}

export async function updateContactPage(input: ContactPageContent) {
  return apiFetch<ContactPageContent>("/contact-page", {
    body: input,
    cache: "no-store",
    method: "PUT",
  });
}
