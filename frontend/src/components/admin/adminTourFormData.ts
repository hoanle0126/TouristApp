import type { TourCard, TourDetail } from "@/src/types/travel";

export type TourBadge = "none" | "Featured" | "New";
export type GalleryLayout = "portrait" | "landscape";
export type HighlightIcon = "boat" | "fish" | "food" | "eco" | "camera" | "map" | "mountain" | "sparkles" | "hotel" | "walk" | "coffee" | "compass";
export type OperationalStatus = "Healthy" | "Push sales" | "Almost full";
export type InventoryStatus = "open" | "closed";

export interface AdminTourDepartureFormRow {
  readonly id?: string;
  readonly rowId: string;
  readonly date: string;
  readonly capacity: string;
  readonly booked: string;
  readonly status: InventoryStatus;
}

export interface HighlightItem {
  readonly id: string;
  readonly icon: HighlightIcon;
  readonly title: string;
  readonly description: string;
}

export interface ItineraryItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface GalleryItem {
  readonly id: string;
  readonly image: string;
  readonly layout: GalleryLayout;
}

export interface TourFormState {
  readonly title: string;
  readonly slug: string;
  readonly badge: TourBadge;
  readonly type: string;
  readonly duration: string;
  readonly guests: string;
  readonly price: string;
  readonly availability: string;
  readonly shortDescription: string;
  readonly cardImage: string;
  readonly heroImage: string;
  readonly subtitle: string;
  readonly descriptionParagraphs: string;
  readonly inclusions: string;
  readonly exclusions: string;
  readonly destinationSlug: string;
  readonly departureDate: string;
  readonly guide: string;
  readonly bookedSeats: string;
  readonly capacitySeats: string;
  readonly operationalStatus: OperationalStatus;
  readonly merchandisingNote: string;
}

export interface AdminTourFormInitialValues {
  readonly form: TourFormState;
  readonly departures: readonly AdminTourDepartureFormRow[];
  readonly gallery: readonly GalleryItem[];
  readonly highlights: readonly HighlightItem[];
  readonly itinerary: readonly ItineraryItem[];
}

export interface ResolvedAdminTourEditData extends AdminTourFormInitialValues {
  readonly slug: string;
  readonly title: string;
}

export function slugifyTourTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createTourInitialValues: AdminTourFormInitialValues = {
  form: {
    title: "Bay Mau Coconut Forest Discovery",
    slug: "bay-mau-coconut-forest-discovery",
    badge: "New",
    type: "Small Group",
    duration: "4.5 Hours",
    guests: "Max 12 Guests",
    price: "$45",
    availability: "Daily",
    shortDescription: "Glide through Hoi An's coconut waterways by basket boat with local fishing traditions and a village lunch.",
    cardImage: "",
    heroImage: "",
    subtitle: "Discover the tranquil rhythm of Hoi An's hidden water world through ancient traditions and emerald landscapes.",
    descriptionParagraphs: "Travel through Cam Thanh's water-palm sanctuary with a local guide.\nLearn basket boat traditions, crab fishing, and the stories behind this living landscape.",
    inclusions: "Round-trip hotel pickup in Hoi An\nProfessional English-speaking guide\nBamboo basket boat fees\nAuthentic local lunch and mineral water",
    exclusions: "Personal expenses and souvenirs\nGratuities for guide and boat rowers",
    destinationSlug: "",
    departureDate: "May 02, 2026",
    guide: "Lan Pham",
    bookedSeats: "9",
    capacitySeats: "12",
    operationalStatus: "Healthy",
    merchandisingNote: "Protect as a high-converting short-format product for domestic traffic.",
  },
  departures: [
    {
      rowId: "departure-1",
      date: "2026-05-02",
      capacity: "12",
      booked: "0",
      status: "open",
    },
  ],
  highlights: [
    {
      id: "highlight-1",
      icon: "boat",
      title: "Bamboo Basket Boat",
      description: "Navigate the waterways in an iconic circular Thung Chai.",
    },
  ],
  itinerary: [
    {
      id: "itinerary-1",
      title: "Pick-up & Arrival",
      description: "Depart from your Hoi An hotel and arrive at the Cam Thanh village entrance.",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      image: "",
      layout: "portrait",
    },
  ],
};

function operationalDefaults(card: TourCard): Pick<TourFormState, "departureDate" | "guide" | "bookedSeats" | "capacitySeats" | "operationalStatus" | "merchandisingNote"> {
  if (card.title === "The Soul of Kyoto") {
    return {
      departureDate: "May 06, 2026",
      guide: "Akira Mori",
      bookedSeats: "5",
      capacitySeats: "8",
      operationalStatus: "Push sales",
      merchandisingNote: "Rebalance demand with stronger editorial placement this week.",
    };
  }

  if (card.title === "Amalfi Coast Discovery") {
    return {
      departureDate: "May 11, 2026",
      guide: "Luca Serra",
      bookedSeats: "11",
      capacitySeats: "12",
      operationalStatus: "Almost full",
      merchandisingNote: "Protect remaining seats for high-intent concierge leads.",
    };
  }

  if (card.title === "Arctic Sky Expedition") {
    return {
      departureDate: "May 18, 2026",
      guide: "Freya Nordin",
      bookedSeats: "3",
      capacitySeats: "6",
      operationalStatus: "Push sales",
      merchandisingNote: "Increase urgency around the next northern lights window.",
    };
  }

  return {
    departureDate: "May 24, 2026",
    guide: "Curator Team",
    bookedSeats: "4",
    capacitySeats: card.guests.replace(/\D+/g, "") || "10",
    operationalStatus: "Healthy",
    merchandisingNote: "Keep merchandising aligned with seasonal demand.",
  };
}

function toTourBadge(badge: TourCard["badge"]): TourBadge {
  return badge === "Featured" || badge === "New" ? badge : "none";
}

export function valuesFromTourDetail(detail: TourDetail): ResolvedAdminTourEditData {
  const slug = detail.slug ?? slugifyTourTitle(detail.title);
  const card: TourCard = {
    alt: `${detail.title} tour image`,
    badge: "Featured",
    description: detail.subtitle,
    destination: detail.destination,
    duration: detail.duration,
    guests: detail.guests,
    image: detail.heroImage,
    price: detail.price,
    slug,
    title: detail.title,
  };
  const operations = operationalDefaults(card);

  return {
    slug,
    title: detail.title,
    form: {
      title: detail.title,
      slug,
      badge: toTourBadge(card.badge),
      type: detail.type,
      duration: detail.duration,
      guests: detail.guests,
      price: detail.price,
      availability: detail.availability,
      shortDescription: detail.subtitle,
      cardImage: detail.heroImage,
      heroImage: detail.heroImage,
      subtitle: detail.subtitle,
      descriptionParagraphs: detail.description.join("\n"),
      inclusions: detail.inclusions.join("\n"),
      exclusions: detail.exclusions.join("\n"),
      destinationSlug: detail.destination.slug,
      ...operations,
    },
    departures: detail.departures.length > 0 ? detail.departures.map((departure, index) => ({
      id: departure.id,
      rowId: `departure-${index + 1}`,
      date: departure.date,
      capacity: String(departure.capacity),
      booked: String(departure.booked),
      status: departure.status,
    })) : [{ rowId: "departure-1", date: "", capacity: "", booked: "0", status: "open" }],
    gallery: detail.gallery.map((item, index) => ({
      id: `gallery-${index + 1}`,
      image: item.image,
      layout: item.layout,
    })),
    highlights: detail.highlights.map((item, index) => ({
      id: `highlight-${index + 1}`,
      icon: item.icon,
      title: item.title,
      description: item.description,
    })),
    itinerary: detail.itinerary.map((item, index) => ({
      id: `itinerary-${index + 1}`,
      title: item.title,
      description: item.description,
    })),
  };
}
