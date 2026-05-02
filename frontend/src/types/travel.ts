export interface CartItem {
  readonly id: string;
  readonly alt: string;
  readonly date: string;
  readonly tourDepartureId?: string;
  readonly checkIn?: string;
  readonly checkOut?: string;
  readonly image: string;
  readonly itemType?: "tour" | "hotel";
  readonly meta: string;
  readonly nights?: number;
  readonly price: string;
  readonly quantity?: number;
  readonly roomType?: string;
  readonly slug?: string;
  readonly title: string;
}

export interface DestinationCard {
  readonly alt: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
  readonly price: string;
  readonly rating: string;
  readonly slug?: string;
  readonly title: string;
}

export interface DestinationDetailFact {
  readonly label: string;
  readonly value: string;
}

export interface DestinationDetailHighlight {
  readonly description: string;
  readonly title: string;
}

export interface DestinationDetailRelatedLink {
  readonly href: string;
  readonly label: string;
  readonly meta: string;
  readonly title: string;
}

export interface DestinationDetail {
  readonly card: DestinationCard;
  readonly facts: readonly DestinationDetailFact[];
  readonly heroEyebrow: string;
  readonly heroImage: string;
  readonly intro: readonly string[];
  readonly relatedHotels: readonly DestinationDetailRelatedLink[];
  readonly relatedTours: readonly DestinationDetailRelatedLink[];
  readonly spotlight: readonly DestinationDetailHighlight[];
  readonly summary: string;
}

export interface BlogPost {
  readonly category: string;
  readonly excerpt: string;
  readonly image: string;
  readonly slug?: string;
  readonly title: string;
}

export interface JournalPost {
  readonly alt: string;
  readonly category: string;
  readonly excerpt: string;
  readonly image: string;
  readonly slug?: string;
  readonly title: string;
}

export interface FeaturedJournalPost extends JournalPost {
  readonly badge: string;
}

export interface JournalDetailImage {
  readonly alt: string;
  readonly image: string;
}

export interface JournalDetailSection {
  readonly body: readonly string[];
  readonly heading?: string;
}

export interface JournalDetailRelatedPost extends JournalPost {
  readonly href: string;
}

export interface JournalDetail {
  readonly author: string;
  readonly category: string;
  readonly date: string;
  readonly heroAlt: string;
  readonly heroImage: string;
  readonly inlineImage: JournalDetailImage;
  readonly intro: string;
  readonly meta: string;
  readonly quote: string;
  readonly relatedPosts: readonly JournalDetailRelatedPost[];
  readonly secondaryFeature: {
    readonly body: string;
    readonly image: JournalDetailImage;
    readonly title: string;
  };
  readonly sections: readonly JournalDetailSection[];
  readonly title: string;
}

export interface TourCard {
  readonly alt: string;
  readonly badge?: "Featured" | "New" | string;
  readonly description: string;
  readonly duration: string;
  readonly guests: string;
  readonly image: string;
  readonly price: string;
  readonly slug?: string;
  readonly title: string;
}

export interface HotelCard {
  readonly amenities: readonly string[];
  readonly alt: string;
  readonly badge?: string;
  readonly image: string;
  readonly location: string;
  readonly name: string;
  readonly price: string;
  readonly score?: string;
  readonly slug?: string;
}

export interface HotelDetailImage {
  readonly alt: string;
  readonly image: string;
}

export interface HotelDetailAmenity {
  readonly icon: "pool" | "spa" | "dining" | "gym";
  readonly title: string;
}

export interface HotelDetailSuite {
  readonly alt: string;
  readonly badge?: string;
  readonly description: string;
  readonly image: string;
  readonly name: string;
  readonly price: string;
}

export interface HotelDetailReviewScore {
  readonly label: string;
  readonly score: string;
}

export interface HotelDetailReview {
  readonly author: string;
  readonly initials: string;
  readonly quote: string;
  readonly stayed: string;
}

export interface HotelInventoryDay {
  readonly id: string;
  readonly date: string;
  readonly totalRooms: number;
  readonly bookedRooms: number;
  readonly remaining: number;
  readonly status: "open" | "closed";
}

export interface HotelDetail {
  readonly address: string;
  readonly amenities: readonly HotelDetailAmenity[];
  readonly booking: {
    readonly checkIn: string;
    readonly checkOut: string;
    readonly fee: string;
    readonly nightlyTotal: string;
    readonly nights: string;
    readonly rating: string;
    readonly travelers: string;
    readonly total: string;
  };
  readonly description: readonly string[];
  readonly gallery: readonly HotelDetailImage[];
  readonly heroAlt: string;
  readonly heroImage: string;
  readonly inventory: readonly HotelInventoryDay[];
  readonly location: string;
  readonly price: string;
  readonly reviewScores: readonly HotelDetailReviewScore[];
  readonly reviews: readonly HotelDetailReview[];
  readonly score: string;
  readonly scoreLabel: string;
  readonly scoreSummary: string;
  readonly slug?: string;
  readonly suites: readonly HotelDetailSuite[];
  readonly title: string;
}

export interface TourDeparture {
  readonly id: string;
  readonly date: string;
  readonly capacity: number;
  readonly booked: number;
  readonly remaining: number;
  readonly status: "open" | "closed";
}

export interface TourDetailHighlight {
  readonly description: string;
  readonly icon: "boat" | "fish" | "food" | "eco";
  readonly title: string;
}

export interface TourDetailStep {
  readonly description: string;
  readonly title: string;
}

export interface TourDetailImage {
  readonly alt: string;
  readonly image: string;
  readonly layout: "portrait" | "landscape";
}

export interface TourDetail {
  readonly availability: string;
  readonly curatorImage: string;
  readonly curatorImageAlt: string;
  readonly description: readonly string[];
  readonly departures: readonly TourDeparture[];
  readonly duration: string;
  readonly exclusions: readonly string[];
  readonly gallery: readonly TourDetailImage[];
  readonly guests: string;
  readonly heroAlt: string;
  readonly heroImage: string;
  readonly highlights: readonly TourDetailHighlight[];
  readonly inclusions: readonly string[];
  readonly itinerary: readonly TourDetailStep[];
  readonly price: string;
  readonly slug?: string;
  readonly subtitle: string;
  readonly title: string;
  readonly type: string;
}
