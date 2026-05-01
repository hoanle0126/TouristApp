import type { DestinationDetail } from "@/src/types/travel";

export type DestinationCommercialStatus = "Draft" | "Ready for review" | "Published";

export interface DestinationFormState {
  readonly title: string;
  readonly slug: string;
  readonly href: string;
  readonly market: string;
  readonly price: string;
  readonly rating: string;
  readonly status: DestinationCommercialStatus;
  readonly cardImage: string;
  readonly cardAlt: string;
  readonly shortDescription: string;
  readonly heroImage: string;
  readonly heroAlt: string;
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

export interface DestinationLinkRow {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  readonly meta: string;
  readonly title: string;
}

export interface DestinationFormInitialValues {
  readonly form: DestinationFormState;
  readonly intro: readonly DestinationTextRow[];
  readonly facts: readonly DestinationFactRow[];
  readonly spotlight: readonly DestinationTextRow[];
  readonly relatedTours: readonly DestinationLinkRow[];
  readonly relatedHotels: readonly DestinationLinkRow[];
}

export interface ResolvedAdminDestinationEditData {
  readonly destinationTitle: string;
  readonly initialValues: DestinationFormInitialValues;
}

export const destinationStatusOptions: readonly DestinationCommercialStatus[] = [
  "Draft",
  "Ready for review",
  "Published",
];

export const createDestinationInitialValues: DestinationFormInitialValues = {
  form: {
    title: "",
    slug: "",
    href: "",
    market: "Asia Pacific",
    price: "",
    rating: "",
    status: "Draft",
    cardImage: "",
    cardAlt: "",
    shortDescription: "",
    heroImage: "",
    heroAlt: "",
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
  relatedTours: [
    { id: "related-tour-1", href: "", label: "", meta: "", title: "" },
    { id: "related-tour-2", href: "", label: "", meta: "", title: "" },
  ],
  relatedHotels: [
    { id: "related-hotel-1", href: "", label: "", meta: "", title: "" },
    { id: "related-hotel-2", href: "", label: "", meta: "", title: "" },
  ],
};

export function slugifyDestinationTitle(title: string) {
  return title
    .toLowerCase()
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

function linkRows(prefix: string, values: readonly { readonly href: string; readonly label: string; readonly meta: string; readonly title: string }[]) {
  if (values.length === 0) {
    return [{ id: `${prefix}-1`, href: "", label: "", meta: "", title: "" }];
  }

  return values.map((item, index) => ({
    id: `${prefix}-${index + 1}`,
    href: item.href,
    label: item.label,
    meta: item.meta,
    title: item.title,
  }));
}

export function valuesFromDestinationDetail(destination: DestinationDetail): ResolvedAdminDestinationEditData {
  const slug = destination.card.href.split("/").filter(Boolean).at(-1) ?? slugifyDestinationTitle(destination.card.title);

  return {
    destinationTitle: destination.card.title,
    initialValues: {
      form: {
        title: destination.card.title,
        slug,
        href: `/destinations/${slug}`,
        market: destination.heroEyebrow,
        price: destination.card.price,
        rating: String(destination.card.rating),
        status: "Published",
        cardImage: destination.card.image,
        cardAlt: destination.card.alt,
        shortDescription: destination.card.description,
        heroImage: destination.heroImage,
        heroAlt: destination.card.alt,
        summary: destination.summary,
      },
      intro: textRows("intro", destination.intro),
      facts: factRows(destination.facts),
      spotlight: textRows(
        "spotlight",
        destination.spotlight.map((item) => `${item.title}: ${item.description}`),
      ),
      relatedTours: linkRows("related-tour", destination.relatedTours),
      relatedHotels: linkRows("related-hotel", destination.relatedHotels),
    },
  };
}
