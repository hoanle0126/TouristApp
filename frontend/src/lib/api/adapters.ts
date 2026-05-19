import type {
  BlogPost,
  DestinationCard,
  DestinationDetail,
  HotelCard,
  HotelDetail,
  JournalDetail,
  JournalPost,
  TourCard,
  TourDetail,
  TourDetailHighlight,
  TravelEventCard,
  TravelMoment,
  TravelPartner,
  TravelerFeedback,
  VisualDiaryItem,
} from "@/src/types/travel";
import type {
  ApiBlogCard,
  ApiBlogDetail,
  ApiDestinationDetail,
  ApiDestinationLink,
  ApiEvent,
  ApiHotelCard,
  ApiHotelDetail,
  ApiPartner,
  ApiTourCard,
  ApiTourDetail,
  ApiTravelMoment,
  ApiTravelerReview,
} from "@/src/lib/api/types";

function resolveTourDestination(
  tour: ApiTourCard | ApiTourDetail,
): ApiDestinationLink {
  const legacyDestination = (
    tour as ApiTourCard & {
      readonly destinations?: readonly ApiDestinationLink[];
    }
  ).destinations?.[0];
  return tour.destination ?? legacyDestination ?? { slug: "", title: "" };
}

function resolveTourDescription(tour: ApiTourCard | ApiTourDetail) {
  return Array.isArray(tour.description)
    ? tour.description
    : [tour.description];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

const highlightIcons = [
  "boat",
  "fish",
  "food",
  "eco",
  "camera",
  "map",
  "mountain",
  "sparkles",
  "hotel",
  "walk",
  "coffee",
  "compass",
] as const;
const hotelAmenityIcons = [
  "pool",
  "spa",
  "dining",
  "gym",
  "wifi",
  "coffee",
  "parking",
  "beach",
] as const;

function toHighlightIcon(
  icon: string | undefined,
): TourDetailHighlight["icon"] {
  return highlightIcons.find((item) => item === icon) ?? "eco";
}

function toHotelAmenityIcon(
  icon: string | undefined,
): HotelDetail["amenities"][number]["icon"] {
  return hotelAmenityIcons.find((item) => item === icon) ?? "pool";
}

function imageAlt(label: string, context: string) {
  return `${label} ${context}`.trim();
}

export function toTourCard(tour: ApiTourCard): TourCard {
  return {
    alt: imageAlt(tour.title, "tour image"),
    badge: tour.badge,
    description: Array.isArray(tour.description)
      ? (tour.description[0] ?? "")
      : tour.description,
    destination: resolveTourDestination(tour),
    duration: tour.duration,
    guests: tour.guests,
    image: tour.image,
    price: tour.price,
    title: tour.title,
    slug: tour.slug,
  };
}

export function toTourDetail(tour: ApiTourDetail): TourDetail {
  return {
    availability: tour.availability,
    description: resolveTourDescription(tour),
    departures: tour.departures ?? [],
    destination: resolveTourDestination(tour),
    duration: tour.duration,
    exclusions: tour.exclusions,
    gallery: tour.gallery.map((image, index) => ({
      ...image,
      alt: imageAlt(tour.title, `gallery image ${index + 1}`),
      layout: image.layout ?? "landscape",
    })),
    guests: tour.guests,
    heroAlt: imageAlt(tour.title, "hero image"),
    heroImage: tour.heroImage,
    highlights: tour.highlights.map((highlight) => ({
      description: highlight.description,
      icon: toHighlightIcon(highlight.icon),
      title: highlight.title,
    })),
    inclusions: tour.inclusions,
    itinerary: tour.itinerary,
    price: tour.price,
    slug: tour.slug,
    subtitle: tour.subtitle,
    title: tour.title,
    type: tour.type,
  };
}

export function toDestinationCard(
  destination: ApiDestinationDetail,
): DestinationCard {
  return {
    alt: imageAlt(destination.title, "destination image"),
    description: destination.description,
    href: `/destinations/${destination.slug}`,
    image: destination.image,
    slug: destination.slug,
    title: destination.title,
  };
}

export function toDestinationDetail(
  destination: ApiDestinationDetail,
): DestinationDetail {
  return {
    card: toDestinationCard(destination),
    facts: destination.facts,
    heroImage: destination.heroImage,
    intro: destination.intro,
    relatedHotels: destination.relatedHotels,
    relatedTours: destination.relatedTours,
    spotlight: destination.spotlight,
    summary: destination.summary,
  };
}

export function toHotelCard(hotel: ApiHotelCard): HotelCard {
  return {
    amenities: hotel.amenities.map((amenity) =>
      typeof amenity === "string"
        ? amenity
        : (amenity.label ?? amenity.title ?? "Amenity"),
    ),
    alt: imageAlt(hotel.name, "hotel image"),
    badge: hotel.badge,
    image: hotel.image ?? "",
    location: hotel.location,
    name: hotel.name,
    price: hotel.price,
    slug: hotel.slug,
  };
}

export function toHotelDetail(hotel: ApiHotelDetail): HotelDetail {
  return {
    address: hotel.address,
    amenities: hotel.amenities.map((amenity) => {
      if (typeof amenity === "string") {
        return { icon: "pool", title: amenity };
      }

      return {
        icon: toHotelAmenityIcon(amenity.icon),
        title: amenity.title ?? amenity.label ?? "Amenity",
      };
    }),
    booking: {
      checkIn: hotel.booking.checkIn ?? "",
      checkOut: hotel.booking.checkOut ?? "",
      fee: hotel.booking.fee ?? "",
      nightlyTotal: hotel.booking.nightlyTotal ?? "",
      nights:
        hotel.booking.nights === undefined ? "" : String(hotel.booking.nights),
      rating:
        hotel.booking.rating === undefined ? "" : String(hotel.booking.rating),
      travelers: hotel.booking.travelers ?? "",
      total: hotel.booking.total ?? "",
    },
    description: hotel.description,
    gallery: hotel.gallery.map((image, index) => ({
      ...image,
      alt: imageAlt(hotel.name, `gallery image ${index + 1}`),
    })),
    inventory: hotel.inventory ?? [],
    destinations: hotel.destinations,
    heroAlt: imageAlt(hotel.name, "hero image"),
    heroImage: hotel.heroImage,
    location: hotel.location,
    price: hotel.price,
    slug: hotel.slug,
    suites: hotel.suites.map((suite) => {
      const name = suite.name ?? suite.title ?? "Suite";

      return {
        alt: imageAlt(name, "suite image"),
        badge: suite.badge,
        description: suite.description,
        image: suite.image,
        name,
        price: suite.price,
      };
    }),
    title: hotel.title,
  };
}

export function toJournalPost(blog: ApiBlogCard): JournalPost {
  return {
    alt: imageAlt(blog.title, "journal image"),
    category: blog.category,
    excerpt: blog.excerpt,
    image: blog.image,
    title: blog.title,
    slug: blog.slug,
  };
}

export function toBlogPost(blog: ApiBlogCard): BlogPost {
  return {
    category: blog.category,
    excerpt: blog.excerpt,
    image: blog.image,
    title: blog.title,
    slug: blog.slug,
  };
}

export function toTravelPartner(partner: ApiPartner): TravelPartner {
  return {
    description: partner.description,
    id: partner.id,
    name: partner.name,
    sortOrder: partner.sortOrder,
  };
}

export function toTravelerFeedback(
  review: ApiTravelerReview,
): TravelerFeedback {
  return {
    id: review.id,
    name: review.name,
    quote: review.quote,
    role: review.role,
    sortOrder: review.sortOrder,
    trip: review.trip,
  };
}

export function toTravelMoment(moment: ApiTravelMoment): TravelMoment {
  return {
    alt: moment.alt,
    caption: moment.caption,
    id: moment.id,
    image: moment.image,
    sortOrder: moment.sortOrder,
  };
}

export function toTravelEventCard(event: ApiEvent): TravelEventCard {
  return {
    alt: event.alt,
    badge: event.badge,
    date: event.date,
    description: event.description,
    href: event.href,
    id: event.id,
    image: event.image,
    location: event.location,
    sortOrder: event.sortOrder,
    title: event.title,
  };
}

export function toJournalDetail(blog: ApiBlogDetail): JournalDetail {
  return {
    author: blog.author,
    category: blog.category,
    date: formatDate(blog.publishedAt),
    heroAlt: imageAlt(blog.title, "hero image"),
    heroImage: blog.heroImage,
    inlineImage: {
      ...blog.inlineImage,
      alt: imageAlt(blog.title, "inline image"),
    },
    intro: blog.intro,
    meta: blog.meta || blog.readingTime,
    quote: blog.quote,
    relatedPosts: blog.relatedPosts.map((post) => ({
      alt: imageAlt(post.title, "journal image"),
      category: post.category,
      excerpt: post.excerpt,
      href: post.href,
      image: post.image,
      title: post.title,
    })),
    secondaryFeature: {
      ...blog.secondaryFeature,
      image: {
        ...blog.secondaryFeature.image,
        alt: imageAlt(blog.secondaryFeature.title, "feature image"),
      },
    },
    sections: blog.sections,
    title: blog.title,
  };
}
