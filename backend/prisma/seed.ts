import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import 'dotenv/config';

type SeedDestination = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  price: string;
  rating: number;
  market: string;
  status: string;
  heroImage: string;
  heroAlt: string;
  summary: string;
  intro: string[];
  facts: { label: string; value: string }[];
  spotlight: { title: string; description: string }[];
  relatedTours: { href: string; label: string; meta: string; title: string }[];
  relatedHotels: { href: string; label: string; meta: string; title: string }[];
};

const genericTourDepartures = [
  {
    date: new Date('2026-06-15T00:00:00.000Z'),
    capacity: 12,
    booked: 0,
    status: 'open',
  },
  {
    date: new Date('2026-06-22T00:00:00.000Z'),
    capacity: 12,
    booked: 0,
    status: 'open',
  },
  {
    date: new Date('2026-06-29T00:00:00.000Z'),
    capacity: 12,
    booked: 0,
    status: 'open',
  },
];

const genericHotelInventory = [
  {
    date: new Date('2026-06-15T00:00:00.000Z'),
    totalRooms: 8,
    bookedRooms: 0,
    status: 'open',
  },
  {
    date: new Date('2026-06-16T00:00:00.000Z'),
    totalRooms: 8,
    bookedRooms: 0,
    status: 'open',
  },
  {
    date: new Date('2026-06-17T00:00:00.000Z'),
    totalRooms: 8,
    bookedRooms: 0,
    status: 'open',
  },
];

type SeedTour = {
  slug: string;
  title: string;
  badge?: string;
  type: string;
  duration: string;
  guests: string;
  price: string;
  availability: string;
  description: string[];
  shortDescription: string;
  image: string;
  alt: string;
  heroImage: string;
  heroAlt: string;
  curatorImage: string;
  curatorImageAlt: string;
  subtitle: string;
  highlights: { icon: string; title: string; description: string }[];
  itinerary: { title: string; description: string }[];
  gallery: { image: string; alt: string; layout: string }[];
  inclusions: string[];
  exclusions: string[];
  destinationSlug: string;
  hotelSlugs: string[];
  departures: {
    date: Date;
    capacity: number;
    booked: number;
    status: string;
  }[];
};

type SeedHotel = Omit<
  Prisma.HotelCreateInput,
  'destinations' | 'tours' | 'mentionedInPosts' | 'inventoryDays'
> & {
  destinationSlugs: string[];
  inventory: {
    date: Date;
    totalRooms: number;
    bookedRooms: number;
    status: string;
  }[];
};

type SeedBlogPost = Omit<
  Prisma.BlogPostCreateInput,
  'mentionedDestinations' | 'mentionedTours' | 'mentionedHotels'
> & {
  mentionedDestinationSlugs: string[];
  mentionedTourSlugs: string[];
  mentionedHotelSlugs: string[];
};

type SeedMomentCaptured = {
  id: string;
  title: string;
  country: string;
  image: string;
  alt: string;
  wide: boolean;
  sortOrder: number;
};

const nordicFjordsImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCg4Pc4Hz2ckphmn1PXS-ra4wYOkUqi7PMGWKx61d5rMwLWxEwWY9yD9IAF7y6ED_dd3XsvuYHLJpjONv34C5d-NT7TZNwMJ3GE2UEGHGQosEdJI1MXtNKDRueIJXq0fSBHje9meDPhmJuiXmHKGqBBLuE93xjrlgt64-QMJgo8xyI1ZlOPUNmSQ95M1p-VknE5zyYismU3NeJlov_lokR9yBG_xV_ioAQIrI3-iCN6Zs7bY0PzXTqJb2qkYxvPYK24z3G9ZP2hIvls';
const londonImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCIBL4yRfAkIWlPfBg6EEXIpLsxANGUc4HpdqvjcNLWLR0lbcucB_In7Pae-G1W_plTCRD_6zPSFdgBo5pyaSvUqSkvbeJ3g8zcr_OdCdwHnL7fVZOkJ3Gmu4KisipjrzsOfWFy8oUkLpAYP9TA7AxZrfRVQVasOVWebBj5tS3v2iW24WaImU46qVZPgKWuBOzvOkPUYdMdEwGWodlbYLlSKUBynxUkh4nMkwc5A1eTBOHm7nme0BufNc858zAwcmU5kw0sEEJohfGq';
const bavarianImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDiPv71cX-SLFEC50j5ADgesaGwtxXoy8-nT-4_OE9DE3MyblA4EmKN-pbYDYqd_zAlunErJEyN7zjXebxA8PdMGtsJeJMYwJaG-TwPKOUprlw7k4n5F6Y7P2mV2eisvlduz5KufDqUoQrUdB-QBXWkkJqFqYT-770OyBNIL4Ow2iRHEG2p7Kaxv78AkbJ2UwynnS1fcSIPcWFb4Fe7gTRF0UBPlvETC_US-Jyt_AR5HEnvAK7DYhRnXtnPuoKlxKaLakZnYYAUgrIP';
const bayMauImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAo8noBnaTnSEeA4yEz0-rRKslv_QVN8t2mju5icPgeLY6q1BmMoShJ0UXUm6Vfqo-D0zU9klXK2kSX1sxKDZol5QhrB9BcgGAPUw20oMRbce9ZnOdxjsK8xHWtbx5IcBo614vxvjdT7wLQ1solZ6LOA2vVCYnkfse4EHKrApJkiNev4jN2RplpEW8QmBSkpOqZsxZn9ODmYJF-equyV8HGfUCkbfpxggUAQDfHs1S2YHYk9rIU0vSt3DmzsJneWbUcovmSNVt1GWza';
const shiningRiversideImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCGgMhSZ7OI-OmQjgd8tjrgm-KQcTLyLE-EY2PSQ7CXpG-Ok8vTNcSknldM_atvqEHntRHqCFxzCFmliTe1QBQJs2cyBm2jNphWn3G-i0bxSyBuhkWZtSRk5DOX88r-asPeSxD8aAXDdaFk4LadiKSVNRivTcHXsRFBNXeDPAKl-LRURF36Tyx6QT-2yjcmrPrjOedZHAeHR_R-vpnT-VP0DROFmgqROULDThmgm2SIlpz6YlF_uE2EB5EAYA3Gawh8CCVjyoBI1fKv';

export const seedDestinations: SeedDestination[] = [
  {
    slug: 'nordic-fjords',
    title: 'Nordic Fjords',
    description:
      'Sail through cinematic cliffs and quiet coastal villages shaped by ancient glacial landscapes.',
    href: '/destinations/nordic-fjords',
    image: nordicFjordsImage,
    alt: 'Norwegian fjords with deep blue water and dramatic mountain peaks',
    price: '$1,200',
    rating: 4.9,
    market: 'Northern Europe',
    status: 'published',
    heroImage: nordicFjordsImage,
    heroAlt:
      'Norwegian fjords with deep blue water and dramatic mountain peaks',
    summary:
      'A premium scenic destination for travelers who want atmosphere, nature, and calm logistical flow rather than constant activity.',
    intro: [
      'Nordic Fjords is the kind of destination that rewards restraint. The drama is already built into the land: cliffs that fall directly into dark blue water, villages scaled to human quiet, and weather that changes the scene by the hour.',
      'This is not a place to rush through on a checklist. It works best as a composed route of ferries, small harbors, design-led stays, and long daylight that keeps the landscape open late into the evening.',
    ],
    facts: [
      { label: 'Best season', value: 'May to September' },
      { label: 'Ideal stay', value: '7 to 10 days' },
      { label: 'Travel mood', value: 'Scenic expedition' },
      { label: 'Pace', value: 'Slow and cinematic' },
    ],
    spotlight: [
      {
        title: 'Water-first routing',
        description:
          'The strongest fjord itineraries are built around ferries, private launches, and coastal transfers instead of long road mileage.',
      },
      {
        title: 'Small harbor stays',
        description:
          'Design hotels and intimate lodges work better here than large resorts because the destination is about perspective and silence.',
      },
      {
        title: 'High summer daylight',
        description:
          'Extended light hours let you spread out movement and experiences without crowding the middle of the day.',
      },
    ],
    relatedTours: [
      {
        href: '/tours',
        label: 'Journey',
        meta: 'Private charter pacing and premium scenic routing',
        title: 'Cyclades Silk Sails',
      },
      {
        href: '/tours',
        label: 'Journey',
        meta: 'Cold-climate expedition energy and boutique scale',
        title: 'Arctic Sky Expedition',
      },
    ],
    relatedHotels: [
      {
        href: '/hotels/shining-riverside-hoi-an',
        label: 'Stay',
        meta: 'Quiet architecture-led retreat',
        title: 'Shining Riverside Suite',
      },
    ],
  },
  {
    slug: 'london-essence',
    title: 'London Essence',
    description:
      'Discover the perfect blend of historic architecture and cutting-edge modern culture.',
    href: '/destinations/london-essence',
    image: londonImage,
    alt: 'Big Ben and Westminster Bridge in London at dusk',
    price: '$850',
    rating: 4.7,
    market: 'Western Europe',
    status: 'published',
    heroImage: londonImage,
    heroAlt: 'Big Ben and Westminster Bridge in London at dusk',
    summary:
      'A flexible urban destination that performs best when treated as a culture and neighborhood itinerary, not only a monuments stop.',
    intro: [
      'London works when the itinerary balances ceremonial landmarks with neighborhoods that feel alive after the postcards are done. Its value is not just heritage; it is density, access, and cultural range.',
      'For this audience, the city is strongest when framed through architecture, food, galleries, and hotels that let the traveler move easily between classic London and contemporary energy.',
    ],
    facts: [
      { label: 'Best season', value: 'April to June' },
      { label: 'Ideal stay', value: '4 to 6 days' },
      { label: 'Travel mood', value: 'Urban culture' },
      { label: 'Pace', value: 'Layered and social' },
    ],
    spotlight: [
      {
        title: 'Museum and design circuits',
        description:
          'The city supports highly curated cultural days that can move from institution-scale galleries to independent studios and private dining.',
      },
      {
        title: 'Strong hotel base value',
        description:
          'Location matters more than excess amenity here. The right stay reduces friction and unlocks the city on foot.',
      },
      {
        title: 'Multi-audience appeal',
        description:
          'London can sit inside a first-time Europe itinerary or serve as a focused return trip for shopping, food, and theater.',
      },
    ],
    relatedTours: [
      {
        href: '/tours',
        label: 'Journey',
        meta: 'City-led discovery with strong local access',
        title: 'Amalfi Coast Discovery',
      },
      {
        href: '/blog/kyotos-new-wave',
        label: 'Editorial',
        meta: 'Reference point for culture-forward curation',
        title: "Kyoto's New Wave",
      },
    ],
    relatedHotels: [
      {
        href: '/hotels',
        label: 'Stay',
        meta: 'Refined city-base positioning for a cultural itinerary',
        title: 'Urban collection stays',
      },
    ],
  },
  {
    slug: 'bavarian-trails',
    title: 'Bavarian Trails',
    description:
      'Wander through fairy-tale villages and explore the majestic castles of the Black Forest.',
    href: '/destinations/bavarian-trails',
    image: bavarianImage,
    alt: 'Medieval German town with half-timbered houses',
    price: '$1,100',
    rating: 4.8,
    market: 'Central Europe',
    status: 'published',
    heroImage: bavarianImage,
    heroAlt: 'Medieval German town with half-timbered houses',
    summary:
      'A dependable, high-appeal destination for travelers who want European heritage with efficient logistics and immediate visual return.',
    intro: [
      'Bavarian Trails combines fairytale townscapes with a route structure that is unusually practical. It gives travelers visual payoff quickly without needing extreme logistics or remote transfers.',
      'The destination is strongest when castles, old-town stays, lake districts, and forest roads are edited into a compact sequence. It feels rich without becoming overly dense.',
    ],
    facts: [
      { label: 'Best season', value: 'May to October' },
      { label: 'Ideal stay', value: '6 to 8 days' },
      { label: 'Travel mood', value: 'Storybook heritage' },
      { label: 'Pace', value: 'Balanced touring' },
    ],
    spotlight: [
      {
        title: 'High visual density',
        description:
          'The destination delivers quickly through villages, castle silhouettes, and seasonal landscape shifts that feel legible even on a shorter trip.',
      },
      {
        title: 'Good family and multigen fit',
        description:
          'Routes can stay comfortable while still feeling elevated, which makes this strong for broad traveler mixes.',
      },
      {
        title: 'Easy itinerary bundling',
        description:
          'It pairs well with city extensions, rail segments, and soft-active days without breaking the journey rhythm.',
      },
    ],
    relatedTours: [
      {
        href: '/tours',
        label: 'Journey',
        meta: 'Classic Europe pacing with cultural stops',
        title: 'Venetian Renaissance',
      },
      {
        href: '/tours',
        label: 'Journey',
        meta: 'Textural city-to-landscape contrast',
        title: 'Colors of Marrakech',
      },
    ],
    relatedHotels: [
      {
        href: '/hotels',
        label: 'Stay',
        meta: 'Countryside and heritage stay pairings',
        title: 'Curated alpine-adjacent stays',
      },
    ],
  },
];

export const seedHotels: SeedHotel[] = [
  {
    slug: 'shining-riverside-hoi-an',
    name: 'Shining Riverside',
    location: 'Hoi An Hotel & Spa, Vietnam',
    address: '21 Ly Thuong Kiet, Hoi An Ancient Town',
    price: '$180',
    badge: 'Riverside Calm',
    score: 9.4,
    scoreLabel: 'Exceptional',
    scoreSummary: 'Based on 1,240 Reviews',
    status: 'published',
    listingImage: shiningRiversideImage,
    listingAlt: 'Luxurious hotel pool overlooking a tranquil river at dusk',
    heroImage: shiningRiversideImage,
    heroAlt:
      'Luxurious hotel pool overlooking a tranquil river at dusk with warm lantern lighting and traditional Vietnamese architecture',
    description: [
      'A modern heritage stay bridging Hoi An historical pulse and serene luxury wellness.',
      'Minimalist geometry meets organic textures throughout the riverside property.',
    ],
    amenities: [
      { icon: 'pool', title: 'Infinity River Pool' },
      { icon: 'spa', title: 'Lotus Wellness Spa' },
      { icon: 'dining', title: 'Fine Dining Bistro' },
      { icon: 'gym', title: 'Curated Gym' },
    ],
    suites: [
      {
        name: 'Grand Riverside Suite',
        price: '$240',
        badge: 'Most Desired',
        description:
          '52 sqm • King Bed • Private Balcony with Panoramic River Views.',
        image: shiningRiversideImage,
        alt: 'Luxury suite with private balcony and river view',
      },
    ],
    gallery: [
      { image: shiningRiversideImage, alt: 'Modern minimalist hotel suite' },
      {
        image: shiningRiversideImage,
        alt: 'Lantern-lit riverside pool terrace at Shining Riverside',
      },
    ],
    reviewScores: [
      { label: 'Cleanliness', score: '9.8' },
      { label: 'Location', score: '9.5' },
      { label: 'Service', score: '9.6' },
    ],
    reviews: [],
    booking: {
      checkIn: 'May 24',
      checkOut: 'May 27',
      nightlyTotal: '$1,080',
      fee: '$45',
      nights: '3 Nights',
      rating: '4.9',
      travelers: '2 Adults',
      total: '$1,125',
    },
    destinationSlugs: [],
    inventory: genericHotelInventory,
  },
  ...(
    [
      [
        'aman-tokyo',
        'Aman Tokyo',
        'Otemachi, Japan',
        '$1,200',
        'Zen Sanctuary',
      ],
      [
        'the-glass-house',
        'The Glass House',
        'Tuscany, Italy',
        '$890',
        'Editorial Pick',
      ],
      [
        'villa-marittima',
        'Villa Marittima',
        'Amalfi, Italy',
        '$1,450',
        'Coastal Living',
      ],
      ['amangiri', 'Amangiri', 'Utah, USA', '$2,100', 'Wilderness Luxury'],
      [
        'soneva-jani',
        'Soneva Jani',
        'Noonu Atoll, Maldives',
        '$3,400',
        'Hidden Gem',
      ],
      [
        '72-north-lodge',
        '72 North Lodge',
        'Tromsø, Norway',
        '$620',
        'Arctic Design',
      ],
    ] satisfies [string, string, string, string, string][]
  ).map(([slug, name, location, price, badge]) => ({
    slug,
    name,
    location,
    address: location,
    price,
    badge,
    score: 9.1,
    scoreLabel: 'Exceptional',
    scoreSummary: 'Curated hotel collection stay.',
    status: 'published',
    listingImage: nordicFjordsImage,
    listingAlt: `${name} hotel exterior`,
    heroImage: nordicFjordsImage,
    heroAlt: `${name} hotel hero image`,
    description: [
      `${name} is part of the curated TouristWeb hotel collection.`,
    ],
    amenities: [],
    suites: [],
    gallery: [{ image: nordicFjordsImage, alt: `${name} hotel gallery image` }],
    reviewScores: [],
    reviews: [],
    booking: {},
    destinationSlugs: [],
    inventory: genericHotelInventory,
  })),
];

export const seedTours: SeedTour[] = [
  {
    slug: 'bay-mau-coconut-forest',
    title: 'Traveling to Bay Mau Coconut Forest',
    badge: 'Featured',
    type: 'Small Group',
    duration: '4.5 Hours',
    guests: 'Max 12 Guests',
    price: '$45',
    availability: 'Daily',
    description: [
      'Nestled near Hoi An, Bay Mau Coconut Forest is a lush water-palm sanctuary and sensory journey into Quang Nam fishing culture.',
    ],
    shortDescription:
      'Discover the tranquil rhythm of Hoi An hidden water world through ancient traditions and emerald landscapes.',
    image: bayMauImage,
    alt: 'Aerial view of Bay Mau coconut forest in Hoi An with lush water palms and a basket boat at dawn',
    heroImage: bayMauImage,
    heroAlt: 'Aerial view of Bay Mau coconut forest in Hoi An',
    curatorImage: bayMauImage,
    curatorImageAlt: 'Portrait of a friendly travel curator with a warm smile',
    subtitle:
      'Discover the tranquil rhythm of Hoi An hidden water world through ancient traditions and emerald landscapes.',
    highlights: [
      {
        icon: 'boat',
        title: 'Bamboo Basket Boat',
        description: 'Navigate the waterways in an iconic circular Thung Chai.',
      },
      {
        icon: 'fish',
        title: 'Traditional Fishing',
        description: 'Learn the art of net casting and purple crab fishing.',
      },
    ],
    itinerary: [
      {
        title: 'Pick-up & Arrival at Bay Mau',
        description:
          'Morning departure from your hotel in Hoi An ancient town.',
      },
      {
        title: 'Bamboo Basket Boat Experience',
        description: 'Enjoy crab fishing and the spinning boat performance.',
      },
    ],
    gallery: [
      {
        image: bayMauImage,
        alt: 'Basket boat through water palms',
        layout: 'portrait',
      },
    ],
    inclusions: [
      'Round-trip hotel pickup in Hoi An',
      'Professional English-speaking guide',
    ],
    exclusions: [
      'Personal expenses & souvenirs',
      'Gratuities/Tips for guide and boat rowers',
    ],
    destinationSlug: 'bavarian-trails',
    hotelSlugs: ['shining-riverside-hoi-an'],
    departures: genericTourDepartures,
  },
  ...(
    [
      [
        'the-soul-of-kyoto',
        'The Soul of Kyoto',
        'Featured',
        '10 Days',
        'Max 8 Guests',
        '$4,200',
        'Experience the quiet majesty of Gion, private tea ceremonies, and dawn meditations in hidden forest shrines.',
      ],
      [
        'amalfi-coast-discovery',
        'Amalfi Coast Discovery',
        'New',
        '8 Days',
        'Max 12 Guests',
        '$3,850',
        'Sailing the Tyrrhenian sea, lemon grove lunches, and private access to the villas of Ravello.',
      ],
      [
        'arctic-sky-expedition',
        'Arctic Sky Expedition',
        undefined,
        '7 Days',
        'Max 6 Guests',
        '$5,600',
        'Chase the Northern Lights in luxury glass igloos with expert astronomers and local Nordic guides.',
      ],
      [
        'colors-of-marrakech',
        'Colors of Marrakech',
        undefined,
        '12 Days',
        'Max 10 Guests',
        '$3,200',
        'From the vibrant souks to the quiet of the Sahara, immerse yourself in the textures of Morocco.',
      ],
      [
        'cyclades-silk-sails',
        'Cyclades Silk Sails',
        undefined,
        '14 Days',
        'Private Charter',
        '$8,900',
        'A private nautical journey through the lesser-known islands of the Aegean on a heritage wood schooner.',
      ],
      [
        'venetian-renaissance',
        'Venetian Renaissance',
        'Featured',
        '9 Days',
        'Max 6 Guests',
        '$5,200',
        'Exclusive after-hours tours of St. Mark Basilica and private dinners in historic canal-side palazzos.',
      ],
    ] satisfies [
      string,
      string,
      string | undefined,
      string,
      string,
      string,
      string,
    ][]
  ).map(([slug, title, badge, duration, guests, price, shortDescription]) => ({
    slug,
    title,
    badge,
    type: 'Curated Journey',
    duration,
    guests,
    price,
    availability: 'Seasonal departures',
    description: [shortDescription],
    shortDescription,
    image: nordicFjordsImage,
    alt: `${title} travel experience`,
    heroImage: nordicFjordsImage,
    heroAlt: `${title} hero image`,
    curatorImage: nordicFjordsImage,
    curatorImageAlt: 'Travel curator portrait',
    subtitle: shortDescription,
    highlights: [],
    itinerary: [],
    gallery: [
      {
        image: nordicFjordsImage,
        alt: `${title} visual journal portrait`,
        layout: 'portrait',
      },
    ],
    inclusions: [],
    exclusions: [],
    destinationSlug:
      slug === 'the-soul-of-kyoto' || slug === 'amalfi-coast-discovery'
        ? 'london-essence'
        : 'nordic-fjords',
    hotelSlugs: [],
    departures: genericTourDepartures,
  })),
];

export const seedBlogPosts: SeedBlogPost[] = [
  {
    slug: 'kyotos-new-wave',
    title: 'The Architectural Poetry of Kyoto’s New Wave',
    excerpt:
      'Exploring the intersection of traditional Machiya craftsmanship and modern Japanese minimalism.',
    category: 'Lifestyle',
    author: 'Elena Rostova',
    status: 'published',
    publishedAt: new Date('2024-10-12T00:00:00.000Z'),
    readingTime: '8 min read',
    image: nordicFjordsImage,
    alt: 'Luxury boutique hotel lobby with minimalist wooden furniture and a tranquil zen garden view',
    heroImage: nordicFjordsImage,
    heroAlt: 'Expansive view of a minimalist modern Kyoto machiya interior',
    intro:
      'In Kyoto, traditional machiya are being reimagined by a new generation of architects.',
    meta: '8 min read',
    quote: 'We are not designing houses; we are designing vessels for shadows.',
    sections: [
      {
        heading: 'The Vocabulary of Restraint',
        body: [
          'The newest Kyoto retreats begin with a familiar silhouette: narrow timber frontage, softened noren curtains, and a rhythm of thresholds that keeps the street at a respectful distance.',
          'Inside, architects are editing rather than replacing tradition, using matte plaster, smoked cedar, and precise joinery to let light become the central material.',
        ],
      },
      {
        heading: 'The Modern Machiya',
        body: [
          'Traditional structures remain respectful outside and contemporary inside, pairing tatami proportions with open kitchens, sculptural baths, and concealed climate systems.',
          'The strongest projects avoid museum nostalgia; they keep the scale intimate while making daily rituals feel quietly luxurious.',
        ],
      },
      {
        heading: 'Curation of Space',
        body: [
          'For travelers, these homes offer a slower way to understand Kyoto: mornings framed by garden moss, evenings filtered through paper screens, and neighborhoods experienced at walking pace.',
        ],
      },
    ],
    inlineImage: {
      image: nordicFjordsImage,
      alt: 'Modern machiya interior details',
    },
    secondaryFeature: {
      title: 'A Dialogue with Nature',
      body: 'Pocket gardens remain the spiritual heart of the home.',
      image: {
        image: nordicFjordsImage,
        alt: 'Small tsubo-niwa courtyard garden',
      },
    },
    relatedPosts: [],
    seo: {
      title: 'The Architectural Poetry of Kyoto’s New Wave',
      description: 'Modern Kyoto machiya architecture and design.',
    },
    mentionedDestinationSlugs: [],
    mentionedTourSlugs: ['the-soul-of-kyoto'],
    mentionedHotelSlugs: [],
  },
  ...[
    [
      'dolomites-quietude',
      'Quietude in the High Alps: A Guide to Slow Living',
      'Guides',
    ],
    [
      'uncharted-shores-aegean',
      'Uncharted Shores: 10 Secret Islands in the Aegean',
      'Guides',
    ],
    [
      'foragers-table',
      'The Forager’s Table: A Morning with Chef Elias',
      'Interviews',
    ],
    [
      'cinque-terre-light',
      'Chasing the Light: A Photographer&apos;s Cinque Terre',
      'Destinations',
    ],
    [
      'ubud-rituals',
      'The Rituals of Ubud: Morning Prayer and Matcha',
      'Lifestyle',
    ],
    [
      'remote-life-sweden',
      'The New Nomad: Designing a Remote Life in Sweden',
      'Guides',
    ],
    ['tokyo-getting-lost', 'The Art of Getting Lost in Tokyo', 'Slow Travel'],
    [
      'dolomites-vertical-symphony',
      'Dolomites: A Vertical Symphony',
      'Adventure',
    ],
    ['parisian-bistros-2024', 'The Best Parisian Bistros of 2024', 'Lifestyle'],
  ].map(([slug, title, category]) => ({
    slug,
    title,
    excerpt: `${title} from the TouristWeb journal collection.`,
    category,
    author: 'TouristWeb Editorial',
    status: 'published',
    publishedAt: new Date('2024-09-01T00:00:00.000Z'),
    readingTime: '5 min read',
    image: nordicFjordsImage,
    alt: `${title} cover image`,
    heroImage: nordicFjordsImage,
    heroAlt: `${title} hero image`,
    intro: `${title} from the TouristWeb journal collection.`,
    meta: '5 min read',
    quote: 'Travel rewards the patient eye.',
    sections: [
      {
        heading: 'A Slower Arrival',
        body: [
          `${title} begins with a quieter rhythm, inviting travelers to notice texture, light, and local rituals before chasing an itinerary.`,
          'Our editors favor routes that leave space for unplanned markets, long lunches, and conversations that reveal the character of a place.',
        ],
      },
      {
        heading: 'The Curated Route',
        body: [
          'Each stop balances comfort with a strong sense of setting, from design-led stays to guides who can open doors usually missed by first-time visitors.',
          'The result is a journey that feels composed without becoming rigid, with enough structure to travel confidently and enough openness to feel personal.',
        ],
      },
      {
        heading: 'What Stays With You',
        body: [
          'The best journeys linger through details: the sound of a harbor before breakfast, a table set with regional produce, or a viewpoint reached just as the crowds thin.',
        ],
      },
    ],
    inlineImage: { image: nordicFjordsImage, alt: `${title} inline image` },
    secondaryFeature: {
      title: 'Editor’s Field Note',
      body: `A focused companion note for ${title}, pairing practical context with the sensory details that shape the experience.`,
      image: { image: nordicFjordsImage, alt: `${title} field note image` },
    },
    relatedPosts: [],
    seo: { title, description: `${title} travel journal.` },
    mentionedDestinationSlugs: [],
    mentionedTourSlugs: [],
    mentionedHotelSlugs: [],
  })),
];

export const seedMomentsCaptured: SeedMomentCaptured[] = [
  {
    id: 'moment-ubud-sanctuary',
    title: 'Ubud Sanctuary',
    country: 'Indonesia',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXt_uOk39Ti37dURaaAO9Gv1kYVRVrW8XysehQZYZ-kt8ZIZ2bwtsNbCd8AQ10u4z3Ws-ygeCNJUv5Gop1UT63u6X8MxMOwsc3rhdMRY3tsgjeEe7qMzcd2149-FycyLeFDO7xpx9kcEWk2_fS8DKpX_9kDbN7JeuBgbv1G_I2vQxg6YBjFVxc2nyFZne7rAd3m-oBrS93hnfaOSPn5-SrDsWnmzW4Kbf9FhEm3BsIhBf9ZX3-3YD5FUAC77BSp5tPXQZqXBkT11Kv',
    alt: 'Luxurious infinity pool overlooking tropical jungle in Bali at sunset',
    wide: false,
    sortOrder: 10,
  },
  {
    id: 'moment-oia-heights',
    title: 'Oia Heights',
    country: 'Greece',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOgbPq_XwQHxqcdV8CyyHHmuASmYTCmNh8iC7Qa31o9m88sCugttUqmVEJ9bS5RPzElQEn3SYK-jK_z3ZTIrVazznHG0pefnGU_WXvkW-iVA_-PFDRH_IKzie9_WL8XUqXMxcvGZ2MQlUIH04iFzpzi0-Dw9h8BagV-0zsnmNHMyzCNzFKofG6m8Jgt1H4eP9Kmlfbm3tlEv7MKPMhepN0PChYlQh5bYZy_lqG6VpCO0OfdJSwkDnmnv66dBHDhuW2r9OkGCMoo0l',
    alt: 'Sunset over Santorini caldera with white domed buildings',
    wide: true,
    sortOrder: 20,
  },
  {
    id: 'moment-kyoto-rituals',
    title: 'Kyoto Rituals',
    country: 'Japan',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAF4vsCxEPUT55N-RY2qaIvB_vfZFOivZwZ9iOvf16bFRt0ntzY8S9f8SN1Y69IGH9UEwQJJ4z-s409ytBeuTtHET1tRKmmZZ7purJkx80yYpcbQu-HMrFGCLFQrH9MmxYVPtwbNMaGNC0pX5pHQFf6Pf20qr-d6DU5b8mbJ09TwyrMdeGgJK7i0ug1bPf7MuX84yyLKpMlihdxXp-Rx3Wny5jGquG2LmnAUEA0Xk-SSmox9ULLpYVMrzC7tbttWUuf-vk8cdjTvwoC',
    alt: 'Orange torii gates at Fushimi Inari shrine in Kyoto',
    wide: false,
    sortOrder: 30,
  },
  {
    id: 'moment-alpine-silence',
    title: 'Alpine Silence',
    country: 'Switzerland',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmQGXS04u9LQQr8k62J4bbs5yRMtU1_3unbCZXTbhnDlAJZd6PTnWl9ObnEBg_XeHpk1EW78JTlcFrpgc03E6GF_GD30D8cTau7EFb48AKzznjX8M3MAwWIJrOGch91X09_JxAecQVTs0keSp11X99OraPR_Nmvc-aV-NT4PPebtaG5J9v2tIMaM5eCrLoVdStV6ZMQr2G8xdbmvLDtw1ByehwABdtCZGgp9ceBVrFy-U-3crNf73iAB6_pRpzvDuMxU397e3baeGv',
    alt: 'Snow-capped alpine mountains reflecting in a turquoise lake',
    wide: true,
    sortOrder: 40,
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  await prisma.$connect();

  try {
    for (const destination of seedDestinations) {
      await prisma.destination.upsert({
        where: { slug: destination.slug },
        create: destination,
        update: destination,
      });
    }

    for (const hotel of seedHotels) {
      const { destinationSlugs, inventory, ...data } = hotel;
      await prisma.hotel.upsert({
        where: { slug: hotel.slug },
        create: {
          ...data,
          destinations: { connect: destinationSlugs.map((slug) => ({ slug })) },
          inventoryDays: { create: inventory },
        },
        update: {
          ...data,
          destinations: { set: destinationSlugs.map((slug) => ({ slug })) },
          inventoryDays: {
            deleteMany: {},
            create: inventory,
          },
        },
      });
    }

    for (const tour of seedTours) {
      const { destinationSlug, hotelSlugs, departures, ...data } = tour;
      await prisma.tour.upsert({
        where: { slug: tour.slug },
        create: {
          ...data,
          destination: { connect: { slug: destinationSlug } },
          hotels: { connect: hotelSlugs.map((slug) => ({ slug })) },
          departures: { create: departures },
        },
        update: {
          ...data,
          destination: { connect: { slug: destinationSlug } },
          hotels: { set: hotelSlugs.map((slug) => ({ slug })) },
          departures: {
            deleteMany: {},
            create: departures,
          },
        },
      });
    }
    for (const post of seedBlogPosts) {
      const {
        mentionedDestinationSlugs,
        mentionedHotelSlugs,
        mentionedTourSlugs,
        ...data
      } = post;
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        create: {
          ...data,
          mentionedDestinations: {
            connect: mentionedDestinationSlugs.map((slug) => ({ slug })),
          },
          mentionedHotels: {
            connect: mentionedHotelSlugs.map((slug) => ({ slug })),
          },
          mentionedTours: {
            connect: mentionedTourSlugs.map((slug) => ({ slug })),
          },
        },
        update: {
          ...data,
          mentionedDestinations: {
            set: mentionedDestinationSlugs.map((slug) => ({ slug })),
          },
          mentionedHotels: {
            set: mentionedHotelSlugs.map((slug) => ({ slug })),
          },
          mentionedTours: {
            set: mentionedTourSlugs.map((slug) => ({ slug })),
          },
        },
        });
      }

    for (const moment of seedMomentsCaptured) {
      const { id, ...data } = moment;
      await prisma.momentCaptured.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
