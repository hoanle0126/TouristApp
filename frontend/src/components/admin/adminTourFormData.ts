import { bayMauTourDetail, tourCards, type TourCard, type TourDetail } from "@/src/data/mockData";

export type TourBadge = "none" | "Featured" | "New";
export type GalleryLayout = "portrait" | "landscape";
export type HighlightIcon = "boat" | "fish" | "food" | "eco";
export type OperationalStatus = "Healthy" | "Push sales" | "Almost full";

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
  readonly alt: string;
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
  readonly cardAlt: string;
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly curatorImage: string;
  readonly curatorAlt: string;
  readonly subtitle: string;
  readonly descriptionParagraphs: string;
  readonly inclusions: string;
  readonly exclusions: string;
  readonly departureDate: string;
  readonly guide: string;
  readonly bookedSeats: string;
  readonly capacitySeats: string;
  readonly operationalStatus: OperationalStatus;
  readonly merchandisingNote: string;
}

export interface AdminTourFormInitialValues {
  readonly form: TourFormState;
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
    cardAlt: "Basket boats floating through Bay Mau coconut forest",
    heroImage: "",
    heroAlt: "Aerial view of Bay Mau coconut forest at dawn",
    curatorImage: "",
    curatorAlt: "Portrait of a friendly local tour curator",
    subtitle: "Discover the tranquil rhythm of Hoi An's hidden water world through ancient traditions and emerald landscapes.",
    descriptionParagraphs: "Travel through Cam Thanh's water-palm sanctuary with a local guide.\nLearn basket boat traditions, crab fishing, and the stories behind this living landscape.",
    inclusions: "Round-trip hotel pickup in Hoi An\nProfessional English-speaking guide\nBamboo basket boat fees\nAuthentic local lunch and mineral water",
    exclusions: "Personal expenses and souvenirs\nGratuities for guide and boat rowers",
    departureDate: "May 02, 2026",
    guide: "Lan Pham",
    bookedSeats: "9",
    capacitySeats: "12",
    operationalStatus: "Healthy",
    merchandisingNote: "Protect as a high-converting short-format product for domestic traffic.",
  },
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
      alt: "Local fisherman steering a bamboo basket boat",
      layout: "portrait",
    },
  ],
};

function detailForTour(slug: string): TourDetail | undefined {
  return slug === "bay-mau-coconut-forest" ? bayMauTourDetail : undefined;
}

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

function valuesFromTourCard(card: TourCard): ResolvedAdminTourEditData {
  const slug = slugifyTourTitle(card.title);
  const detail = detailForTour(slug);
  const operations = operationalDefaults(card);

  return {
    slug,
    title: card.title,
    form: {
      title: detail?.title ?? card.title,
      slug,
      badge: card.badge ?? "none",
      type: detail?.type ?? "Signature Journey",
      duration: detail?.duration ?? card.duration,
      guests: detail?.guests ?? card.guests,
      price: detail?.price ?? card.price,
      availability: detail?.availability ?? "Seasonal departures",
      shortDescription: card.description,
      cardImage: card.image,
      cardAlt: card.alt,
      heroImage: detail?.heroImage ?? card.image,
      heroAlt: detail?.heroAlt ?? card.alt,
      curatorImage: detail?.curatorImage ?? "",
      curatorAlt: detail?.curatorImageAlt ?? "Portrait of a travel curator",
      subtitle: detail?.subtitle ?? card.description,
      descriptionParagraphs: detail?.description.join("\n") ?? card.description,
      inclusions: detail?.inclusions.join("\n") ?? "Private trip design\nCurated local experiences\nConcierge support before departure",
      exclusions: detail?.exclusions.join("\n") ?? "International flights\nPersonal expenses\nTravel insurance",
      ...operations,
    },
    gallery:
      detail?.gallery.map((item, index) => ({
        id: `gallery-${index + 1}`,
        image: item.image,
        alt: item.alt,
        layout: item.layout,
      })) ?? [
        {
          id: "gallery-1",
          image: card.image,
          alt: card.alt,
          layout: "landscape",
        },
      ],
    highlights:
      detail?.highlights.map((item, index) => ({
        id: `highlight-${index + 1}`,
        icon: item.icon,
        title: item.title,
        description: item.description,
      })) ?? [
        {
          id: "highlight-1",
          icon: "eco",
          title: "Curated access",
          description: "A polished journey shaped around the strongest moments in this itinerary.",
        },
      ],
    itinerary:
      detail?.itinerary.map((item, index) => ({
        id: `itinerary-${index + 1}`,
        title: item.title,
        description: item.description,
      })) ?? [
        {
          id: "itinerary-1",
          title: "Signature arrival",
          description: "Begin with a concierge-led arrival and orientation tailored to the destination.",
        },
      ],
  };
}

export const adminTourEditData = tourCards.map(valuesFromTourCard);

export function getAdminTourEditData(slug: string) {
  return adminTourEditData.find((tour) => tour.slug === slug);
}
