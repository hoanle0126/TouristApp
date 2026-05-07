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
  VisualDiaryItem,
} from "@/src/types/travel";
import type { ApiBlogCard, ApiBlogDetail, ApiDestinationDetail, ApiHotelCard, ApiHotelDetail, ApiMomentCaptured, ApiTourCard, ApiTourDetail, ApiDestinationLink } from "@/src/lib/api/types";

function resolveTourDestination(tour: ApiTourCard | ApiTourDetail): ApiDestinationLink {
  const legacyDestination = (tour as ApiTourCard & { readonly destinations?: readonly ApiDestinationLink[] }).destinations?.[0];
  return tour.destination ?? legacyDestination ?? { slug: "", title: "" };
}

function resolveTourDescription(tour: ApiTourCard | ApiTourDetail) {
  return Array.isArray(tour.description) ? tour.description : [tour.description];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function toHighlightIcon(icon: string | undefined): TourDetailHighlight["icon"] {
  if (icon === "boat" || icon === "fish" || icon === "food" || icon === "eco") {
    return icon;
  }

  return "eco";
}

export function toTourCard(tour: ApiTourCard): TourCard {
  return {
    alt: tour.alt,
    badge: tour.badge,
    description: Array.isArray(tour.description) ? tour.description[0] ?? "" : tour.description,
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
    curatorImage: tour.curatorImage,
    curatorImageAlt: tour.curatorImageAlt,
    description: resolveTourDescription(tour),
    departures: tour.departures ?? [],
    destination: resolveTourDestination(tour),
    duration: tour.duration,
    exclusions: tour.exclusions,
    gallery: tour.gallery.map((image) => ({ ...image, layout: image.layout ?? "landscape" })),
    guests: tour.guests,
    heroAlt: tour.heroAlt,
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

export function toDestinationCard(destination: ApiDestinationDetail): DestinationCard {
  return {
    alt: destination.alt,
    description: destination.description,
    href: `/destinations/${destination.slug}`,
    image: destination.image,
    price: destination.price,
    rating: destination.rating,
    title: destination.title,
  };
}

export function toDestinationDetail(destination: ApiDestinationDetail): DestinationDetail {
  return {
    card: toDestinationCard(destination),
    facts: destination.facts,
    heroEyebrow: destination.market,
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
    amenities: hotel.amenities.map((amenity) => amenity.label ?? amenity.title ?? "Amenity"),
    alt: hotel.alt ?? hotel.name,
    badge: hotel.badge,
    image: hotel.image ?? "",
    location: hotel.location,
    name: hotel.name,
    price: hotel.price,
    score: String(hotel.score),
    slug: hotel.slug,
  };
}

export function toHotelDetail(hotel: ApiHotelDetail): HotelDetail {
  return {
    address: hotel.address,
    amenities: hotel.amenities.map((amenity) => ({
      icon: amenity.icon === "pool" || amenity.icon === "spa" || amenity.icon === "dining" || amenity.icon === "gym" ? amenity.icon : "pool",
      title: amenity.label ?? amenity.title ?? "Amenity",
    })),
    booking: {
      checkIn: hotel.booking.checkIn,
      checkOut: hotel.booking.checkOut,
      fee: hotel.booking.fee,
      nightlyTotal: hotel.booking.nightlyTotal,
      nights: String(hotel.booking.nights),
      rating: String(hotel.booking.rating),
      travelers: hotel.booking.travelers,
      total: hotel.booking.total,
    },
    description: hotel.description,
    gallery: hotel.gallery,
    inventory: hotel.inventory ?? [],
    heroAlt: hotel.heroAlt,
    heroImage: hotel.heroImage,
    location: hotel.location,
    price: hotel.price,
    reviewScores: hotel.reviewScores.map((score) => ({ label: score.label, score: String(score.score ?? score.value ?? "") })),
    reviews: hotel.reviews.map((review) => ({
      author: review.author,
      initials:
        review.initials ??
        review.author
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2),
      quote: review.quote,
      stayed: review.stayed ?? review.location ?? "Recent stay",
    })),
    score: String(hotel.score),
    scoreLabel: hotel.scoreLabel,
    slug: hotel.slug,
    scoreSummary: hotel.scoreSummary,
    suites: hotel.suites.map((suite) => ({
      alt: suite.alt,
      badge: suite.badge,
      description: suite.description,
      image: suite.image,
      name: suite.name ?? suite.title ?? "Suite",
      price: suite.price,
    })),
    title: hotel.title,
  };
}

export function toJournalPost(blog: ApiBlogCard): JournalPost {
  return {
    alt: blog.alt,
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

export function toVisualDiaryItem(moment: ApiMomentCaptured): VisualDiaryItem {
  return {
    alt: moment.alt,
    country: moment.country,
    id: moment.id,
    image: moment.image,
    sortOrder: moment.sortOrder,
    title: moment.title,
    wide: moment.wide,
  };
}

export function toJournalDetail(blog: ApiBlogDetail): JournalDetail {
  return {
    author: blog.author,
    category: blog.category,
    date: formatDate(blog.publishedAt),
    heroAlt: blog.heroAlt,
    heroImage: blog.heroImage,
    inlineImage: blog.inlineImage,
    intro: blog.intro,
    meta: blog.meta || blog.readingTime,
    quote: blog.quote,
    relatedPosts: blog.relatedPosts.map((post) => ({
      ...toJournalPost(post),
      href: post.href,
    })),
    secondaryFeature: blog.secondaryFeature,
    sections: blog.sections,
    title: blog.title,
  };
}
