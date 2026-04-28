export interface VisualDiaryItem {
  readonly alt: string;
  readonly country: string;
  readonly image: string;
  readonly title: string;
  readonly wide?: boolean;
}

export interface DestinationCard {
  readonly alt: string;
  readonly description: string;
  readonly image: string;
  readonly price: string;
  readonly rating: string;
  readonly title: string;
}

export interface SuggestionCard {
  readonly alt: string;
  readonly image: string;
  readonly location: string;
  readonly price: string;
  readonly title: string;
}

export interface BlogPost {
  readonly category: string;
  readonly excerpt: string;
  readonly image: string;
  readonly title: string;
}

export interface JournalPost {
  readonly alt: string;
  readonly category: string;
  readonly excerpt: string;
  readonly image: string;
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
  readonly badge?: "Featured" | "New";
  readonly description: string;
  readonly duration: string;
  readonly guests: string;
  readonly image: string;
  readonly price: string;
  readonly title: string;
}

export interface HotelCard {
  readonly amenities: readonly string[];
  readonly alt: string;
  readonly badge: string;
  readonly image: string;
  readonly location: string;
  readonly name: string;
  readonly price: string;
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
  readonly location: string;
  readonly price: string;
  readonly reviewScores: readonly HotelDetailReviewScore[];
  readonly reviews: readonly HotelDetailReview[];
  readonly score: string;
  readonly scoreLabel: string;
  readonly scoreSummary: string;
  readonly suites: readonly HotelDetailSuite[];
  readonly title: string;
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
  readonly subtitle: string;
  readonly title: string;
  readonly type: string;
}

export interface AboutCurator {
  readonly alt: string;
  readonly bio: string;
  readonly image: string;
  readonly name: string;
  readonly role: string;
}

export interface AboutPhilosophyPillar {
  readonly description: string;
  readonly icon: "nature" | "leaf" | "sparkle";
  readonly title: string;
}

export interface AboutPageData {
  readonly cta: string;
  readonly curators: readonly AboutCurator[];
  readonly heroAlt: string;
  readonly heroImage: string;
  readonly heroSubtitle: string;
  readonly heroTitle: string;
  readonly mission: string;
  readonly philosophy: readonly AboutPhilosophyPillar[];
  readonly story: {
    readonly alt: string;
    readonly body: readonly string[];
    readonly heading: string;
    readonly image: string;
  };
  readonly vision: string;
}

export interface ContactOffice {
  readonly address: readonly string[];
  readonly name: string;
}

export interface ContactDepartment {
  readonly email: string;
  readonly name: string;
}

export interface ContactPageData {
  readonly departments: readonly ContactDepartment[];
  readonly directLines: {
    readonly email: string;
    readonly phone: string;
  };
  readonly heroSubtitle: string;
  readonly heroTitle: string;
  readonly map: {
    readonly alt: string;
    readonly image: string;
    readonly note: string;
    readonly title: string;
  };
  readonly offices: readonly ContactOffice[];
}

export const navigationItems = [
  "Home",
  "Tours",
  "Hotels",
  "Blog",
  "About Us",
  "Contact",
] as const;

export const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCg0tkFvUSRvjjSmOt_subHDKhJnyXcL3rlIfQE3Jb5M_r5QYZLt7YYVGblQ7SEn7DyHzD4lbE6dP-rLtymSWNVTb0BpjBaHzyBqDsgcK-23bpxaciOe89sOtBNSKUn8lvUDT0keX8HCxGIi5aDbQ6b--KeiIEO92PDpg-4lohkr4kdYn1MW_cz2p-zxMbsbB2rGLdjzfEf0S4Oa_d2I-vbwJoUtJ380bcKXWIVhiBfVp113dBGZJGald2rtFVCwcGcFuIxB1KSxG94";

export const visualDiaryItems: readonly VisualDiaryItem[] = [
  {
    alt: "Luxurious infinity pool overlooking tropical jungle in Bali at sunset",
    country: "Indonesia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXt_uOk39Ti37dURaaAO9Gv1kYVRVrW8XysehQZYZ-kt8ZIZ2bwtsNbCd8AQ10u4z3Ws-ygeCNJUv5Gop1UT63u6X8MxMOwsc3rhdMRY3tsgjeEe7qMzcd2149-FycyLeFDO7xpx9kcEWk2_fS8DKpX_9kDbN7JeuBgbv1G_I2vQxg6YBjFVxc2nyFZne7rAd3m-oBrS93hnfaOSPn5-SrDsWnmzW4Kbf9FhEm3BsIhBf9ZX3-3YD5FUAC77BSp5tPXQZqXBkT11Kv",
    title: "Ubud Sanctuary",
  },
  {
    alt: "Sunset over Santorini caldera with white domed buildings",
    country: "Greece",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPOgbPq_XwQHxqcdV8CyyHHmuASmYTCmNh8iC7Qa31o9m88sCugttUqmVEJ9bS5RPzElQEn3SYK-jK_z3ZTIrVazznHG0pefnGU_WXvkW-iVA_-PFDRH_IKzie9_WL8XUqXMxcvGZ2MQlUIH04iFzpzi0-Dw9h8BagV-0zsnmNHMyzCNzFKofG6m8Jgt1H4eP9Kmlfbm3tlEv7MKPMhepN0PChYlQh5bYZy_lqG6VpCO0OfdJSwkDnmnv66dBHDhuW2r9OkGCMoo0l",
    title: "Oia Heights",
    wide: true,
  },
  {
    alt: "Orange torii gates at Fushimi Inari shrine in Kyoto",
    country: "Japan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAF4vsCxEPUT55N-RY2qaIvB_vfZFOivZwZ9iOvf16bFRt0ntzY8S9f8SN1Y69IGH9UEwQJJ4z-s409ytBeuTtHET1tRKmmZZ7purJkx80yYpcbQu-HMrFGCLFQrH9MmxYVPtwbNMaGNC0pX5pHQFf6Pf20qr-d6DU5b8mbJ09TwyrMdeGgJK7i0ug1bPf7MuX84yyLKpMlihdxXp-Rx3Wny5jGquG2LmnAUEA0Xk-SSmox9ULLpYVMrzC7tbttWUuf-vk8cdjTvwoC",
    title: "Kyoto Rituals",
  },
  {
    alt: "Snow-capped alpine mountains reflecting in a turquoise lake",
    country: "Switzerland",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmQGXS04u9LQQr8k62J4bbs5yRMtU1_3unbCZXTbhnDlAJZd6PTnWl9ObnEBg_XeHpk1EW78JTlcFrpgc03E6GF_GD30D8cTau7EFb48AKzznjX8M3MAwWIJrOGch91X09_JxAecQVTs0keSp11X99OraPR_Nmvc-aV-NT4PPebtaG5J9v2tIMaM5eCrLoVdStV6ZMQr2G8xdbmvLDtw1ByehwABdtCZGgp9ceBVrFy-U-3crNf73iAB6_pRpzvDuMxU397e3baeGv",
    title: "Alpine Silence",
    wide: true,
  },
] as const;

export const destinationCards: readonly DestinationCard[] = [
  {
    alt: "Norwegian fjords with deep blue water and dramatic mountain peaks",
    description:
      "Sail through cinematic cliffs and quiet coastal villages shaped by ancient glacial landscapes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4Pc4Hz2ckphmn1PXS-ra4wYOkUqi7PMGWKx61d5rMwLWxEwWY9yD9IAF7y6ED_dd3XsvuYHLJpjONv34C5d-NT7TZNwMJ3GE2UEGHGQosEdJI1MXtNKDRueIJXq0fSBHje9meDPhmJuiXmHKGqBBLuE93xjrlgt64-QMJgo8xyI1ZlOPUNmSQ95M1p-VknE5zyYismU3NeJlov_lokR9yBG_xV_ioAQIrI3-iCN6Zs7bY0PzXTqJb2qkYxvPYK24z3G9ZP2hIvls",
    price: "$1,200",
    rating: "4.9",
    title: "Nordic Fjords",
  },
  {
    alt: "Big Ben and Westminster Bridge in London at dusk",
    description:
      "Discover the perfect blend of historic architecture and cutting-edge modern culture.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIBL4yRfAkIWlPfBg6EEXIpLsxANGUc4HpdqvjcNLWLR0lbcucB_In7Pae-G1W_plTCRD_6zPSFdgBo5pyaSvUqSkvbeJ3g8zcr_OdCdwHnL7fVZOkJ3Gmu4KisipjrzsOfWFy8oUkLpAYP9TA7AxZrfRVQVasOVWebBj5tS3v2iW24WaImU46qVZPgKWuBOzvOkPUYdMdEwGWodlbYLlSKUBynxUkh4nMkwc5A1eTBOHm7nme0BufNc858zAwcmU5kw0sEEJohfGq",
    price: "$850",
    rating: "4.7",
    title: "London Essence",
  },
  {
    alt: "Medieval German town with half-timbered houses",
    description:
      "Wander through fairy-tale villages and explore the majestic castles of the Black Forest.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiPv71cX-SLFEC50j5ADgesaGwtxXoy8-nT-4_OE9DE3MyblA4EmKN-pbYDYqd_zAlunErJEyN7zjXebxA8PdMGtsJeJMYwJaG-TwPKOUprlw7k4n5F6Y7P2mV2eisvlduz5KufDqUoQrUdB-QBXWkkJqFqYT-770OyBNIL4Ow2iRHEG2p7Kaxv78AkbJ2UwynnS1fcSIPcWFb4Fe7gTRF0UBPlvETC_US-Jyt_AR5HEnvAK7DYhRnXtnPuoKlxKaLakZnYYAUgrIP",
    price: "$1,100",
    rating: "4.8",
    title: "Bavarian Trails",
  },
] as const;

export const suggestionCards: readonly SuggestionCard[] = [
  {
    alt: "Minimalist modern villa with an infinity pool overlooking a vineyard",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkw-TrvS0JWahNeSAf6KTALx0u6Rrbegt31EcXVvHFPieRtl6V4vkxzCrPVPfr-uJdef8bDhsPQAAsmrOKPN9nEp--h-3RKSZMaaeTWeFJzHXxc4DPvu-TlMqNBuiRiokaMn9oaDpjZZzrHR6WPPDcbtqdvXYHqBg-F3i1A7EDk3LIaTBVWdOZbuJBOzyVc0R1lTwiIAbcshvds1h4fCvFvUkca_rU4umBUWHDPVZE5EiQiAmBGQ5ugcAhWYgdja275XacPDgfxQwp",
    location: "Tuscany, Italy",
    price: "$450/nt",
    title: "The Glass House Villa",
  },
  {
    alt: "Luxury eco-resort in a dense tropical forest",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJobfkEYOAXGvJu_F0oRnLZJYZqLgRyDtVQraRwbpXsYOD5-tqPyPvIJk2mWwD4xlXvXdkoo8is-cGJwMsh3yrolNyZzeaHMbCUG5xWbTgcoYDvJTWZef4SCZ7UsrIKqYOtIlpZmYrrkNUhs4cfvCMOL7A-8oS_1VVJFuK_oY0FEo2E1p-1BvGOxF_j6DVYSRIMefSEWYhAjNOm0xvaarbJVsFa1-IzSBLv6VCSX5FYjc3xVWr-ciGCsNDiyU1_brubeMTUevO81il",
    location: "Maldives",
    price: "$890/nt",
    title: "Azure Bay Resort",
  },
  {
    alt: "Luxury yacht sailing through turquoise Mediterranean waters",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLmxLbLp9No_ehZTLqY_5nrYVKNIbcsUFHvN1FUo4YsJpn4BuuGJVhtps750yfqY0ciORlKhhjKeysB7j1foXXHbxTcx_PeW_5m9u1ySIFMK6p2ojBfOuA_MafNjfnBvrxt6EnTjL2Ye8cvhRyGcR2A63G11F2mFesiN8VJBVmtoJBbO6frIhbmgoYzVauyaM_E2Ao0ddeJNjoHKJo_dp0Jz9bLx-MQ6v4Fq5IkxCZytnAhLyEpl6qbVWn4PDbqzyWrKsz-Vd9c_wB",
    location: "Monaco",
    price: "$2,500/day",
    title: "Private Yacht Charter",
  },
  {
    alt: "Adventurer sitting by a campfire under a starry desert sky",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4NNneXeR47MVW6PYI_VVfrTIRc_zR52zyEoO7o-N5KG1K-1-dADaAwpuQepsbr31DuwHTETK-I_sComrcw3U-HPGSaH1_waCYeKnBD9YzvVH3uqI0WjXh4jDAWGGWnxysrpJvdgg96a3B7QggLy9-MvRJMIRvy1BFXseWdOHm_e-w5lptHzoL_wqECmJiAfew5JU4IXbUSeTg5bdzg4ikqDTxU3CxDuwlm0d1Iom-PqGJDcEOhmIkpJoFGUrTnzUR8qPSf4nnPHX",
    location: "Wadi Rum, Jordan",
    price: "$120/xp",
    title: "Desert Stargazing",
  },
] as const;

export const hotelCards: readonly HotelCard[] = [
  {
    amenities: ["Spa", "Pool", "Tea House"],
    alt: "Aman Tokyo hotel lounge with dramatic city views and refined Japanese interiors",
    badge: "Zen Sanctuary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2VnyZVZJ0AQfrtFJoaP2ymemzfc7GPbzCJdyHf6Yl4iG_8d8DEiRXcwT9hh7OQkOyPhUP0X2jHVKp4iJ4yIS1v5w0D8ODJy9hDt4fIHYJutly0SlrBnR4iBtH7W5UPA5ZcpDa3nhWQAi7iIoL_UM1CV5P7d47WLymxK21UPBUv6d9CAYMZb4pIplkUoK10pykZ6dBvbACRjUeo35eUVrq0F47iQCfqPBYg5QqRkUoI4k9voW45azlYVtU7FxW8R4MTw_6dG6by5P",
    location: "Otemachi, Japan",
    name: "Aman Tokyo",
    price: "$1,200",
  },
  {
    amenities: ["Private Chef", "Wine Cellar"],
    alt: "Glass villa in Tuscany surrounded by vineyards and warm Italian countryside light",
    badge: "Editorial Pick",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkw-TrvS0JWahNeSAf6KTALx0u6Rrbegt31EcXVvHFPieRtl6V4vkxzCrPVPfr-uJdef8bDhsPQAAsmrOKPN9nEp--h-3RKSZMaaeTWeFJzHXxc4DPvu-TlMqNBuiRiokaMn9oaDpjZZzrHR6WPPDcbtqdvXYHqBg-F3i1A7EDk3LIaTBVWdOZbuJBOzyVc0R1lTwiIAbcshvds1h4fCvFvUkca_rU4umBUWHDPVZE5EiQiAmBGQ5ugcAhWYgdja275XacPDgfxQwp",
    location: "Tuscany, Italy",
    name: "The Glass House",
    price: "$890",
  },
  {
    amenities: ["Infinity Pool", "Beach Club"],
    alt: "White coastal villa on the Amalfi coastline with an infinity pool above the sea",
    badge: "Coastal Living",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAa3lRfjfM6KSoAh_7Tj-xyN8FJGR8pmF48VLXWmveHrPnd6FLPfh2X6sXCD8zhJ3wwFm1W2ESNyGwDL5wDEbl8clAIsKmGKTSS19vNKfnuBVLFO1wyijYSxKYR9Pu5AfkQfCKtUq14qLYquhQQh7V9s93j1uMAZKk2j7K1wQ7h43JmEdhYFHYGohhyPq3eJqTgBj2-bzVEfk3tCXM3O79N_ZHRiGzQfYK-KE4qgcgpdOrINdQKAHzjHBT5hqyGxFvb7vxZcyC1Bxmk",
    location: "Amalfi, Italy",
    name: "Villa Marittima",
    price: "$1,450",
  },
  {
    amenities: ["Stargazing", "Desert Spa"],
    alt: "Minimal desert resort architecture embedded in red rock landscape in Utah",
    badge: "Wilderness Luxury",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4w77Exy7SKE4NMElyN7GL4uI5FVE7jhIw7xYbZZ6b2iJrLPgDI5EQqJDqSWiq3uAUifwwk84K5MKms97qzFbKfqwB-SRXSpK_5MS3vAlNclgQ3s0T04eZlHeYV0QUNm01Xfu0q-d1Vemj7QVDTsGLrXzkwW5U4XcWHJzlk2yv2o5_ljTVynSM2PlLP1Zz06ShX8s3clFJgn6YUe8jmdCTkq8Ln-wR2TxKjFEN4mXoPjS6BBR1rBvfFNcslaKLoaHd2rTa2-FeL2o5",
    location: "Utah, USA",
    name: "Amangiri",
    price: "$2,100",
  },
  {
    amenities: ["Water Slide", "Observatory"],
    alt: "Overwater Maldives villa with turquoise lagoon, timber deck, and private water slide",
    badge: "Hidden Gem",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJobfkEYOAXGvJu_F0oRnLZJYZqLgRyDtVQraRwbpXsYOD5-tqPyPvIJk2mWwD4xlXvXdkoo8is-cGJwMsh3yrolNyZzeaHMbCUG5xWbTgcoYDvJTWZef4SCZ7UsrIKqYOtIlpZmYrrkNUhs4cfvCMOL7A-8oS_1VVJFuK_oY0FEo2E1p-1BvGOxF_j6DVYSRIMefSEWYhAjNOm0xvaarbJVsFa1-IzSBLv6VCSX5FYjc3xVWr-ciGCsNDiyU1_brubeMTUevO81il",
    location: "Noonu Atoll, Maldives",
    name: "Soneva Jani",
    price: "$3,400",
  },
  {
    amenities: ["Sauna", "Aurora Deck"],
    alt: "Nordic lodge in Tromso with timber architecture under snowy arctic mountains",
    badge: "Arctic Design",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9yFGIXbHbM3_PgxNu_YldUX0EvySl3_VNjsFVa8zFRuHddKABMuz9lzHbskv8t41oKrbSow_pBwoHdAM5Bd22kYdxY0x1wvTRh09vvp7hm64hh1zsKs1KSYmTgW3TgKGPtoWwfbR8Hr2PhN50_E3DjpwLkHo8fI_9E-H9XH_yhWZfvx7BUUENWJUvqXX77CWljtj4oezMiLcicZcBZEHiOL1pbfzRnmwxAKZF6Rbw_g_4-nRCt_vrUvUIRhAp9Fm8xyVyLjx4y8fJ",
    location: "Tromsø, Norway",
    name: "72 North Lodge",
    price: "$620",
  },
] as const;

export const shiningRiversideHotelDetail: HotelDetail = {
  address: "21 Ly Thuong Kiet, Hoi An Ancient Town",
  amenities: [
    { icon: "pool", title: "Infinity River Pool" },
    { icon: "spa", title: "Lotus Wellness Spa" },
    { icon: "dining", title: "Fine Dining Bistro" },
    { icon: "gym", title: "Curated Gym" },
  ],
  booking: {
    checkIn: "Jun 12, 2024",
    checkOut: "Jun 18, 2024",
    fee: "$45",
    nightlyTotal: "$1,080",
    nights: "6 nights",
    rating: "4.9",
    travelers: "2 Adults, 1 Room",
    total: "$1,125",
  },
  description: [
    "Inspired by the quiet rhythms of the riverside, the Shining Riverside Hotel & Spa is a masterclass in modern heritage. We offer a curated experience that bridges the gap between Hoi An's vibrant historical pulse and the serene silence of luxury wellness.",
    "Every corner of our property has been meticulously designed to reflect the Digital Curator philosophy—minimalist geometry meets organic textures. From the hand-woven silk drapery to the bespoke wooden furnishings, we invite you to disconnect and rediscover elegance.",
  ],
  gallery: [
    {
      alt: "Modern minimalist hotel suite with floor-to-ceiling windows and soft white linen bedding",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB21GsoqKKx0Ho0BKRmpmdnCfr3ABXI6nY_WBVSBfbHZUvL6L1E3m99v7oU2eOmstKpShtB2iCSCdB6tiR4BD9CbSkcejJ9Igk1chOtGkvf9f4TangclKXEg-lgbb7j-MwyuCvtor3nPbE3pFMpzsGIWb9NXUe--YvoA5JCbOPOqcfx0ETrNrWXxFmuSsM4yt1StPwIxu6A2wZN6bz3Ld-lo1QEAu0O7I13LbGRgTy_6sczPrXZQq82pR9RNJf3WG0g3YF_ToBVkjVF",
    },
    {
      alt: "Spa interior with aromatic candles and smooth stone surfaces for wellness treatments",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCff7rAe4l0jryyRuiFIKg5_KCxRYwQUIN8C8MsbY1l-UbM_hx6ycbtSj_6NzMmfueLwlUnuYffzoRzbHR5NVV9w9OeqR0mtBuO2J5E_u6KqjiRll91W39SkAg2NpI7eotadNE5ejXiPtMFl65uZvBxxrQP9Zav6_sKuDv6bum9JLB3VrTdHe1UP2K6RZhRfZP_ejxEd1XC8fpyry-u5cVamD-r_xoH-_6oPr2ERrESwioP6G83TZWegJbzrLQ4DDQmZANIRsrt8FKz",
    },
  ],
  heroAlt: "Luxurious hotel pool overlooking a tranquil river at dusk with warm lantern lighting and traditional Vietnamese architecture",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGgMhSZ7OI-OmQjgd8tjrgm-KQcTLyLE-EY2PSQ7CXpG-Ok8vTNcSknldM_atvqEHntRHqCFxzCFmliTe1QBQJs2cyBm2jNphWn3G-i0bxSyBuhkWZtSRk5DOX88r-asPeSxD8aAXDdaFk4LadiKSVNRivTcHXsRFBNXeDPAKl-LRURF36Tyx6QT-2yjcmrPrjOedZHAeHR_R-vpnT-VP0DROFmgqROULDThmgm2SIlpz6YlF_uE2EB5EAYA3Gawh8CCVjyoBI1fKv",
  location: "Hoi An Hotel & Spa, Vietnam",
  price: "$180",
  reviewScores: [
    { label: "Cleanliness", score: "9.8" },
    { label: "Location", score: "9.5" },
    { label: "Service", score: "9.6" },
  ],
  reviews: [
    {
      author: "Elena Moretti",
      initials: "EM",
      quote: "An absolute gem in Hoi An. The service was curated to perfection, and the river views at sunset are something I will never forget.",
      stayed: "Stayed Oct 2023",
    },
    {
      author: "Julian Wu",
      initials: "JW",
      quote: "The attention to detail in the room design is stunning. It feels like staying in a high-end art gallery.",
      stayed: "Stayed Dec 2023",
    },
  ],
  score: "9.4",
  scoreLabel: "Exceptional",
  scoreSummary: "Based on 1,240 Reviews",
  suites: [
    {
      alt: "Luxury suite with private balcony and river view, warm wood accents and neutral tones",
      badge: "Most Desired",
      description: "52 sqm • King Bed • Private Balcony with Panoramic River Views. Includes signature breakfast and evening curated cocktails.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCfd1tC4FKjvkqxNrvW0Jw4ewriC-7_L4UphTkT5KVVAOcTcbWiEpgSPHcTmVvHFoYFqwhy1MQ4cZlC4Kn3A3roUtKzAQhI4hfdOAc8btn2cMEyM90AVGwiZZ4SYAPetDzQScmneS8qqIwbDVSGOvjsfoktx6A5vnQZkQ4Kjkw2yqLeH4sbK4drVhEzlMbfjTXVvAM1MsGOmnPSa3swlqLcRCsQxIFG9eu8leMzwWSyLBjxG_KRT0bxquIC6ZAogdwunjZKQ7iI1oW-",
      name: "Grand Riverside Suite",
      price: "$240",
    },
    {
      alt: "Deluxe boutique room with king bed and artistic wall decor in a high-end hotel",
      description: "38 sqm • Queen Bed • Garden View. Featuring traditional Hoi An architecture blended with contemporary minimalist design.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC6jtrI-PeVmevZVU1rgmN2ClgxneGL6sny_ClhB6g7v0v9PhLrnlsjUhcDtLABSDYwAsvaQcXv306oGdi_CbisIYFvhZnBPG76YYZog_6ycVB68xkqq30QG7i7vHE_XHTTTkBRfcogVu-cwdODmS0Bxagx3Jy7onUCgsxQ01jhAEIPtRYlZNwG89wFHbGOq24s97PKpAcPHpfvGU3CgcAloqljsTEA53HdpJSCLkknM1f11iBpQpNa0RG_beuUkkxMwCIHRfwLIseL",
      name: "Heritage Deluxe Room",
      price: "$180",
    },
  ],
  title: "Shining Riverside",
} as const;

export const tourCards: readonly TourCard[] = [
  {
    alt: "Serene traditional Japanese temple in Kyoto surrounded by vibrant autumn maple leaves and soft morning mist",
    badge: "Featured",
    description:
      "Experience the quiet majesty of Gion, private tea ceremonies, and dawn meditations in hidden forest shrines.",
    duration: "10 Days",
    guests: "Max 8 Guests",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAh3hM7r7j1NqionS7BHcRlJzsFp1V-GSHIpS8gQ7Ya1nnAiw-GmjGETAI9cl6hetP0eqYDaKq3SSm6OP3maIQvohn2M7yiEwcRlWFHQHePA5kSu6ZLjekkfiAKdVeWw_9YnOiYvlCo7wYSTVb4deBDn4kZHqFUgovOn37CFLkhgOs1jOlo7g6VmaC2S9cbHNSLAKHinJGkjIJLRy6QcTrwPFtm-F2sEoWpjLTxptvP-bov11UwXCrJsYbnI6c_P_xAeYKeiYeIcdw",
    price: "$4,200",
    title: "The Soul of Kyoto",
  },
  {
    alt: "Colorful cliffside houses of Positano overlooking the deep blue Mediterranean sea during bright sunny afternoon",
    badge: "New",
    description:
      "Sailing the Tyrrhenian sea, lemon grove lunches, and private access to the villas of Ravello.",
    duration: "8 Days",
    guests: "Max 12 Guests",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAinWNPrC4lqPJ3oN3u3G_2Pw-POkdlA4DHDyBFc-uIWVEIYa-Va8GjfSzJQSWGXRFx4k_dHsK1HhzeCBO098yUXc__V26CnSyzkraTZOO2S9hJUIsiaWTeIuxQIFW9IhYtVdK9JFeAhx9MWfjKR4Oa_s8SrkaFu_OfM3KnSCF8zG9gdT8IpzXWgqEjU8mV5GA3El9avCFzM2DHiUOUulxtESHJTsGpTBTdqi9snG0Om230fqlPlBhA_aOx7RZAPHlcCYsuL4r5rtDw",
    price: "$3,850",
    title: "Amalfi Coast Discovery",
  },
  {
    alt: "Ethereal green aurora borealis dancing over a snowy arctic landscape with pine trees and a star-filled sky",
    description:
      "Chase the Northern Lights in luxury glass igloos with expert astronomers and local Nordic guides.",
    duration: "7 Days",
    guests: "Max 6 Guests",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_oUN-pn7cDOIZrdDeQw2HLHcNQfbxMUVF5vI3RsQ3D6naYHz11VK1pXaQlPV8CvM3XA6xWlzZPtKMxRBIBRsmlgTLnO47CjxqZzAsc2N3QK69n9vSCrp31KfOw6HocT7B0UmuYeth9G3b7zvHSq7RHhsXyW3ochgIsdoIWxhlG3987x_eKgZqq240ZE4Lp1rUud2qzrsGfHSAOQJ2V7M5CLO2jhbgGTyCnJfcJwVgJBECNTt2gETkE0_OQG1iwtiqsDy1eXIaBB6N",
    price: "$5,600",
    title: "Arctic Sky Expedition",
  },
  {
    alt: "Atmospheric Moroccan riad courtyard with intricate tilework, warm lantern light, and lush green plants",
    description:
      "From the vibrant souks to the quiet of the Sahara, immerse yourself in the textures of Morocco.",
    duration: "12 Days",
    guests: "Max 10 Guests",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeQ_kmK2F5wxmLTY05ai7NaxCtXI4lBIqpLJ2WeCCJL3z95N91zP0mDQde8Ej7Yrlz_07OJ_Vb37rXsr2dH3RXDsYwiKILqD9y0-a55bzhMW24I8KhN-_shWn0xaQb-SX0QV3-ckK0M6XcujdK3X7kb9fBkYJVSFcRw8RDriie4AoZ-ET2tK1vLJR7Xwq9WP3-fl_MxlaJXocwgW9YGHQnSM_fHWwTNpdujf2c9deWCJdT_ZTpXkjL7XVnu78braJkgvJHo1ChKJhG",
    price: "$3,200",
    title: "Colors of Marrakech",
  },
  {
    alt: "Luxury sailing yacht anchored in a turquoise Mediterranean bay with white volcanic cliffs under golden hour sun",
    description:
      "A private nautical journey through the lesser-known islands of the Aegean on a heritage wood schooner.",
    duration: "14 Days",
    guests: "Private Charter",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLY1AyZMOreX629e8pUe7p6gsbmfsf4dPC0E_5fAnyaWo3Rm8C5AxgcRTZZKHcxILKQ1IV9H4oDqyWJdObmWIlyYE0w0ZPWQKzor0b9RJ0kXNoFGOWx0WBPuf5JBd1As-yJJrHA-GVqAeSnz12NzxnU6C0a_BKZIc93ir5v3sDoZkinu7LScRmU5Ia2C1rCcxtond6DmerV_Yza2xQojaP8-FNetj_NX9GZ0w9mw10ivcEHLNaxtLk_LNBt8rk1j37-t52oqL0dpc2",
    price: "$8,900",
    title: "Cyclades Silk Sails",
  },
  {
    alt: "Classic Venetian gondola floating on a quiet emerald canal between ancient sun-drenched stone palaces at dusk",
    badge: "Featured",
    description:
      "Exclusive after-hours tours of St. Mark's Basilica and private dinners in historic canal-side palazzos.",
    duration: "9 Days",
    guests: "Max 6 Guests",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdE24k_Cg3TOIdsrAGbqLmzx4G1JFs6m-Q8oTaOgEPQEuYQgyEf8tvrtEtR-bi2gcjM47OjxyOcZ_c5fYwFqxUqxqEha0lN1_26b9PoM-bI9Eq2RCe1dxAC2jF7cEZbAcjVOv1Jr2wiGzWkmnFoan596iuV60kqwXb-P2UwRk3elUGC07h7j84g9Q1tcz84bjhNvH4UISjNDmuQtHOAMoDZgjCpsaJ5Jbksgc61TK4vwkLZNQue6j1Bz-Kw8nRic_c3csexBzaCXLi",
    price: "$5,200",
    title: "Venetian Renaissance",
  },
] as const;

export const bayMauTourDetail: TourDetail = {
  availability: "Daily",
  curatorImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCO6hgwLr6RPlAfgYckbAd0372VPXV9YlnGms5vfG3Irf19NpEcTKkcNzMMZNHuuVccd-7fvIKQw9zmMDZUdnlf39kvgvmPe_W-yyvVWLDqxcXkAHoJPBVqBcmo1-HmaBuQoOhx-7y3ND_K-MryYRN0fFj5BR-QAAWLxBhYHHO8yYo7_5Uwx2EbjPicbWixkeOI0t63H3AffIDHGgbjneL7DXstoVz2sXQ1xhUD6e3-2ZVavsJPJM04J-0YvUKCDhrD3yrjFBx-NNCh",
  curatorImageAlt: "Portrait of a friendly travel curator with a warm smile",
  description: [
    "Nestled just a few kilometers from the ancient town of Hoi An, the Bay Mau Coconut Forest is a living testament to central Vietnam's resilient spirit. This lush water-palm sanctuary, once a revolutionary base, now serves as a serene escape where the whispers of the Nipa palms tell tales of history and harmony.",
    "Gliding through narrow waterways in a traditional bamboo basket boat, you will witness a way of life that has remained unchanged for generations. The forest isn't just a destination; it's a sensory journey into the heart of Quang Nam's fishing culture, where every paddle stroke uncovers a new layer of local charm.",
  ],
  duration: "4.5 Hours",
  exclusions: [
    "Personal expenses & souvenirs",
    "Gratuities/Tips for guide and boat rowers",
  ],
  gallery: [
    {
      alt: "Local fisherman steering a round bamboo basket boat through emerald green water palms",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCr79JyNhGpRGY2dzyQ4vV16J-_bsMGPhPoDAbIg1FW4Ox8Mw3SV64V0D_qirA5VxO_C3EPf2z2v4oq2da_-ALjkA5pw_ElXYRJKWLfLR2xcd-GT1pnNklrgtTXYweZ6Hi7t0FJ7ueXx-NxcWCTTcYctpzPWi463g3UcI_BWUwElzU2TUxN_GWEjlRcxibqUmccvbm7COeC3BIeG9tMqFGK-aqfYbts8qdvolxDzzdHZvjIQjnu-UpDNca-JwystJmA9t3BFwO5en_Y",
      layout: "portrait",
    },
    {
      alt: "Traditional Vietnamese food served on a rustic wooden table overlooking the river",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBjeLWHnE8uEOvXFNdIbXI9wg0xTKQJepIg4FIDZAj8uhaVjpT04oDld7EdTdvSeUuQ8BjiY1vsR0fXiyV8Iuay5qoNH0Y6UUTMyECXTDTpCNYhPEu4hZ-UK9z0Q0bcnQASXBgLWq6E6gOZs_VsiL4yCMJxlr7yoxAt-MBnfUFlqFpZKyeC5YbQsAPoUhcYxdbXcjcjvHdr3GIdszLCy9xACsWxSGTlCve-DgGDwfbhkFVVxrWQUF5Y3fsoF-nXSt4lkkv_tNWo3uqd",
      layout: "landscape",
    },
    {
      alt: "Hoi An river at sunset with golden light hitting the water palm forest",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDmalpnJYjBnu7k4K8T2LRsFqdWVj5Cc0NQhcKfFsUqG5AF74OsqtwC7qDznS2p7ahIFVyO70lWaAul9PXGKAvk0zGH58KXJf3tuu-GkX96kMxYP0D-L5vTc2UwNMpn0Ga7onnrJgmxO26JlSojqgIjTc2YLByC39nk9r0zN6utacJEaPA2UIiZUnQouLGZQtzKGJQJUPM90atcdquHLDXAVNcF8zJyJm_HZcHUaq4T4N_cffmLGQmzOaKpjAOkNhz_IV378xLHYbBR",
      layout: "landscape",
    },
  ],
  guests: "Max 12 Guests",
  heroAlt: "Aerial view of Bay Mau coconut forest in Hoi An with lush water palms and a basket boat at dawn",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAo8noBnaTnSEeA4yEz0-rRKslv_QVN8t2mju5icPgeLY6q1BmMoShJ0UXUm6Vfqo-D0zU9klXK2kSX1sxKDZol5QhrB9BcgGAPUw20oMRbce9ZnOdxjsK8xHWtbx5IcBo614vxvjdT7wLQ1solZ6LOA2vVCYnkfse4EHKrApJkiNev4jN2RplpEW8QmBSkpOqZsxZn9ODmYJF-equyV8HGfUCkbfpxggUAQDfHs1S2YHYk9rIU0vSt3DmzsJneWbUcovmSNVt1GWza",
  highlights: [
    {
      description: "Navigate the waterways in an iconic circular Thung Chai.",
      icon: "boat",
      title: "Bamboo Basket Boat",
    },
    {
      description: "Learn the art of net casting and purple crab fishing.",
      icon: "fish",
      title: "Traditional Fishing",
    },
    {
      description: "Savor authentic Hoi An flavors in a village setting.",
      icon: "food",
      title: "Local Cuisine",
    },
    {
      description: "Immerse yourself in 7 hectares of pristine coconut palms.",
      icon: "eco",
      title: "Tranquil Scenery",
    },
  ],
  inclusions: [
    "Round-trip hotel pickup in Hoi An",
    "Professional English-speaking guide",
    "Bamboo basket boat fees & performance",
    "Authentic local lunch & mineral water",
  ],
  itinerary: [
    {
      description: "Morning departure from your hotel in Hoi An ancient town via a scenic drive to the Cam Thanh village entrance.",
      title: "Pick-up & Arrival at Bay Mau",
    },
    {
      description: "Embark on the iconic basket boats. Enjoy crab fishing and witness the thrilling spinning boat performance by local masters.",
      title: "Bamboo Basket Boat Experience",
    },
    {
      description: "Join local fishermen as they demonstrate the intricate dance of net casting on the open water. Try your hand at this ancient skill.",
      title: "Traditional Net Casting",
    },
    {
      description: "Relax at a local waterfront restaurant for a family-style lunch featuring Cao Lau and fresh seafood before returning.",
      title: "Local Lunch & Departure",
    },
  ],
  price: "$45",
  subtitle: "Discover the tranquil rhythm of Hoi An's hidden water world through ancient traditions and emerald landscapes.",
  title: "Traveling to Bay Mau Coconut Forest",
  type: "Small Group",
} as const;

export const contactPageData: ContactPageData = {
  departments: [
    {
      email: "press@curator.travel",
      name: "Press & Media",
    },
    {
      email: "partners@curator.travel",
      name: "Partnerships",
    },
  ],
  directLines: {
    email: "inquiries@curator.travel",
    phone: "+44 (0) 20 7123 4567",
  },
  heroSubtitle:
    "Whether you are seeking inspiration for your next journey or ready to begin planning a bespoke itinerary, our curators are here to guide you.",
  heroTitle: "Get in Touch",
  map: {
    alt: "Monochromatic aerial map view of central London highlighting Mayfair district with minimal roads and subtle green markers",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBK8BOtOyuXmTFyUDB3bDWHhCD7RlwlrVjeUBz4mPbkNXItAPPI3Dpd4HWqcwhJ3JjMzHXo9P14Lsp6cSQpsL5I4C8XiNxA9M8QxUtrZ04tG84vWt1hZv__6wzy3SmD_G8pNvQmqkywvLxQShcM7s_CRZVYM5xLGxsC2oiX8d19yIgwJQTIQ2nIKSIlmX7THI2XP7QoMan9aEDzUog3906H-evWqxd2qN_rgzW7vorqyjijoRRZYeohglUJ4CwrZo_uR8h9pbv-UYwY",
    note: "Appointments are highly recommended to ensure a dedicated curator is available to assist you.",
    title: "Visit our London HQ",
  },
  offices: [
    {
      address: ["15 St George Street", "Mayfair, London W1S 1FH", "United Kingdom"],
      name: "London HQ",
    },
    {
      address: ["234 Gionmachi Kitagawa", "Higashiyama Ward, Kyoto 605-0073", "Japan"],
      name: "Kyoto Atelier",
    },
  ],
} as const;

export const aboutPageData: AboutPageData = {
  cta: "Your next story begins with a single step.",
  curators: [
    {
      alt: "Portrait of Julian Thorne in a linen shirt with a thoughtful expression in soft natural lighting",
      bio: "Specializing in coastal architecture and the revival of ancient trade routes through modern sailing.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCh3zIh9tjYnEjOJBdewGLYn7B5Vvg3G8bbH4tAyLu1qcl_jItkcc7V_sz6GYuPSgUxNZX-jO75LacMhXzUkaQcAvy44fV_wL7-JLiQ6ST4btHCPc4QPpi-q2fn7ESzdnqCkz1XFmhhubV9V67vwIENxWlo8NMpfwmZUEUYhfodnVmqxFpNKmSN6E-SANeMuvKdEqWWKpi9bEawfxB7aI92yMDsHaXpHkiQAclyPOmlF0aLw4KN9kdHAH2CtivjzBYk_72nIm2qPe1v",
      name: "Julian Thorne",
      role: "Lead Curator, Mediterranean",
    },
    {
      alt: "Portrait of Elena Moretti wearing elegant minimalist jewelry in soft studio lighting",
      bio: "Former food editor focused on farm-to-table narratives and high-altitude vineyard experiences.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAyAorTPXx5yaRYOdbyM2PXqPQ4QkmdyjcpK6YT0ZrdVn8kg16Ww8wUMFIPQGjA-sTB5gvuwAEAG_8pjFurOM6Ty7USliNyESgAXkOKRKrLYypuJHfwF-AtFctTJyCjO5xVuqMuR4xDT-H64z_YzoD9iXPacbGvd2tSQ7K7Kvml9At7CZorRgMvvMVFga0ywGGThP1sRZPeV_4dzVEs8zKr4G7QzOTMq-JIXQfxLZXQMtnk4o5cyDNl-_snIFymCcObifrBrVxSGjaa",
      name: "Elena Moretti",
      role: "Design & Gastronomy Lead",
    },
    {
      alt: "Portrait of Arthur Vance with salt and pepper hair against a dark dramatic background",
      bio: "Expert in remote wilderness logistics and conservation-led safaris in sub-Saharan Africa.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBh-ni6k2_WdHAYT10wFQiOA0l5cNCK1t5CpCToaFonOUR9pHU7ED_eowZpGQ2j0ieFyWjsShS2K-Xq-fJkv8K8_331XFQfcn-324RXVMuV2VgEvO5-KJ6c6cvcZ9PJARM42xuRtCIK02ZWlh64czFd1mdjopbep_uzUeAZb_0-rcYf32vq3xE0DfdgNXdSkmykQY_9uKwtPH59-bfMZL7ErIiCdBtvFD0HcerNCQPeMd2Nvt4Vm6DM9eRVpVn7ewW0JO5OEfDNUQPk",
      name: "Arthur Vance",
      role: "Expedition Strategist",
    },
  ],
  heroAlt: "Minimalist modern architecture with clean lines and soft natural light hitting a curved concrete wall at dusk",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwCd5zDFsd4-N8eembqGgjXKF1TxQGvWCsOZ0qvDl1yzpXYX6rWQNM65wgxIrCcJLdnstMGfWTEi_JbDP6M2PeGVVvqNLE7LPcvfa9O00jLlo5U5m48bqO--JTl0pItnrz2fcuojMSPpDeImaIdxarVeLimfoJM5WhFsAH1QOEU63xoKrPL-HXa5cPw8iyKzqvyMnCU-R3f9wxD0hqgQkab1H9-OR_OWt6XqvVrK5DEDdKFtXajk3YDcq5h82BzfgTJYx4EL39oU59",
  heroSubtitle: "We transcend the ordinary to define the exceptional in modern travel.",
  heroTitle: "The Art of Curated Journeys",
  mission:
    "To provide discerning travelers with access to unreachable moments through rigorous curation and an unwavering commitment to quality over quantity.",
  philosophy: [
    {
      description: "We believe the fastest way to understand a place is to slow down and listen to its quiet rhythms.",
      icon: "nature",
      title: "Slow Travel",
    },
    {
      description: "Our footprint is light, but our impact on local preservation and artisan legacies is deep and lasting.",
      icon: "leaf",
      title: "Sustainability",
    },
    {
      description: "No two journeys are identical. Every path is hand-drawn to match your personal intellectual curiosity.",
      icon: "sparkle",
      title: "Bespoke Curation",
    },
  ],
  story: {
    alt: "Vintage leather travel bag resting on a marble floor in a grand European hall",
    body: [
      "Founded on the belief that travel is the ultimate form of self-curation, CURATOR emerged as a response to the noise of mass tourism. We saw a need for a more contemplative, editorial approach to exploration.",
      "Our journey began in the hidden valleys of the Alps and the quiet riads of Marrakech—places where time slows down. We spent years building a network of artisans, local historians, and guardians of culture who now form the backbone of our exclusive experiences.",
    ],
    heading: "A legacy of quiet luxury and intentional discovery.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAS_S5nNqaU8yMF0ysD2eQ4Qs_LGTJP6ZsKCLSHuXO9m2ygKAzdFM4tF_RYiFQ19Q6ql2OhnGJojdtlaVwxpo00yyYi2zOt4wklqIjKBFDJfJj4KytpbgCvlZzsGpmBTjOxGOyQtOJIj53S0y-4hxHaO7iraF5WtOFtbs_hr_DftY917kVUw_aP9CbGliX4aEdkhSp-kuA9_golHY81jjdKvnmllZ3X-OZ4vdiN_1HSaeJkC5eER7ex3SW3Tzur4oSDs7s4RXp9GhyS",
  },
  vision:
    "To become the global benchmark for sophisticated travel, where every itinerary is treated as a masterpiece and every guest as a lifelong patron of the arts.",
} as const;

export const kyotoNewWaveJournalDetail: JournalDetail = {
  author: "Elena Rostova",
  category: "Lifestyle",
  date: "October 12, 2024",
  heroAlt: "Expansive view of a minimalist modern Kyoto machiya interior looking out into a serene moss garden",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBRuQr9V1acsG1dEc5Q9cmO3EjhyGN8Z7OcrTc7hjGCi0jkvscmHhqcCPQdTuHnbYAIl-cD_Dwkm2MTuuacNL0eCdwUlRnPeS00GrA0l6wbI3wsTiZvIZPV7JA5ESUDtAP5I16POUfdZBmWKgtK9H8G2-Fv3eP94J-0s9TMBuQEJFnKD7e07OxOJSr7R1Cn2yyax8znYcGClWN9eufw-3C3O-t0aIkCxIasqotuyA_qyMy1D2XDMZjMtC09ULW2p8tUehLRXMqVluEv",
  inlineImage: {
    alt: "Close up of minimalist interior details in a modern machiya with light and shadow on washi walls",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBls2C-L5hEObg2-_cGKtAAQj412i7FCtkIgOVaXv_z1NK2G16oicKa0j6z21m_fHJ0yLGdnMh1Sab9Mmx5wbrByvKyD_0l8Qle18rZMgb9w98a0_YfzQ9cPI9QPoTrwNfAcYH1pWPou9o_5Tp4w6CGpd5tLXShNAqhtKIRY_M0MzjB4-HtlrZ9spcoisxmaFG7GnA7gmX09wCZrgZCCgRYUbREWbuG8jwhbFBbqzI1xIcKO1uB7FLKFa_-17up2uH53lJPdyt4yGIZ",
  },
  intro:
    "In the heart of Japan's ancient capital, a quiet revolution is taking place behind unassuming wooden facades. The traditional machiya—wooden townhouses that have defined Kyoto's streetscape for centuries—are being reimagined by a new generation of architects who understand that preserving history doesn't mean freezing it in amber.",
  meta: "8 min read",
  quote:
    "We are not designing houses; we are designing vessels for shadows. The beauty of a machiya lies not in the light it captures, but in the darkness it holds.",
  relatedPosts: [
    {
      alt: "Minimalist cafe interior in Tokyo with concrete walls and warm wooden furniture",
      category: "Design",
      excerpt: "Exploring the brutalist spaces housing Japan's emerging contemporary artists.",
      href: "#",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6PBa25g4IGnTnhQksQnprLGt00mqSSBSUf5oLrXhR5g4PIMgNF5hpq-q0e8wnqS7_7w1y7aKfH-wnFVsQnvgzK0LHVvlykveGbUpfSJeWd1rb6v7FHsT6lj9V4u9__7RzT0gspyvXJSoPRDLzklcaFdkL2ysGkHkSBqTso-8-wOfO5cEcYyx3yE_j57K66BnpRJ3DTKU1jDh2gnyftSUD5sjjqCCsvviQmpC2B1VQG2-bk02zyq2chw2fXVsWW61k0ZOzrJyUu5HD",
      title: "Concrete & Canvas: Tokyo's Hidden Galleries",
    },
    {
      alt: "Hands preparing matcha tea in a traditional chawan bowl with bamboo whisk",
      category: "Culture",
      excerpt: "A modern interpretation of the traditional tea ceremony protocol.",
      href: "#",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBaJ_7cRSaRnFNHfj9qNmpWM0t98cyvRVWWhYwBFRfhes8n9ogEOfA01hzJ6URxH27MvQef27Dx-d1pDMdyQ13UsXtR86ZTqhKR73GzqzxFyoNFaX0QnWpGuOq_brKt6SPF4KiBWdTgI8hlb82S0QTfn-2xZMQn0ju9pfTUSPqpCUMYpVYKsdpH1_GP36O8644iGbseRBMWg2-dwvIRxL8nO8yhByspaMjp1syFMgVEYH1Z6U288jLOJ6J-Xu2ttXuRNTa7IZ6UxdLY",
      title: "The Silence of the Chashitsu",
    },
    {
      alt: "High-end modern ryokan in the mountains glowing warmly at dusk",
      category: "Destinations",
      excerpt: "Where barefoot luxury meets centuries-old hospitality traditions.",
      href: "#",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC7zHzYdF26we3kp55ckeQiXcd53Ey1UG4Idfoyk25-ryyX_imAmqZGkj-bXZOln5wBrv9_fzaW15LpftbPhBKU8W_Y2S6JC2HOlgd1aDws3bJ_KpwhJhb-CozyctlUJETFTgtTGm5ouGGfllJb0bD7406ZXreCScp3x4SDNpaYLtlB_yCe-l5bjsCkGnqp_WUn5ArVe2ZoNC2V1I4LKe_SMOSFgLNFBjj-32rSSDnd5P2GEQQJb2qmE9-V4luOCcqO3VmRMo8ikr4W",
      title: "Redefining the Ryokan",
    },
  ],
  secondaryFeature: {
    body:
      "The tsubo-niwa, or pocket garden, remains the spiritual heart of the home. These tiny outdoor spaces are no longer just visual amenities; they are integrated into the living areas, separated only by retractable glass walls that dissolve the boundary between inside and out.",
    image: {
      alt: "Small intimate tsubo-niwa courtyard garden in a machiya with stepping stones and maple tree",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBF1cV9Ws3lkIPRwFlQ73Vaqju9gA83yj_lyfHXZApdY0an4Nuao6GzUF_OEc33Y2F7mT6LccfOWnMYeWgZqVZzQQSLdTf-S5K7d4F8WLM6UHybkiJJXLPCqteOpQr8y2G5SRViGFTHQmSq3Mbr-0e8I2UEMb_pxi8On4CPbfIH2_7Zm1Qq-HVyjTKNb2W_y5jgO5hpPwJ-xf2AUvB7gidhFvQGHhnoGUgenqroF0q1qw_syv6giJKspuwow4_mYVmRu7lBZsPsRAOC",
    },
    title: "A Dialogue with Nature",
  },
  sections: [
    {
      body: [
        "Walking down a narrow alleyway in the Higashiyama district, the scent of damp moss and aged cedar lingers in the air. From the outside, these structures remain dutifully respectful of their Edo-period origins. Their dark, slatted wooden screens protect the privacy of the inhabitants while allowing dappled light to filter through. But step inside, and you are transported into spaces that are radically, breath-takingly contemporary.",
      ],
    },
    {
      body: [
        "This movement isn't about sterile minimalism. It's about culling—stripping away the unnecessary to reveal the essential spirit of the structure. Architects are removing drop ceilings to expose massive, century-old roof beams, creating soaring vertical spaces that contrast sharply with the modest exteriors.",
        "Materials play a crucial role in this dialogue between old and new. Hand-troweled earthen walls sit alongside expansive planes of structural glass. Traditional tatami mats are often restricted to a single, elevated tea room, while the main living areas feature heated floors of polished concrete or rich, dark-stained oak.",
      ],
      heading: "The Modern Machiya",
    },
    {
      body: [
        "Ultimately, the new wave of Kyoto architecture is a masterclass in curation. It dictates a slower pace of life. When your home is built around a single, perfectly framed view of a Japanese maple changing colors through the seasons, you cannot help but pause. In an era defined by noise and clutter, these reborn machiyas offer something incredibly rare: architectural silence.",
      ],
      heading: "Curation of Space",
    },
  ],
  title: "The Architectural Poetry of Kyoto’s New Wave",
} as const;

export const featuredJournalPost: FeaturedJournalPost = {
  alt: "Cinematic aerial view of misty peaks in the Dolomites at sunrise with soft golden light filtering through clouds",
  badge: "Featured Experience",
  category: "Guides",
  excerpt:
    "Beyond the summits and the crowds lies a stillness only found in the high pastures. Discover the art of the mountain retreat.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCjEilV5ijEcmUukPgp-b6F7YJlyJYdxmirbXRdF4EVtN2CeiMf0qqcuvmXgyEwb0IlyEoQvLawfkBERhVv1ILNYkY7yAt9yMLR18P1wNyqn_XjXH6Jo_ljhEwcZc0vQMgqBCoxKbaMKmT9jmu6UZZrE2ZZuRMTRTQYAX2Eclkt0nm9ePZPUXahqVtnw_8a1IjVHp4hjbC_kUHgBjF-T_yks0wnwcum9YgwAEODGnMSM-SQ-frDFeES7UaD--2IaSQIu2x1RRPzB43_",
  title: "Quietude in the High Alps: A Guide to Slow Living",
} as const;

export const journalPosts: readonly JournalPost[] = [
  {
    alt: "Luxury boutique hotel lobby with minimalist wooden furniture and a tranquil zen garden view",
    category: "Lifestyle",
    excerpt: "Exploring the intersection of traditional Machiya craftsmanship and modern Japanese minimalism.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmUR09gcLKQXQD3v1dwW5JijykjrL_5ADrEUhxW8rj29jHiZlR-osKYY2QisWHeXgFK7mZf14NfvNxmTApEHboWzhw2S30z3K7V4pIv5_TbPJezTkxFbUZpP7qGSttQxdElVmMWX0kUG7_K7FUS01lX3TPModHIAr92wFZTPNvL11tpCaR5iQ0H04qtm4I_pwlXdEcpLGr2YCzyTxqR6ZoaDv6q1AVJbCxYHgu9bbFykarPtR2h5D9TyCl55G_7vRJQaug-F9mtvlU",
    title: "The Architectural Poetry of Kyoto’s New Wave",
  },
  {
    alt: "Serene beach at dusk with calm turquoise water and a wooden pier stretching into the distance",
    category: "Guides",
    excerpt: "A guide to the islands the ferries miss, where time slows down and the sea is your only neighbor.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDILeAsW4OgERgPuy2PZWDVw46nIU-MzpCdf3dwWtzpseHQUUpEHdZRRXKX5VOzFa-EOlzsvARVxg8rqL2RpuOoqrU1Te1m6fu_GW6jt-cm5QPJIXPRkz_0EFrf0DfRWY-oFvMJyLYoyRQdZYyyEx6gQRVcJ6QjBKH4pnFV0dhk2KomIJLkJuo6zctnOmNXtgtlC_IraVSBdOMYLNHB7a5puY12n63BfCgm67az9SXG8f2JbD3SydiL7nO9LYIIwQmE5WHFeC25o1Uy",
    title: "Uncharted Shores: 10 Secret Islands in the Aegean",
  },
  {
    alt: "Elegant Michelin-star restaurant interior with dim lighting and artistic seasonal plating",
    category: "Interviews",
    excerpt: "Deep in the Nordic forests, one chef is redefining fine dining through the lens of ancestral techniques.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnPNaXOSFDod5vxZiqHmcJwf7K78krYMtaqMhtkCec652MnwByQZGThoCJ5y5SITZcMYlEHM4qllY9ryceASGjdtS19p7BafVtoqRBakHdKNyAKJFg7wQ2MnUcKbZYkJ4JDib0keBi0tTuVGv7grWlOherU05el7rOpw7sdcJYn5Tn7z6ahsmOJlmRRuKeAKb0W3W--yJTGV_40g1JsN1tAbtPvKsU4IOl-krpg7xR3lfT6ntQ-XzAttx9cXCUpCU-crs6Ek-uV-wL",
    title: "The Forager’s Table: A Morning with Chef Elias",
  },
  {
    alt: "Colorful hillside village on the Italian coast overlooking a shimmering blue bay",
    category: "Destinations",
    excerpt: "How to capture the iconic coastline beyond the postcards, finding beauty in the blue hour.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2KETuJOlX2X6FztepyDLXz28gJVP2cQcdXB3NBQMu7ebEwvZWelHL05u3KvSYzD6NcxCSpsNCvp6ExI8RJJ17waGRfbfq97CD7jolpkqQvnUNqcXg5aCFh4vZxMXF8yGnfiX7fS43DjXpVnk9iP0o2hP5J5CQCCEij3iZ-rp6J0hnzo4mhXFZ0l96n35vb7W0LkCgrxaDG5cCB0iqyLyiVr7VBscL5mFpteN7kixgI72kRE78p-2FLDVjSaeRAWMj-Aosb3KjbyxP",
    title: "Chasing the Light: A Photographer&apos;s Cinque Terre",
  },
  {
    alt: "Close-up of ornate stone carvings on an ancient Balinese temple covered with tropical moss",
    category: "Lifestyle",
    excerpt: "A look into the daily spiritual practices that make Bali the world's soul center.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkNoLkz909CdUmnC48HsedLlmuhDWs3l51b2S24hup4VlaVj05LxoqtXOWuYNiuO-XIZIAmLe_KElfxtfxUtv_vNIQDFg40a3dMR-uhSrDeyieC_GfWMS6nJP_8liks3ngmf6bqH40iEGBeGAFtfJteeLweNi4PUhnLvi7nqAiPXztvD01SFwN_DUrIVOfi2pXz1U2J3vvPhmq2G5UtD3X-j5toGaT2LlFuOoK7dEdfpjhG5a1JuYkDpIcqM5OepQEX0yblSI_yNuO",
    title: "The Rituals of Ubud: Morning Prayer and Matcha",
  },
  {
    alt: "Modern minimalist house in a sparse Scandinavian forest with black frames and reflective glass walls",
    category: "Guides",
    excerpt: "Practical insights into living and working from some of the world's most remote modern cabins.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ3gBlef1AFAJvhbFVJENEv63YS0Ig_66o1WoC9DEvFYtLispzItxQER9gvoAiIyGjvW2WfZHfJ3kCqCapRYPuD2IM4I5lVlwRuBQ-W7fqT8dnhEtfM78SJaL2pMCDumVTVa0Bw0izwvFE_ixzx5d5iWVznQeECA6e4tR6GQMr5H6v-VhAhIjEJKrE7GNNwaIAtVxD5Du0dbl-4KHrfLJ5YBHcthXdJxM1L6H5Zb3HAKlie_tBpGVaChVwFpSUnCNMWsVBpMCII-3t",
    title: "The New Nomad: Designing a Remote Life in Sweden",
  },
] as const;

export const blogPosts: readonly BlogPost[] = [
  {
    category: "Slow Travel",
    excerpt:
      "A deep dive into the quiet neighborhoods that define the soul of the world's most vibrant metropolis.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtt0oAPt9XMzwKJnSHhK7PcgWbJfRDVqVk6mjPhH2rCG8YpEX5SxQZC2R2T9bT-9mHvJWNQyynnK1QHcLJte8qLPLK2KbdMzQ11gzUG4IMy6eq0KGl_CbjVXUL6X3W7Vts1TseBCB6Co3h4Nf0pcKM0FNJX4RO6JOxQVCkqjunkrHRZCEwn44IYcIgtSk0KLeM8AJZEINdMWVxoRfVwTR_4XlnUvI7uoHZp5IJlMR7mR9byLrRP4_uZhkpYNZnW1JIqzgeg1M1MdlM",
    title: "The Art of Getting Lost in Tokyo",
  },
  {
    category: "Adventure",
    excerpt:
      "Why the Italian Alps remain the ultimate sanctuary for those seeking silence and scale.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDwT8WT54Ej4puGch3RH38le1A7QZqNXe2UEHzVendx3EpQxBDW1q35Qepftc_SXwGdx9hT-jPNNBZMpyr_LFwCnb1g2AJckK7bsd1esGEU3RDpDJEycIL3dJsDW4iFvDeZomGQ9OBkG5Wnifbax-UnHnkgfea7lXl_C0tCIuX6ZQxwb0CpiRCBDfpxRPw8XcJBe1WG8pr0jplWz1bNOKgkIODiro7FbuZxyGK-SfY3E6ENOb2OzVUYtuXoXY1Gk55OrvTEpw9NPQ",
    title: "Dolomites: A Vertical Symphony",
  },
  {
    category: "Lifestyle",
    excerpt:
      "Our curated list of hidden culinary gems where locals go to escape the tourist crowds.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOG1GqkAafE8BPlrfHvv_BNKHOGgQCF45XIqo08tfmbX3XEv43HnGBVNOYzbHin8voUJMmbAzNAVSXB5Yyw0QJ9ooQBR28QnH-l6PpoNCCVnP1E4wG4a6OhBUhiF9UaEdON6PZpFXxOsM5vno4-_VkJ5mimmWf6QLtRaYMK210umzVOVXyu1P6k1m5uG8sZHuRqc_7FZlmMv1eOp7YjlRA-miXbRIXJAGmxWub8X3OJy-8_JX0cvDXdlZavvHfwXj1RokPilnI5IkG",
    title: "The Best Parisian Bistros of 2024",
  },
] as const;
