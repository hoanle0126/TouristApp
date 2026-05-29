import type { DestinationDetail } from "@/src/types/travel";

export interface DestinationFormState {
  readonly title: string;
  readonly slug: string;
  readonly href: string;
  readonly cardImage: string;
  readonly shortDescription: string;
  readonly heroImage: string;
  readonly summary: string;
}

export interface DestinationTextRow {
  readonly id: string;
  readonly value: string;
}

export interface DestinationFactRow {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface DestinationFormInitialValues {
  readonly form: DestinationFormState;
  readonly intro: readonly DestinationTextRow[];
  readonly facts: readonly DestinationFactRow[];
  readonly spotlight: readonly DestinationTextRow[];
  readonly gallery: readonly DestinationTextRow[];
}

export interface ResolvedAdminDestinationEditData {
  readonly destinationTitle: string;
  readonly initialValues: DestinationFormInitialValues;
}

export const createDestinationInitialValues: DestinationFormInitialValues = {
  form: {
    title: "",
    slug: "",
    href: "",
    cardImage: "",
    shortDescription: "",
    heroImage: "",
    summary: "",
  },
  intro: [
    { id: "intro-1", value: "" },
    { id: "intro-2", value: "" },
  ],
  facts: [
    { id: "fact-1", label: "", value: "" },
    { id: "fact-2", label: "", value: "" },
  ],
  spotlight: [
    { id: "spotlight-1", value: "" },
    { id: "spotlight-2", value: "" },
    { id: "spotlight-3", value: "" },
  ],
  gallery: [
    { id: "gallery-1", value: "" },
    { id: "gallery-2", value: "" },
    { id: "gallery-3", value: "" },
    { id: "gallery-4", value: "" },
  ],
};

export function slugifyDestinationTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function textRows(prefix: string, values: readonly string[]) {
  if (values.length === 0) {
    return [{ id: `${prefix}-1`, value: "" }];
  }

  return values.map((value, index) => ({ id: `${prefix}-${index + 1}`, value }));
}

function factRows(values: readonly { readonly label: string; readonly value: string }[]) {
  if (values.length === 0) {
    return [{ id: "fact-1", label: "", value: "" }];
  }

  return values.map((fact, index) => ({ id: `fact-${index + 1}`, label: fact.label, value: fact.value }));
}

export function valuesFromDestinationDetail(destination: DestinationDetail): ResolvedAdminDestinationEditData {
  const slug = destination.card.href.split("/").filter(Boolean).at(-1) ?? slugifyDestinationTitle(destination.card.title);
  const galleryImages = destination.gallery?.map((item) => item.image) ?? [];

  return {
    destinationTitle: destination.card.title,
    initialValues: {
      form: {
        title: destination.card.title,
        slug,
        href: `/destinations/${slug}`,
        cardImage: destination.card.image,
        shortDescription: destination.card.description,
        heroImage: destination.heroImage,
        summary: destination.summary,
      },
      intro: textRows("intro", destination.intro),
      facts: factRows(destination.facts),
      spotlight: textRows(
        "spotlight",
        destination.spotlight.map((item) => `${item.title}: ${item.description}`),
      ),
      gallery: textRows("gallery", galleryImages),
    },
  };
}
