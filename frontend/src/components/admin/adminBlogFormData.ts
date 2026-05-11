import type { ApiBlogDetail, ApiBlogStatus } from "@/src/lib/api/types";

export interface BlogFormState {
  readonly title: string;
  readonly slug: string;
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
  readonly inlineImage: string;
  readonly secondaryFeatureTitle: string;
  readonly secondaryFeatureBody: string;
  readonly secondaryFeatureImage: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoOgImage: string;
}

export interface BlogTextRow {
  readonly id: string;
  readonly value: string;
}

export interface BlogSectionRow {
  readonly id: string;
  readonly heading: string;
  readonly body: readonly BlogTextRow[];
}

export interface BlogRelatedPostRow {
  readonly id: string;
  readonly href: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly image: string;
}

export interface BlogFormInitialValues {
  readonly form: BlogFormState;
  readonly sections: readonly BlogSectionRow[];
  readonly relatedPosts: readonly BlogRelatedPostRow[];
}

export interface ResolvedAdminBlogEditData {
  readonly blogTitle: string;
  readonly initialValues: BlogFormInitialValues;
}

export const blogStatusOptions: readonly ApiBlogStatus[] = ["draft", "published", "archived"];

export function slugifyBlogTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptySection(id: string): BlogSectionRow {
  return {
    id,
    heading: "",
    body: [{ id: `${id}-body-1`, value: "" }],
  };
}

export function createEmptyRelatedPost(id: string): BlogRelatedPostRow {
  return {
    id,
    href: "",
    title: "",
    excerpt: "",
    category: "",
    image: "",
  };
}

export const createBlogInitialValues: BlogFormInitialValues = {
  form: {
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    author: "TouristWeb Editorial",
    status: "draft",
    publishedAt: new Date().toISOString().slice(0, 10),
    readingTime: "5 min read",
    image: "",
    heroImage: "",
    intro: "",
    meta: "",
    quote: "",
    inlineImage: "",
    secondaryFeatureTitle: "",
    secondaryFeatureBody: "",
    secondaryFeatureImage: "",
    seoTitle: "",
    seoDescription: "",
    seoOgImage: "",
  },
  sections: [createEmptySection("section-1")],
  relatedPosts: [createEmptyRelatedPost("related-post-1")],
};

function toDateInputValue(value: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function textRows(prefix: string, values: readonly string[]) {
  return values.length > 0
    ? values.map((value, index) => ({ id: `${prefix}-${index + 1}`, value }))
    : [{ id: `${prefix}-1`, value: "" }];
}

export function valuesFromBlogDetail(detail: ApiBlogDetail): ResolvedAdminBlogEditData {
  return {
    blogTitle: detail.title,
    initialValues: {
      form: {
        title: detail.title,
        slug: detail.slug,
        excerpt: detail.excerpt,
        category: detail.category,
        author: detail.author,
        status: detail.status ?? "published",
        publishedAt: toDateInputValue(detail.publishedAt),
        readingTime: detail.readingTime,
        image: detail.image,
        heroImage: detail.heroImage,
        intro: detail.intro,
        meta: detail.meta,
        quote: detail.quote,
        inlineImage: detail.inlineImage.image,
        secondaryFeatureTitle: detail.secondaryFeature.title,
        secondaryFeatureBody: detail.secondaryFeature.body,
        secondaryFeatureImage: detail.secondaryFeature.image.image,
        seoTitle: detail.seo?.title ?? "",
        seoDescription: detail.seo?.description ?? "",
        seoOgImage: detail.seo?.ogImage ?? "",
      },
      sections: detail.sections.length > 0 ? detail.sections.map((section, index) => ({
        id: `section-${index + 1}`,
        heading: section.heading ?? "",
        body: textRows(`section-${index + 1}-body`, section.body),
      })) : [createEmptySection("section-1")],
      relatedPosts: detail.relatedPosts.length > 0 ? detail.relatedPosts.map((post, index) => ({
        id: `related-post-${index + 1}`,
        href: post.href,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        image: post.image,
      })) : [createEmptyRelatedPost("related-post-1")],
    },
  };
}
