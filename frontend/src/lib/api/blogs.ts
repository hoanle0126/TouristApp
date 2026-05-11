import { apiFetch } from "@/src/lib/api/client";
import { toBlogPost, toJournalDetail, toJournalPost } from "@/src/lib/api/adapters";
import type { ApiBlogCard, ApiBlogDetail, ApiBlogStatus } from "@/src/lib/api/types";

export type SaveBlogInput = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly author: string;
  readonly status: ApiBlogStatus;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly image: string;
  readonly heroImage: string;
  readonly intro: string;
  readonly meta: string;
  readonly quote: string;
  readonly sections: readonly { readonly heading?: string; readonly body: readonly string[] }[];
  readonly inlineImage: { readonly image: string };
  readonly secondaryFeature: {
    readonly title: string;
    readonly body: string;
    readonly image: { readonly image: string };
  };
  readonly relatedPosts: readonly {
    readonly href: string;
    readonly title: string;
    readonly excerpt: string;
    readonly category: string;
    readonly image: string;
  }[];
  readonly seo: { readonly title?: string; readonly description?: string; readonly ogImage?: string };
  readonly mentionedDestinationSlugs?: readonly string[];
  readonly mentionedTourSlugs?: readonly string[];
  readonly mentionedHotelSlugs?: readonly string[];
};

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

export async function getAdminBlogPosts(query: { readonly search?: string; readonly category?: string; readonly perPage?: number } = {}) {
  return apiFetch<ApiBlogCard[]>("/blogs", {
    cache: "no-store",
    query: {
      category: query.category,
      search: query.search,
      per_page: query.perPage,
      status: "all",
    },
  });
}

export async function getAdminBlog(slug: string) {
  return apiFetch<ApiBlogDetail>(`/blogs/${slug}`, {
    cache: "no-store",
    query: { status: "all" },
  });
}

export async function createBlog(input: SaveBlogInput) {
  return apiFetch<ApiBlogDetail>("/blogs", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function updateBlog(slug: string, input: SaveBlogInput) {
  return apiFetch<ApiBlogDetail>(`/blogs/${slug}`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}

export async function deleteBlog(slug: string) {
  return apiFetch<{ readonly deleted: boolean; readonly slug: string }>(`/blogs/${slug}`, {
    cache: "no-store",
    method: "DELETE",
  });
}
