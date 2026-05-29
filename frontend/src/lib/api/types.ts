export type ApiDestinationLink = {
  readonly slug: string;
  readonly title: string;
  readonly href?: string;
  readonly market?: string;
};

export type ApiPartner = {
  readonly description: string;
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
};

export type ApiTravelerReview = {
  readonly id: string;
  readonly name: string;
  readonly quote: string;
  readonly role: string;
  readonly sortOrder: number;
  readonly trip: string;
};

export type ApiTravelMoment = {
  readonly id: string;
  readonly image: string;
  readonly alt: string;
  readonly caption: string | null;
  readonly sortOrder: number;
};

export type ApiEvent = {
  readonly alt: string;
  readonly badge: string;
  readonly date: string;
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly image: string;
  readonly location: string;
  readonly sortOrder: number;
  readonly title: string;
};

export type ApiHotelLink = {
  readonly slug: string;
  readonly name: string;
  readonly href?: string;
  readonly location: string;
  readonly price?: string;
};

export type ApiTourLink = {
  readonly slug: string;
  readonly title: string;
  readonly href?: string;
  readonly type?: string;
  readonly duration?: string;
};

export type ApiTourCard = {
  readonly slug: string;
  readonly title: string;
  readonly badge?: string;
  readonly duration: string;
  readonly guests: string;
  readonly price: string;
  readonly description: string;
  readonly image: string;
  readonly destination: ApiDestinationLink;
  readonly hotels: readonly ApiHotelLink[];
};

export type ApiTourDeparture = {
  readonly id: string;
  readonly date: string;
  readonly capacity: number;
  readonly booked: number;
  readonly remaining: number;
  readonly status: "open" | "closed";
};

export type ApiTourDetail = Omit<ApiTourCard, "description"> & {
  readonly type: string;
  readonly availability: string;
  readonly description: readonly string[];
  readonly shortDescription: string;
  readonly image: string;
  readonly heroImage: string;
  readonly subtitle: string;
  readonly highlights: readonly {
    readonly icon?: string;
    readonly title: string;
    readonly description: string;
  }[];
  readonly itinerary: readonly {
    readonly title: string;
    readonly description: string;
  }[];
  readonly gallery: readonly {
    readonly image: string;
    readonly layout?: "portrait" | "landscape";
  }[];
  readonly inclusions: readonly string[];
  readonly exclusions: readonly string[];
  readonly departures: readonly ApiTourDeparture[];
};

export type ApiDestinationDetail = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly heroImage: string;
  readonly summary: string;
  readonly intro: readonly string[];
  readonly facts: readonly { readonly label: string; readonly value: string }[];
  readonly spotlight: readonly {
    readonly title: string;
    readonly description: string;
  }[];
  readonly relatedTours: readonly {
    readonly href: string;
    readonly label: string;
    readonly meta: string;
    readonly title: string;
  }[];
  readonly relatedHotels: readonly {
    readonly href: string;
    readonly label: string;
    readonly meta: string;
    readonly title: string;
  }[];
  readonly gallery?: readonly { readonly image: string }[];
};

export type ApiHotelAmenity =
  | string
  | {
      readonly label?: string;
      readonly title?: string;
      readonly icon?: string;
    };

export type ApiHotelCard = {
  readonly slug: string;
  readonly amenities: readonly ApiHotelAmenity[];
  readonly badge?: string;
  readonly image?: string;
  readonly location: string;
  readonly name: string;
  readonly price: string;
  readonly destinations: readonly ApiDestinationLink[];
  readonly tours: readonly ApiTourLink[];
};

export type ApiHotelInventoryDay = {
  readonly id: string;
  readonly date: string;
  readonly totalRooms: number;
  readonly bookedRooms: number;
  readonly remaining: number;
  readonly status: "open" | "closed";
};

export type ApiHotelDetail = ApiHotelCard & {
  readonly title: string;
  readonly address: string;
  readonly heroImage: string;
  readonly description: readonly string[];
  readonly gallery: readonly { readonly image: string }[];
  readonly suites: readonly {
    readonly name?: string;
    readonly title?: string;
    readonly description: string;
    readonly price: string;
    readonly badge?: string;
    readonly image: string;
  }[];
  readonly inventory: readonly ApiHotelInventoryDay[];
  readonly booking: {
    readonly checkIn: string;
    readonly checkOut: string;
    readonly fee: string;
    readonly nightlyTotal: string;
    readonly nights: number;
    readonly rating: number;
    readonly travelers: string;
    readonly total: string;
  };
};

export type ApiBlogStatus = "draft" | "published" | "archived";

export type ApiBlogCard = {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly status?: ApiBlogStatus;
  readonly image: string;
  readonly author: string;
  readonly date: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly mentionedDestinations?: readonly ApiDestinationLink[];
  readonly mentionedTours?: readonly ApiTourLink[];
  readonly mentionedHotels?: readonly ApiHotelLink[];
};

export type ApiBlogRelatedPost = {
  readonly href: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly image: string;
};

export type ApiBlogDetail = ApiBlogCard & {
  readonly heroImage: string;
  readonly intro: string;
  readonly meta: string;
  readonly quote: string;
  readonly sections: readonly {
    readonly heading?: string;
    readonly body: readonly string[];
  }[];
  readonly inlineImage: { readonly image: string };
  readonly secondaryFeature: {
    readonly title: string;
    readonly body: string;
    readonly image: { readonly image: string };
  };
  readonly relatedPosts: readonly ApiBlogRelatedPost[];
  readonly seo?: {
    readonly title?: string;
    readonly description?: string;
    readonly ogImage?: string;
  };
};

export type ApiBookingItemInput = {
  readonly itemType: "tour" | "hotel";
  readonly slug: string;
  readonly quantity: number;
  readonly unitPrice?: number;
  readonly date?: string;
  readonly tourDepartureId?: string;
  readonly checkIn?: string;
  readonly checkOut?: string;
  readonly guests?: string;
  readonly nights?: number;
  readonly roomType?: string;
  readonly meta?: string;
};

export type CreateBookingInput = {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly country: string;
  readonly city?: string;
  readonly address?: string;
  readonly travelers: number;
  readonly paymentMethod:
    | "credit-card"
    | "bank-transfer"
    | "apple-pay"
    | "cash";
  readonly specialRequests?: string;
  readonly items: readonly ApiBookingItemInput[];
};

export type LookupBookingInput = {
  readonly bookingCode: string;
  readonly contact: string;
};

export type ApiAiProviderSettings = {
  readonly provider: "openai-compatible";
  readonly baseUrl: string;
  readonly model: string;
  readonly enabled: boolean;
  readonly hasApiKey: boolean;
  readonly apiKeyLast4: string | null;
};

export type UpdateAiProviderSettingsInput = {
  readonly provider?: "openai-compatible";
  readonly baseUrl?: string;
  readonly model?: string;
  readonly enabled?: boolean;
  readonly apiKey?: string;
  readonly clearApiKey?: boolean;
};

export type ApiShopPaymentSettings = {
  readonly bankBin: string;
  readonly bankName: string;
  readonly accountNumber: string;
  readonly accountName: string;
};

export type UpdateShopPaymentSettingsInput = {
  readonly bankBin?: string;
  readonly bankName?: string;
  readonly accountNumber?: string;
  readonly accountName?: string;
};

export type ApiSiteContentSettings = {
  readonly siteName: string;
  readonly siteTagline: string;
  readonly siteDescription: string;
  readonly contactEmail: string;
  readonly hotline: string;
  readonly topBarNote: string;
  readonly promoLabel: string;
  readonly promoCta: string;
  readonly promoHref: string;
  readonly homeHeroImage: string;
  readonly heroImageTwo: string;
  readonly heroImageThree: string;
  readonly facebookUrl: string;
  readonly tiktokUrl: string;
  readonly instagramUrl: string;
};

export type UpdateSiteContentSettingsInput = {
  readonly siteName?: string;
  readonly siteTagline?: string;
  readonly siteDescription?: string;
  readonly contactEmail?: string;
  readonly hotline?: string;
  readonly topBarNote?: string;
  readonly promoLabel?: string;
  readonly promoCta?: string;
  readonly promoHref?: string;
  readonly homeHeroImage?: string;
  readonly heroImageTwo?: string;
  readonly heroImageThree?: string;
  readonly facebookUrl?: string;
  readonly tiktokUrl?: string;
  readonly instagramUrl?: string;
};

export type TestAiProviderSettingsInput = {
  readonly provider: "openai-compatible";
  readonly baseUrl: string;
  readonly model: string;
  readonly apiKey: string;
};

export type ApiChatbotResponse = {
  readonly answer: string;
  readonly sources: readonly {
    readonly kind: "tour" | "hotel" | "blog" | "booking" | "destination";
    readonly label: string;
    readonly slug: string;
  }[];
};

export type ApiBooking = {
  readonly id: string;
  readonly bookingCode: string;
  readonly status: string;
  readonly paymentStatus: string;
  readonly paymentMethod: string;
  readonly bankTransfer?: {
    readonly bankBin: string;
    readonly bankName: string;
    readonly accountNumber: string;
    readonly accountName: string;
    readonly amount: number;
    readonly transferNote: string;
    readonly qrUrl: string;
    readonly qrTemplate: string;
  } | null;
  readonly aiSummary?: string | null;
  readonly customer: {
    readonly fullName: string;
    readonly email: string;
    readonly phone: string;
    readonly country: string;
    readonly city?: string;
    readonly address?: string;
  };
  readonly travelers: number;
  readonly travelerDetails?: unknown;
  readonly trip?: {
    readonly startDate?: string;
    readonly endDate?: string;
    readonly pickupLocation?: string;
    readonly dropoffLocation?: string;
    readonly arrivalFlight?: string;
    readonly specialRequests?: string;
  };
  readonly totals: {
    readonly subtotal: number;
    readonly taxesAndFees: number;
    readonly total: number;
    readonly currency: string;
  };
  readonly items: readonly {
    readonly id: string;
    readonly itemType: "tour" | "hotel";
    readonly slug: string;
    readonly title: string;
    readonly image?: string;
    readonly alt?: string;
    readonly meta?: string;
    readonly priceLabel?: string;
    readonly date?: string;
    readonly checkIn?: string;
    readonly checkOut?: string;
    readonly guests?: string;
    readonly nights?: number;
    readonly roomType?: string;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly lineTotal: number;
    readonly currency: string;
  }[];
  readonly createdAt: string;
  readonly updatedAt: string;
};
