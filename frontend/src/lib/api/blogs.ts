import { apiFetch } from "@/src/lib/api/client";
import { toBlogPost, toJournalDetail, toJournalPost } from "@/src/lib/api/adapters";
import type { ApiBlogCard, ApiBlogDetail } from "@/src/lib/api/types";

export async function getJournalPosts(query: { readonly search?: string; readonly category?: string; readonly perPage?: number } = {}) {
  const posts = await apiFetch<ApiBlogCard[]>("/blogs", {
    cache: "no-store",
    query: {
      category: query.category,
      search: query.search,
      per_page: query.perPage,
    },
  });

  return posts.map(toJournalPost);
}

export async function getBlogPosts(query: { readonly search?: string; readonly category?: string; readonly perPage?: number } = {}) {
  const posts = await apiFetch<ApiBlogCard[]>("/blogs", {
    cache: "no-store",
    query: {
      category: query.category,
      search: query.search,
      per_page: query.perPage,
    },
  });

  return posts.map(toBlogPost);
}

export async function getJournalDetail(slug: string) {
  const post = await apiFetch<ApiBlogDetail>(`/blogs/${slug}`, { cache: "no-store" });
  return toJournalDetail(post);
}
