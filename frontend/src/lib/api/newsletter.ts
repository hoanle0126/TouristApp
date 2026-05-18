import { apiFetch } from "@/src/lib/api/client";

export type NewsletterSubscriber = {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;
};

export async function subscribeToNewsletter(email: string) {
  return apiFetch<NewsletterSubscriber>("/newsletter/subscribers", {
    body: { email },
    cache: "no-store",
    method: "POST",
  });
}

export async function getNewsletterSubscribers(query?: string) {
  return apiFetch<NewsletterSubscriber[]>("/newsletter/subscribers", {
    cache: "no-store",
    query: query ? { q: query } : undefined,
  });
}

export async function deleteNewsletterSubscriber(id: string) {
  return apiFetch<{ readonly deleted: boolean; readonly id: string }>(
    `/newsletter/subscribers/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    },
  );
}
