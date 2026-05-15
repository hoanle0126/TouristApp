import type { VisualDiaryItem } from "@/src/types/travel";

export interface SuggestionCard {
  readonly alt: string;
  readonly category: "destination" | "tour" | "hotel";
  readonly href: string;
  readonly image: string;
  readonly location: string;
  readonly price: string;
  readonly title: string;
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

export interface CartItem {
  readonly id: string;
  readonly alt: string;
  readonly date: string;
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

export const navigationItems = [
  "Home",
  "Destinations",
  "Tours",
  "Hotels",
  "Blog",
  "About Us",
  "Contact",
] as const;

export const travelTopBar = {
  email: "inquiries@curator.travel",
  hotline: "Hotline: +44 (0) 20 7123 4567",
  note: "Private itinerary support, 24/7",
} as const;

export const travelPromoBar = {
  cta: "View offers",
  href: "/tours",
  label: "Travel freely without worrying about the price",
} as const;

export const navigationDropdowns = {
  Destinations: {
    eyebrow: "Suggested escapes",
    items: [
      { description: "Heritage streets, blue shores, and the easy rhythm of central Vietnam.", href: "/destinations", title: "Da Nang - Hoi An" },
      { description: "Mountain air, drifting clouds, and quiet villages in the north.", href: "/destinations", title: "Sa Pa - Ha Giang" },
      { description: "A tropical island made for longer, slower stays.", href: "/destinations", title: "Phu Quoc" },
    ],
  },
  Hotels: {
    eyebrow: "Featured stays",
    items: [
      { description: "Beachfront resorts with family-friendly comforts.", href: "/hotels", title: "Beach Resorts" },
      { description: "Boutique stays near old quarters and riverside walks.", href: "/hotels", title: "Heritage Stays" },
      { description: "Private hideaways designed for honeymoon escapes.", href: "/hotels", title: "Private Retreats" },
    ],
  },
  Tours: {
    eyebrow: "Popular journeys",
    items: [
      { description: "Northern itineraries built around culture and nature.", href: "/tours", title: "Northern Vietnam" },
      { description: "The easiest heritage route through Hue, Da Nang, and Hoi An.", href: "/tours", title: "Central Vietnam" },
      { description: "Waterways, city energy, and island relaxation in one sweep.", href: "/tours", title: "Southern Vietnam" },
    ],
  },
} as const;

export const heroImage = "/thumbnail.jpg";

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

export const suggestionCards: readonly SuggestionCard[] = [
  {
    alt: "Minimalist modern villa with an infinity pool overlooking a vineyard",
    category: "hotel",
    href: "/hotels",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkw-TrvS0JWahNeSAf6KTALx0u6Rrbegt31EcXVvHFPieRtl6V4vkxzCrPVPfr-uJdef8bDhsPQAAsmrOKPN9nEp--h-3RKSZMaaeTWeFJzHXxc4DPvu-TlMqNBuiRiokaMn9oaDpjZZzrHR6WPPDcbtqdvXYHqBg-F3i1A7EDk3LIaTBVWdOZbuJBOzyVc0R1lTwiIAbcshvds1h4fCvFvUkca_rU4umBUWHDPVZE5EiQiAmBGQ5ugcAhWYgdja275XacPDgfxQwp",
    location: "Tuscany, Italy",
    price: "$450/nt",
    title: "The Glass House Villa",
  },
  {
    alt: "Luxury eco-resort in a dense tropical forest",
    category: "hotel",
    href: "/hotels",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJobfkEYOAXGvJu_F0oRnLZJYZqLgRyDtVQraRwbpXsYOD5-tqPyPvIJk2mWwD4xlXvXdkoo8is-cGJwMsh3yrolNyZzeaHMbCUG5xWbTgcoYDvJTWZef4SCZ7UsrIKqYOtIlpZmYrrkNUhs4cfvCMOL7A-8oS_1VVJFuK_oY0FEo2E1p-1BvGOxF_j6DVYSRIMefSEWYhAjNOm0xvaarbJVsFa1-IzSBLv6VCSX5FYjc3xVWr-ciGCsNDiyU1_brubeMTUevO81il",
    location: "Maldives",
    price: "$890/nt",
    title: "Azure Bay Resort",
  },
  {
    alt: "Luxury yacht sailing through turquoise Mediterranean waters",
    category: "tour",
    href: "/tours",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLmxLbLp9No_ehZTLqY_5nrYVKNIbcsUFHvN1FUo4YsJpn4BuuGJVhtps750yfqY0ciORlKhhjKeysB7j1foXXHbxTcx_PeW_5m9u1ySIFMK6p2ojBfOuA_MafNjfnBvrxt6EnTjL2Ye8cvhRyGcR2A63G11F2mFesiN8VJBVmtoJBbO6frIhbmgoYzVauyaM_E2Ao0ddeJNjoHKJo_dp0Jz9bLx-MQ6v4Fq5IkxCZytnAhLyEpl6qbVWn4PDbqzyWrKsz-Vd9c_wB",
    location: "Monaco",
    price: "$2,500/day",
    title: "Private Yacht Charter",
  },
  {
    alt: "Adventurer sitting by a campfire under a starry desert sky",
    category: "tour",
    href: "/tours",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4NNneXeR47MVW6PYI_VVfrTIRc_zR52zyEoO7o-N5KG1K-1-dADaAwpuQepsbr31DuwHTETK-I_sComrcw3U-HPGSaH1_waCYeKnBD9YzvVH3uqI0WjXh4jDAWGGWnxysrpJvdgg96a3B7QggLy9-MvRJMIRvy1BFXseWdOHm_e-w5lptHzoL_wqECmJiAfew5JU4IXbUSeTg5bdzg4ikqDTxU3CxDuwlm0d1Iom-PqGJDcEOhmIkpJoFGUrTnzUR8qPSf4nnPHX",
    location: "Wadi Rum, Jordan",
    price: "$120/xp",
    title: "Desert Stargazing",
  },
] as const;

export interface TravelEventCard {
  readonly alt: string;
  readonly badge: string;
  readonly date: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
  readonly location: string;
  readonly title: string;
}

export interface RegionalHighlight {
  readonly alt: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly href: string;
  readonly image: string;
  readonly region: "North" | "Central" | "South";
  readonly title: string;
}

export interface TravelerFeedback {
  readonly name: string;
  readonly quote: string;
  readonly role: string;
  readonly trip: string;
}

export interface TravelPartner {
  readonly description: string;
  readonly name: string;
}

export const featuredTravelEvents: readonly TravelEventCard[] = [
  {
    alt: "Hoi An ancient town glowing with lanterns in the evening",
    badge: "Coming up",
    date: "This weekend",
    description: "A short escape blending food, culture, and relaxed comfort for couples or families.",
    href: "/tours",
    image: visualDiaryItems[2].image,
    location: "Hoi An",
    title: "Heritage Weekend Escape",
  },
  {
    alt: "Luxury beachfront resort beside a tropical shoreline",
    badge: "Featured",
    date: "June - August",
    description: "A summer collection of island journeys with flexible pacing and private service touches.",
    href: "/hotels",
    image: suggestionCards[1].image,
    location: "Central Vietnam",
    title: "Summer by the Coast",
  },
  {
    alt: "Travelers sitting beside a campfire under a clear starry sky",
    badge: "Special offer",
    date: "Book early",
    description: "Smart-value combinations of stays and experiences for small groups that still want quality.",
    href: "/tours",
    image: suggestionCards[3].image,
    location: "Across Vietnam",
    title: "Early Bird Travel Week",
  },
] as const;

export const regionalHighlights: readonly RegionalHighlight[] = [
  {
    alt: "High mountains and a clear lake at first light",
    description: "From elegant Hanoi to island bays and northern highlands, this region suits culture-led journeys and slower escapes.",
    highlights: ["Hanoi", "Ha Long", "Sa Pa"],
    href: "/destinations",
    image: visualDiaryItems[3].image,
    region: "North",
    title: "Mountain light, old quarters, and cloud season",
  },
  {
    alt: "A bright orange temple gate hinting at a heritage journey",
    description: "Hue, Da Nang, and Hoi An create an easy route for travelers drawn to architecture, cuisine, and polished stays.",
    highlights: ["Hue", "Da Nang", "Hoi An"],
    href: "/tours",
    image: visualDiaryItems[2].image,
    region: "Central",
    title: "Heritage routes, blue water, and coastal resorts",
  },
  {
    alt: "A modern resort villa overlooking a lush green garden",
    description: "Southern energy blends riverside life, urban rhythm, and soft island downtime in one trip.",
    highlights: ["Ho Chi Minh City", "Mekong", "Phu Quoc"],
    href: "/hotels",
    image: suggestionCards[0].image,
    region: "South",
    title: "Rivers, city pace, and tropical island stays",
  },
] as const;

export const travelerFeedback: readonly TravelerFeedback[] = [
  {
    name: "Minh Anh",
    quote: "The itinerary felt thoughtful and private while still giving us a real sense of local culture.",
    role: "Founder, Hanoi",
    trip: "Hoi An private retreat",
  },
  {
    name: "Quoc Huy",
    quote: "The team handled every change quickly, so my family could simply enjoy the trip.",
    role: "Family traveler",
    trip: "Da Nang - Hue",
  },
  {
    name: "Linh Pham",
    quote: "The hotels, tours, and experiences all felt carefully chosen, never generic or mass-market.",
    role: "Creative Director",
    trip: "Northern Vietnam",
  },
] as const;

export const travelPartners: readonly TravelPartner[] = [
  { description: "Curated stays", name: "Heritage Hotels" },
  { description: "Private experiences", name: "Local Guides Collective" },
  { description: "Low-impact mobility", name: "Eco Transfer" },
  { description: "Culinary access", name: "Taste Vietnam" },
  { description: "Resort partners", name: "Boutique Retreats" },
] as const;

export const cartItems: readonly CartItem[] = [
  {
    id: "bay-mau-coconut-forest-jun-14-2024-2-guests",
    alt: "Round bamboo basket boats floating through Bay Mau coconut forest at dawn",
    date: "Jun 14, 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAo8noBnaTnSEeA4yEz0-rRKslv_QVN8t2mju5icPgeLY6q1BmMoShJ0UXUm6Vfqo-D0zU9klXK2kSX1sxKDZol5QhrB9BcgGAPUw20oMRbce9ZnOdxjsK8xHWtbx5IcBo614vxvjdT7wLQ1solZ6LOA2vVCYnkfse4EHKrApJkiNev4jN2RplpEW8QmBSkpOqZsxZn9ODmYJF-equyV8HGfUCkbfpxggUAQDfHs1S2YHYk9rIU0vSt3DmzsJneWbUcovmSNVt1GWza",
    meta: "4.5 Hours • Max 12 Guests",
    price: "$45",
    title: "Bay Mau Coconut Forest",
  },
  {
    id: "shining-riverside-suite-jun-12-18-2024-2-adults",
    alt: "Luxury hotel pool overlooking a tranquil river at dusk with warm lantern lighting",
    date: "Jun 12–18, 2024",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGgMhSZ7OI-OmQjgd8tjrgm-KQcTLyLE-EY2PSQ7CXpG-Ok8vTNcSknldM_atvqEHntRHqCFxzCFmliTe1QBQJs2cyBm2jNphWn3G-i0bxSyBuhkWZtSRk5DOX88r-asPeSxD8aAXDdaFk4LadiKSVNRivTcHXsRFBNXeDPAKl-LRURF36Tyx6QT-2yjcmrPrjOedZHAeHR_R-vpnT-VP0DROFmgqROULDThmgm2SIlpz6YlF_uE2EB5EAYA3Gawh8CCVjyoBI1fKv",
    meta: "6 nights • 2 Adults",
    price: "$1,125",
    title: "Shining Riverside Suite",
  },
] as const;

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
