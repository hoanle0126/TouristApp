import type { HotelDetail } from "@/src/types/travel";

export type HotelCommercialStatus = "Draft" | "Ready for review" | "Published";

export interface HotelFormState {
  readonly name: string;
  readonly slug: string;
  readonly location: string;
  readonly price: string;
  readonly badge: string;
  readonly status: HotelCommercialStatus;
  readonly score: string;
  readonly scoreLabel: string;
  readonly scoreSummary: string;
  readonly listingImage: string;
  readonly listingAlt: string;
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly address: string;
  readonly bookingCheckIn: string;
  readonly bookingCheckOut: string;
  readonly bookingFee: string;
  readonly bookingNightlyTotal: string;
  readonly bookingNights: string;
  readonly bookingRating: string;
  readonly bookingTravelers: string;
  readonly bookingTotal: string;
}

export interface HotelTextRow {
  readonly id: string;
  readonly value: string;
}

export interface HotelSuiteRow {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly badge: string;
  readonly description: string;
  readonly image: string;
  readonly alt: string;
}

export interface HotelGalleryRow {
  readonly id: string;
  readonly image: string;
  readonly alt: string;
}

export interface HotelReviewScoreRow {
  readonly id: string;
  readonly label: string;
  readonly score: string;
}

export interface HotelReviewRow {
  readonly id: string;
  readonly author: string;
  readonly initials: string;
  readonly quote: string;
  readonly stayed: string;
}

export interface HotelFormInitialValues {
  readonly form: HotelFormState;
  readonly amenities: readonly HotelTextRow[];
  readonly description: readonly HotelTextRow[];
  readonly suites: readonly HotelSuiteRow[];
  readonly gallery: readonly HotelGalleryRow[];
  readonly reviewScores: readonly HotelReviewScoreRow[];
  readonly reviews: readonly HotelReviewRow[];
}

export interface ResolvedAdminHotelEditData {
  readonly hotelName: string;
  readonly initialValues: HotelFormInitialValues;
}

export const hotelStatusOptions: readonly HotelCommercialStatus[] = ["Draft", "Ready for review", "Published"];

export function createEmptySuite(id: string): HotelSuiteRow {
  return {
    id,
    name: "",
    price: "",
    badge: "",
    description: "",
    image: "",
    alt: "",
  };
}

export function createEmptyGalleryImage(id: string): HotelGalleryRow {
  return {
    id,
    image: "",
    alt: "",
  };
}

export function createEmptyReviewScore(id: string): HotelReviewScoreRow {
  return {
    id,
    label: "",
    score: "",
  };
}

export function createEmptyReview(id: string): HotelReviewRow {
  return {
    id,
    author: "",
    initials: "",
    quote: "",
    stayed: "",
  };
}

export const createHotelInitialValues: HotelFormInitialValues = {
  form: {
    name: "",
    slug: "",
    location: "",
    price: "",
    badge: "",
    status: "Draft",
    score: "",
    scoreLabel: "",
    scoreSummary: "",
    listingImage: "",
    listingAlt: "",
    heroImage: "",
    heroAlt: "",
    address: "",
    bookingCheckIn: "",
    bookingCheckOut: "",
    bookingFee: "",
    bookingNightlyTotal: "",
    bookingNights: "",
    bookingRating: "",
    bookingTravelers: "",
    bookingTotal: "",
  },
  amenities: [
    { id: "amenity-1", value: "" },
    { id: "amenity-2", value: "" },
  ],
  description: [
    { id: "description-1", value: "" },
    { id: "description-2", value: "" },
  ],
  suites: [createEmptySuite("suite-1")],
  gallery: [createEmptyGalleryImage("gallery-1")],
  reviewScores: [createEmptyReviewScore("review-score-1")],
  reviews: [createEmptyReview("review-1")],
};

export function slugifyHotelName(name: string) {
  return name
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

export function valuesFromHotelDetail(detail: HotelDetail): ResolvedAdminHotelEditData {
  const slug = detail.slug ?? slugifyHotelName(detail.title);

  return {
    hotelName: detail.title,
    initialValues: {
      form: {
        name: detail.title,
        slug,
        location: detail.location,
        price: detail.price,
        badge: "",
        status: "Published",
        score: detail.score,
        scoreLabel: detail.scoreLabel,
        scoreSummary: detail.scoreSummary,
        listingImage: detail.heroImage,
        listingAlt: detail.heroAlt,
        heroImage: detail.heroImage,
        heroAlt: detail.heroAlt,
        address: detail.address,
        bookingCheckIn: detail.booking.checkIn,
        bookingCheckOut: detail.booking.checkOut,
        bookingFee: detail.booking.fee,
        bookingNightlyTotal: detail.booking.nightlyTotal,
        bookingNights: String(detail.booking.nights),
        bookingRating: String(detail.booking.rating),
        bookingTravelers: detail.booking.travelers,
        bookingTotal: detail.booking.total,
      },
      amenities: textRows(
        "amenity",
        detail.amenities.map((amenity) => amenity.title),
      ),
      description: textRows("description", detail.description),
      suites: detail.suites.map((suite, index) => ({
        id: `suite-${index + 1}`,
        name: suite.name,
        price: suite.price,
        badge: suite.badge ?? "",
        description: suite.description,
        image: suite.image,
        alt: suite.alt,
      })),
      gallery: detail.gallery.map((image, index) => ({
        id: `gallery-${index + 1}`,
        image: image.image,
        alt: image.alt,
      })),
      reviewScores: detail.reviewScores.map((score, index) => ({
        id: `review-score-${index + 1}`,
        label: score.label,
        score: score.score,
      })),
      reviews: detail.reviews.map((review, index) => ({
        id: `review-${index + 1}`,
        author: review.author,
        initials: review.initials,
        quote: review.quote,
        stayed: review.stayed,
      })),
    },
  };
}
