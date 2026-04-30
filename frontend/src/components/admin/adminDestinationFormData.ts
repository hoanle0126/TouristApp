import { destinationDetails } from "@/src/data/mockData";

export type DestinationCommercialStatus = "Draft" | "Ready for review" | "Published";

export interface DestinationFormState {
  readonly title: string;
  readonly slug: string;
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

export interface DestinationFormInitialValues {
  readonly form: DestinationFormState;
  readonly intro: readonly DestinationTextRow[];
  readonly spotlight: readonly DestinationTextRow[];
  readonly relatedTours: readonly DestinationTextRow[];
  readonly relatedHotels: readonly DestinationTextRow[];
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
  spotlight: [
    { id: "spotlight-1", value: "" },
    { id: "spotlight-2", value: "" },
    { id: "spotlight-3", value: "" },
  ],
  relatedTours: [
    { id: "related-tour-1", value: "" },
    { id: "related-tour-2", value: "" },
  ],
  relatedHotels: [
    { id: "related-hotel-1", value: "" },
    { id: "related-hotel-2", value: "" },
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

export function resolveAdminDestinationEditData(slug: string): ResolvedAdminDestinationEditData | null {
  const destination = Object.values(destinationDetails).find((item) => slugifyDestinationTitle(item.card.title) === slug);

  if (!destination) {
    return null;
  }

  return {
    destinationTitle: destination.card.title,
    initialValues: {
      form: {
        title: destination.card.title,
        slug,
        market: destination.heroEyebrow,
        price: destination.card.price,
        rating: destination.card.rating,
        status: "Published",
        cardImage: destination.card.image,
        cardAlt: destination.card.alt,
        shortDescription: destination.card.description,
        heroImage: destination.heroImage,
        heroAlt: destination.card.alt,
        summary: destination.summary,
      },
      intro: textRows("intro", destination.intro),
      spotlight: textRows(
        "spotlight",
        destination.spotlight.map((item) => `${item.title}: ${item.description}`),
      ),
      relatedTours: textRows(
        "related-tour",
        destination.relatedTours.map((item) => item.title),
      ),
      relatedHotels: textRows(
        "related-hotel",
        destination.relatedHotels.map((item) => item.title),
      ),
    },
  };
}
