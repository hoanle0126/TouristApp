import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import 'dotenv/config';

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

type SeedDestination = {
  slug: string;
  title: string;
  description: string;
  image: string;
  heroImage: string;
  summary: string;
  intro: string[];
  facts: { label: string; value: string }[];
  spotlight: { title: string; description: string }[];
};

const genericTourDepartures = [
  {
    date: new Date('2026-06-15T00:00:00.000Z'),
    capacity: 120,
    booked: 0,
    status: 'open',
  },
  {
    date: new Date('2026-06-22T00:00:00.000Z'),
    capacity: 120,
    booked: 0,
    status: 'open',
  },
  {
    date: new Date('2026-06-29T00:00:00.000Z'),
    capacity: 120,
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
  heroImage: string;
  subtitle: string;
  highlights: { icon: string; title: string; description: string }[];
  itinerary: { title: string; description: string }[];
  gallery: { image: string; layout: string }[];
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

type SeedEvent = {
  id: string;
  title: string;
  badge: string;
  date: string;
  location: string;
  description: string;
  href: string;
  image: string;
  alt: string;
  sortOrder: number;
};

type SeedPartner = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
};

type SeedTravelerReview = {
  id: string;
  name: string;
  role: string;
  trip: string;
  quote: string;
  sortOrder: number;
};

const nordicFjordsImage =
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80';
const londonImage =
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80';
const bavarianImage =
  'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80';
const bayMauImage =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80';
const shiningRiversideImage =
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80';

const obsoleteSeedTourSlugs = [
  'the-soul-of-kyoto',
  'amalfi-coast-discovery',
  'arctic-sky-expedition',
  'colors-of-marrakech',
  'cyclades-silk-sails',
  'venetian-renaissance',
];

const obsoleteSeedBlogSlugs = [
  'kyotos-new-wave',
  'dolomites-quietude',
  'uncharted-shores-aegean',
  'foragers-table',
  'cinque-terre-light',
  'ubud-rituals',
  'remote-life-sweden',
  'tokyo-getting-lost',
  'dolomites-vertical-symphony',
  'parisian-bistros-2024',
];

const destinationSpotlight = [
  {
    title: 'Private routing',
    description:
      'Routes are designed around smoother transfers, quieter timing, and fewer forced stops.',
  },
  {
    title: 'Characterful stays',
    description:
      'Hotels are selected for setting and atmosphere rather than only amenity lists.',
  },
  {
    title: 'Local access',
    description:
      'Guides and hosts add context so each place feels specific rather than generic.',
  },
];

export const seedDestinations: SeedDestination[] = [
  {
    slug: 'nordic-fjords',
    title: 'Nordic Fjords',
    description:
      'Sail through cinematic cliffs and quiet coastal villages shaped by ancient glacial landscapes.',
    image: nordicFjordsImage,
    heroImage: nordicFjordsImage,
    summary:
      'A premium scenic destination for travelers who want atmosphere, nature, and calm logistical flow rather than constant activity.',
    intro: [
      'Nordic Fjords rewards restraint with cliffs, dark water, quiet harbors, and long summer light.',
      'The strongest trips move by ferry, private launch, and scenic road segments rather than rushed sightseeing loops.',
    ],
    facts: [
      { label: 'Best season', value: 'May to September' },
      { label: 'Ideal stay', value: '7 to 10 days' },
      { label: 'Travel mood', value: 'Scenic expedition' },
      { label: 'Pace', value: 'Slow and cinematic' },
    ],
    spotlight: destinationSpotlight,
  },
  {
    slug: 'london-essence',
    title: 'London Essence',
    description:
      'Discover the perfect blend of historic architecture, design hotels, galleries, and modern culture.',
    image: londonImage,
    heroImage: londonImage,
    summary:
      'A flexible urban destination that performs best as a culture and neighborhood itinerary, not only a monuments stop.',
    intro: [
      'London works when ceremonial landmarks are balanced with neighborhoods that still feel alive after the postcards are done.',
      'The city is strongest through architecture, food, galleries, and hotels that reduce friction across a dense itinerary.',
    ],
    facts: [
      { label: 'Best season', value: 'April to June' },
      { label: 'Ideal stay', value: '4 to 6 days' },
      { label: 'Travel mood', value: 'Urban culture' },
      { label: 'Pace', value: 'Layered and social' },
    ],
    spotlight: destinationSpotlight,
  },
  {
    slug: 'bavarian-trails',
    title: 'Bavarian Trails',
    description:
      'Wander through alpine villages, lake roads, castle silhouettes, and storybook heritage towns.',
    image: bavarianImage,
    heroImage: bavarianImage,
    summary:
      'A dependable, high-appeal destination for travelers who want European heritage with efficient logistics and immediate visual return.',
    intro: [
      'Bavarian Trails combines fairytale townscapes with a route structure that is unusually practical.',
      'Castles, old-town stays, lake districts, and forest roads create a rich sequence without becoming overly dense.',
    ],
    facts: [
      { label: 'Best season', value: 'May to October' },
      { label: 'Ideal stay', value: '6 to 8 days' },
      { label: 'Travel mood', value: 'Storybook heritage' },
      { label: 'Pace', value: 'Balanced touring' },
    ],
    spotlight: destinationSpotlight,
  },
  ...(
    [
      {
        slug: 'hoi-an-riverside',
        title: 'Hoi An Riverside',
        description:
          'Lantern-lit heritage streets, riverside boutique stays, cooking rituals, and gentle coastal day trips.',
        image:
          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'February to August',
        idealStay: '3 to 5 days',
        mood: 'Heritage ease',
        pace: 'Relaxed and walkable',
      },
      {
        slug: 'da-nang-coast',
        title: 'Da Nang Coast',
        description:
          'A polished central Vietnam base for beaches, resort comfort, seafood evenings, and heritage excursions.',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'March to September',
        idealStay: '4 to 6 days',
        mood: 'Beach and city',
        pace: 'Easy resort rhythm',
      },
      {
        slug: 'sa-pa-highlands',
        title: 'Sa Pa Highlands',
        description:
          'Misty terraces, mountain lodges, village walks, and cooler northern air for slow scenic travel.',
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'September to November',
        idealStay: '3 to 5 days',
        mood: 'Mountain nature',
        pace: 'Soft adventure',
      },
      {
        slug: 'ha-giang-loop',
        title: 'Ha Giang Loop',
        description:
          'Limestone passes, frontier roads, highland markets, and dramatic viewpoints across northern Vietnam.',
        image:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'October to April',
        idealStay: '4 to 6 days',
        mood: 'Road journey',
        pace: 'Scenic and active',
      },
      {
        slug: 'phu-quoc-island',
        title: 'Phu Quoc Island',
        description:
          'Warm island water, sunset villas, longer beach stays, and private downtime after busier routes.',
        image:
          'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'November to April',
        idealStay: '4 to 7 days',
        mood: 'Island retreat',
        pace: 'Slow and private',
      },
      {
        slug: 'mekong-delta',
        title: 'Mekong Delta',
        description:
          'Slow waterways, garden houses, floating markets, and southern hospitality with softer logistics.',
        image:
          'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'December to May',
        idealStay: '2 to 4 days',
        mood: 'River culture',
        pace: 'Gentle and local',
      },
      {
        slug: 'hue-imperial-city',
        title: 'Hue Imperial City',
        description:
          'Royal tombs, garden houses, quiet river views, and refined central Vietnamese food traditions.',
        image:
          'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'January to April',
        idealStay: '2 to 3 days',
        mood: 'Imperial culture',
        pace: 'Calm and reflective',
      },
      {
        slug: 'hanoi-old-quarter',
        title: 'Hanoi Old Quarter',
        description:
          'Layered streets, coffee rituals, galleries, colonial architecture, and northern food culture.',
        image:
          'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'October to April',
        idealStay: '3 to 5 days',
        mood: 'Urban heritage',
        pace: 'Layered and lively',
      },
      {
        slug: 'ninh-binh-karsts',
        title: 'Ninh Binh Karsts',
        description:
          'River caves, limestone peaks, cycling paths, and countryside lodges within easy reach of Hanoi.',
        image:
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
        bestSeason: 'February to May',
        idealStay: '2 to 3 days',
        mood: 'Countryside scenery',
        pace: 'Slow active',
      },
    ] satisfies {
      slug: string;
      title: string;
      description: string;
      image: string;
      bestSeason: string;
      idealStay: string;
      mood: string;
      pace: string;
    }[]
  ).map((destination) => ({
    slug: destination.slug,
    title: destination.title,
    description: destination.description,
    image: destination.image,
    heroImage: destination.image,
    summary: `${destination.title} is curated for travelers who want ${destination.mood.toLowerCase()} with clear logistics and well-paced days.`,
    intro: [
      `${destination.title} brings together setting, atmosphere, and practical routing so the journey feels composed rather than crowded.`,
      'The experience works best with selective stays, private transfers where useful, and enough unscheduled time for the place to breathe.',
    ],
    facts: [
      { label: 'Best season', value: destination.bestSeason },
      { label: 'Ideal stay', value: destination.idealStay },
      { label: 'Travel mood', value: destination.mood },
      { label: 'Pace', value: destination.pace },
    ],
    spotlight: destinationSpotlight,
  })),
];

export const seedHotels: SeedHotel[] = [
  {
    slug: 'shining-riverside-hoi-an',
    name: 'Shining Riverside',
    location: 'Hoi An Hotel & Spa, Vietnam',
    address: '21 Ly Thuong Kiet, Hoi An Ancient Town',
    price: '$180',
    badge: 'Riverside Calm',
    status: 'published',
    listingImage: shiningRiversideImage,
    heroImage: shiningRiversideImage,
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
      },
    ],
    gallery: [
      { image: shiningRiversideImage },
      {
        image: shiningRiversideImage,
      },
    ],
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
    destinationSlugs: ['bavarian-trails'],
    inventory: genericHotelInventory,
  },
  ...(
    [
      {
        slug: 'aman-tokyo',
        name: 'Aman Tokyo',
        location: 'Otemachi, Japan',
        address: 'The Otemachi Tower, Chiyoda City, Tokyo',
        price: '$1,200',
        badge: 'Zen Sanctuary',
        image:
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
        description: [
          'A sky-high Tokyo retreat pairing hushed design, panoramic city views, and deeply private service.',
          'The property works best for travelers who want contemporary Japan with the friction removed.',
        ],
        amenities: [
          { icon: 'spa', title: 'Aman Spa' },
          { icon: 'pool', title: 'Indoor Skyline Pool' },
          { icon: 'dining', title: 'Japanese Fine Dining' },
          { icon: 'gym', title: 'Wellness Studio' },
        ],
        suites: [
          {
            name: 'Deluxe Suite',
            price: '$1,450',
            badge: 'City View',
            description:
              'Spacious suite with floor-to-ceiling windows and calm natural materials.',
            image:
              'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
          },
        ],
        destinationSlugs: ['london-essence'],
      },
      {
        slug: 'the-glass-house',
        name: 'The Glass House',
        location: 'Tuscany, Italy',
        address: 'Val d’Orcia Hills, Tuscany, Italy',
        price: '$890',
        badge: 'Editorial Pick',
        image:
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
        description: [
          'A countryside villa stay designed around vineyards, clean architecture, and long-table dinners.',
          'Ideal for couples and small groups who want privacy without a remote expedition feel.',
        ],
        amenities: [
          { icon: 'pool', title: 'Hillside Pool' },
          { icon: 'dining', title: 'Farm-to-Table Kitchen' },
          { icon: 'wifi', title: 'Fast Wi-Fi' },
          { icon: 'parking', title: 'Private Parking' },
        ],
        suites: [
          {
            name: 'Panorama Suite',
            price: '$1,040',
            badge: 'Sunset Terrace',
            description:
              'Light-filled suite with vineyard-facing terrace and soaking tub.',
            image:
              'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
          },
        ],
        destinationSlugs: ['bavarian-trails'],
      },
      {
        slug: 'villa-marittima',
        name: 'Villa Marittima',
        location: 'Amalfi, Italy',
        address: 'Clifftop Road, Amalfi Coast, Italy',
        price: '$1,450',
        badge: 'Coastal Living',
        image:
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80',
        description: [
          'A polished Amalfi base with sea-facing terraces, boat access, and slow Mediterranean pacing.',
          'Best for travelers who want the coast without giving up privacy and service quality.',
        ],
        amenities: [
          { icon: 'beach', title: 'Private Beach Access' },
          { icon: 'dining', title: 'Seafood Terrace Restaurant' },
          { icon: 'spa', title: 'Cliffside Spa Cabins' },
          { icon: 'coffee', title: 'Sunrise Lounge' },
        ],
        suites: [
          {
            name: 'Marina Suite',
            price: '$1,780',
            badge: 'Sea Terrace',
            description:
              'Coastal suite with private plunge pool and uninterrupted sunset view.',
            image:
              'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80',
          },
        ],
        destinationSlugs: ['da-nang-coast'],
      },
      {
        slug: 'amangiri',
        name: 'Amangiri',
        location: 'Utah, USA',
        address: '1 Kayenta Road, Canyon Point, Utah',
        price: '$2,100',
        badge: 'Wilderness Luxury',
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
        description: [
          'A desert retreat built for silence, dramatic landforms, and high-touch private guiding.',
          'The experience is about space, geology, and the feeling of being deliberately removed.',
        ],
        amenities: [
          { icon: 'spa', title: 'Desert Spa' },
          { icon: 'pool', title: 'Stone Pool' },
          { icon: 'gym', title: 'Movement Studio' },
          { icon: 'dining', title: 'Open-Fire Dining' },
        ],
        suites: [
          {
            name: 'Mesa Suite',
            price: '$2,450',
            badge: 'Private Plunge Pool',
            description:
              'Minimalist suite with sandstone terrace and panoramic desert outlook.',
            image:
              'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
          },
        ],
        destinationSlugs: ['ha-giang-loop'],
      },
      {
        slug: 'soneva-jani',
        name: 'Soneva Jani',
        location: 'Noonu Atoll, Maldives',
        address: 'Medhufaru Island, Noonu Atoll, Maldives',
        price: '$3,400',
        badge: 'Hidden Gem',
        image:
          'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
        description: [
          'An overwater escape shaped around privacy, turquoise lagoons, and expansive villa living.',
          'Perfect for milestone trips where time in the room matters as much as time outside it.',
        ],
        amenities: [
          { icon: 'beach', title: 'Private Lagoon Access' },
          { icon: 'spa', title: 'Island Spa' },
          { icon: 'dining', title: 'Destination Dining' },
          { icon: 'wifi', title: 'Villa Connectivity' },
        ],
        suites: [
          {
            name: 'Water Retreat',
            price: '$4,200',
            badge: 'Slide to Lagoon',
            description:
              'Overwater villa with expansive deck, private pool, and direct lagoon entry.',
            image:
              'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
          },
        ],
        destinationSlugs: ['phu-quoc-island'],
      },
      {
        slug: '72-north-lodge',
        name: '72 North Lodge',
        location: 'Tromsø, Norway',
        address: 'Harbor Road 72, Tromsø, Norway',
        price: '$620',
        badge: 'Arctic Design',
        image:
          'https://images.unsplash.com/photo-1517823382935-39a2da4ecb33?auto=format&fit=crop&w=1600&q=80',
        description: [
          'A contemporary arctic lodge with restrained interiors, clear harbor views, and northern light access.',
          'Well suited to travelers who want winter atmosphere without expedition-level roughness.',
        ],
        amenities: [
          { icon: 'coffee', title: 'Fireplace Lounge' },
          { icon: 'spa', title: 'Sauna Ritual' },
          { icon: 'dining', title: 'Nordic Tasting Room' },
          { icon: 'wifi', title: 'Remote Work Ready' },
        ],
        suites: [
          {
            name: 'Aurora Room',
            price: '$780',
            badge: 'Northern View',
            description:
              'Warm timber room designed for winter stays and aurora watching.',
            image:
              'https://images.unsplash.com/photo-1517823382935-39a2da4ecb33?auto=format&fit=crop&w=1600&q=80',
          },
        ],
        destinationSlugs: ['nordic-fjords'],
      },
    ] satisfies {
      slug: string;
      name: string;
      location: string;
      address: string;
      price: string;
      badge: string;
      image: string;
      description: string[];
      amenities: { icon: string; title: string }[];
      suites: {
        name: string;
        price: string;
        badge: string;
        description: string;
        image: string;
      }[];
      destinationSlugs: string[];
    }[]
  ).map((hotel) => ({
    slug: hotel.slug,
    name: hotel.name,
    location: hotel.location,
    address: hotel.address,
    price: hotel.price,
    badge: hotel.badge,
    status: 'published',
    listingImage: hotel.image,
    heroImage: hotel.image,
    description: hotel.description,
    amenities: hotel.amenities,
    suites: hotel.suites,
    gallery: [{ image: hotel.image }, { image: hotel.image }],
    booking: {
      checkIn: 'May 24',
      checkOut: 'May 27',
      nightlyTotal: hotel.price,
      fee: '$45',
      nights: '3 Nights',
      rating: '4.9',
      travelers: '2 Adults',
      total: hotel.price,
    },
    destinationSlugs: hotel.destinationSlugs,
    inventory: genericHotelInventory,
  })),
];

export const seedTours: SeedTour[] = [
  {
    slug: 'bay-mau-coconut-forest',
    title: 'Bay Mau Coconut Forest by Basket Boat',
    badge: 'Featured',
    type: 'Half-Day Nature Experience',
    duration: '4.5 Hours',
    guests: 'Max 12 Guests',
    price: '$45',
    availability: 'Daily morning and afternoon departures',
    description: [
      'A soft-adventure Hoi An experience through the water coconut palms of Bay Mau, designed for travelers who want nature, local culture, and a relaxed half-day pace.',
      'Guests ride traditional basket boats with local rowers, learn simple fishing techniques, and move through narrow waterways that feel far quieter than the old-town streets.',
    ],
    shortDescription:
      'A relaxed Hoi An basket-boat journey through emerald coconut waterways, fishing traditions, and local riverside culture.',
    image: bayMauImage,
    heroImage: bayMauImage,
    subtitle:
      'Glide through Hoi An coconut palms with basket boats, local rowers, and gentle riverside traditions.',
    highlights: [
      {
        icon: 'boat',
        title: 'Basket Boat Ride',
        description:
          'Travel through shaded coconut canals in a traditional round bamboo boat with an experienced local rower.',
      },
      {
        icon: 'fish',
        title: 'Fishing Demonstration',
        description:
          'Try simple net-casting and crab-fishing techniques used by riverside families around Hoi An.',
      },
      {
        icon: 'eco',
        title: 'Low-Impact Nature Stop',
        description:
          'A compact excursion that adds greenery and local contact without taking a full day out of the itinerary.',
      },
    ],
    itinerary: [
      {
        title: 'Hotel Pick-up in Hoi An',
        description:
          'Meet your guide for a short transfer from the old town or nearby riverside hotels to Cam Thanh village.',
      },
      {
        title: 'Basket Boat Through Coconut Palms',
        description:
          'Board a bamboo basket boat, follow narrow channels, and watch local rowing and fishing demonstrations.',
      },
      {
        title: 'Riverside Tea and Return',
        description:
          'Pause for a light local refreshment before returning to Hoi An with the afternoon or evening still open.',
      },
    ],
    gallery: [
      { image: bayMauImage, layout: 'portrait' },
      {
        image:
          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Round-trip hotel pickup in Hoi An area',
      'English-speaking local host',
      'Basket boat ride with local rower',
      'Fishing demonstration and light refreshment',
    ],
    exclusions: [
      'Meals not mentioned in the itinerary',
      'Personal expenses and souvenirs',
      'Gratuities for guide and boat rower',
    ],
    destinationSlug: 'hoi-an-riverside',
    hotelSlugs: ['shining-riverside-hoi-an'],
    departures: genericTourDepartures,
  },
  {
    slug: 'hanoi-ninh-binh-heritage-loop',
    title: 'Hanoi and Ninh Binh Heritage Loop',
    badge: 'Featured',
    type: 'Private Cultural Journey',
    duration: '5 Days',
    guests: 'Max 10 Guests',
    price: '$980',
    availability: 'Weekly private starts',
    description: [
      'A compact northern Vietnam route pairing Hanoi street life with the limestone waterways and countryside rhythm of Ninh Binh.',
      'The itinerary keeps transfers simple and uses private guiding so travelers can move between old-quarter culture, food, temples, river caves, and cycling paths without a rushed group-tour feel.',
    ],
    shortDescription:
      'A five-day private journey through Hanoi food culture, old-quarter lanes, and Ninh Binh limestone scenery.',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'Old-quarter texture, countryside karsts, river caves, and northern cuisine in one efficient route.',
    highlights: [
      {
        icon: 'food',
        title: 'Hanoi Food Walk',
        description:
          'Explore coffee, noodles, grilled snacks, and neighborhood stories with a private local host.',
      },
      {
        icon: 'boat',
        title: 'Karst River Ride',
        description:
          'Move by sampan through limestone valleys and quiet waterways near Ninh Binh.',
      },
      {
        icon: 'camera',
        title: 'Countryside Viewpoints',
        description:
          'Time climbs and short rides for the best light across rice fields and limestone peaks.',
      },
    ],
    itinerary: [
      {
        title: 'Arrive in Hanoi',
        description:
          'Private arrival transfer, old-quarter orientation, and a gentle evening food walk.',
      },
      {
        title: 'Hanoi Culture and Coffee',
        description:
          'Visit historic neighborhoods, galleries, temples, and characterful coffee stops with flexible pacing.',
      },
      {
        title: 'Transfer to Ninh Binh',
        description:
          'Travel south for temple visits, countryside roads, and a sunset viewpoint when weather allows.',
      },
      {
        title: 'River Caves and Cycling',
        description:
          'Take a sampan ride through limestone scenery, then cycle village lanes before a relaxed lodge evening.',
      },
      {
        title: 'Return to Hanoi',
        description:
          'Morning at leisure before returning to Hanoi for onward flights or an extended stay.',
      },
    ],
    gallery: [
      {
        image:
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Private airport and intercity transfers',
      'Four nights in curated boutique accommodation',
      'Daily breakfast and selected local tastings',
      'Private English-speaking guides and entrance fees',
    ],
    exclusions: [
      'International and domestic flights',
      'Meals not listed as included',
      'Travel insurance and personal expenses',
    ],
    destinationSlug: 'ninh-binh-karsts',
    hotelSlugs: [],
    departures: genericTourDepartures,
  },
  {
    slug: 'hue-da-nang-hoi-an-coastal-heritage',
    title: 'Hue, Da Nang and Hoi An Coastal Heritage',
    badge: 'New',
    type: 'Private Multi-City Journey',
    duration: '7 Days',
    guests: 'Max 12 Guests',
    price: '$1,420',
    availability: 'Twice monthly departures',
    description: [
      'A central Vietnam journey built around imperial history, coastal comfort, and lantern-lit heritage streets.',
      'This route connects Hue, Da Nang, and Hoi An with private transfers and enough downtime to enjoy resort facilities, old-town evenings, and regional cuisine.',
    ],
    shortDescription:
      'A polished central Vietnam route through Hue imperial sites, Da Nang beach time, and Hoi An heritage evenings.',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'Imperial gardens, coastal resort rhythm, and lantern-lit Hoi An in one easy central Vietnam itinerary.',
    highlights: [
      {
        icon: 'map',
        title: 'Three-City Routing',
        description:
          'Connect Hue, Da Nang, and Hoi An without backtracking or heavy transfer days.',
      },
      {
        icon: 'food',
        title: 'Central Vietnamese Cuisine',
        description:
          'Taste Hue garden-house dishes, coastal seafood, and Hoi An market flavors.',
      },
      {
        icon: 'hotel',
        title: 'Beach and Riverside Stays',
        description:
          'Balance heritage touring with resort time and atmospheric riverside evenings.',
      },
    ],
    itinerary: [
      {
        title: 'Arrive in Hue',
        description:
          'Settle into a calm heritage stay and begin with a slow Perfume River orientation.',
      },
      {
        title: 'Imperial Hue',
        description:
          'Visit the citadel, royal tombs, and a garden house lunch with a private guide.',
      },
      {
        title: 'Hai Van Pass to Da Nang',
        description:
          'Drive the scenic coastal pass with viewpoints before reaching a beach resort base.',
      },
      {
        title: 'Hoi An Old Town',
        description:
          'Move to Hoi An for lantern streets, tailoring lanes, and a relaxed riverside dinner.',
      },
      {
        title: 'Market, Cooking and Coast',
        description:
          'Spend the final days between a market-led cooking session, beach time, and optional countryside cycling.',
      },
    ],
    gallery: [
      {
        image:
          'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Six nights in curated hotel stays',
      'Private transfers between Hue, Da Nang, and Hoi An',
      'Guided heritage visits and selected entrance fees',
      'Daily breakfast and two hosted dining experiences',
    ],
    exclusions: [
      'Flights to Hue or Da Nang',
      'Optional spa, tailoring, and beach activities',
      'Personal expenses and gratuities',
    ],
    destinationSlug: 'hoi-an-riverside',
    hotelSlugs: ['shining-riverside-hoi-an', 'villa-marittima'],
    departures: genericTourDepartures,
  },
  {
    slug: 'sapa-ha-giang-highland-road',
    title: 'Sa Pa and Ha Giang Highland Road',
    type: 'Scenic Road Journey',
    duration: '8 Days',
    guests: 'Max 8 Guests',
    price: '$1,680',
    availability: 'Best from September to April',
    description: [
      'A northern highland road journey for travelers who want dramatic mountain scenery, terraced valleys, and village encounters without losing comfort.',
      'The route uses private vehicles, selected lodges, and flexible daily pacing so the landscape remains the focus rather than the mileage.',
    ],
    shortDescription:
      'A private northern highland road journey through Sa Pa terraces, Ha Giang passes, and village landscapes.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'Terraced valleys, limestone passes, cooler air, and highland villages with a comfortable private route.',
    highlights: [
      {
        icon: 'mountain',
        title: 'Highland Passes',
        description:
          'Drive scenic mountain roads with frequent viewpoint stops and flexible photography time.',
      },
      {
        icon: 'walk',
        title: 'Village Walks',
        description:
          'Take moderated walks through terraced valleys and market villages with local context.',
      },
      {
        icon: 'hotel',
        title: 'Selected Lodges',
        description:
          'Stay in simple but characterful properties chosen for setting and warmth.',
      },
    ],
    itinerary: [
      {
        title: 'Hanoi to Sa Pa',
        description:
          'Travel north into the mountains and settle into a lodge with valley views.',
      },
      {
        title: 'Sa Pa Terraces',
        description:
          'Explore rice terraces, village paths, and market stops at a gentle pace.',
      },
      {
        title: 'Road to Ha Giang',
        description:
          'Move east through changing mountain scenery with a private driver and guide.',
      },
      {
        title: 'Dong Van Karst Plateau',
        description:
          'Spend two days around limestone passes, old towns, and dramatic viewpoints.',
      },
      {
        title: 'Return Through the Valleys',
        description:
          'Descend slowly toward Hanoi with a final rural lunch and transfer support.',
      },
    ],
    gallery: [
      {
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Private vehicle and experienced mountain driver',
      'Seven nights in selected lodges and boutique stays',
      'English-speaking guide throughout highland routing',
      'Daily breakfast and selected lunches on travel days',
    ],
    exclusions: [
      'Personal trekking gear',
      'Optional motorbike upgrades',
      'Travel insurance and personal expenses',
    ],
    destinationSlug: 'ha-giang-loop',
    hotelSlugs: ['amangiri'],
    departures: genericTourDepartures,
  },
  {
    slug: 'mekong-delta-slow-water-week',
    title: 'Mekong Delta Slow Water Week',
    badge: 'Seasonal',
    type: 'Slow Culture Journey',
    duration: '6 Days',
    guests: 'Max 10 Guests',
    price: '$1,150',
    availability: 'Monthly departures',
    description: [
      'A slower southern Vietnam journey through waterways, orchards, garden houses, and market mornings in the Mekong Delta.',
      'The experience is designed for travelers who prefer river culture and local rhythm over crowded checklist sightseeing.',
    ],
    shortDescription:
      'A gentle Mekong Delta route with private boats, garden houses, floating markets, and southern hospitality.',
    image:
      'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'Private boats, garden houses, floating markets, and warm southern hospitality at a slower pace.',
    highlights: [
      {
        icon: 'boat',
        title: 'Private Waterway Travel',
        description:
          'Move by private boat through small canals, river crossings, and floating market approaches.',
      },
      {
        icon: 'food',
        title: 'Garden House Meals',
        description:
          'Share regional dishes, tropical fruit, and tea in family-run garden settings.',
      },
      {
        icon: 'eco',
        title: 'Slow Delta Rhythm',
        description:
          'Build in time for hammocks, cycling lanes, and mornings that start before the heat.',
      },
    ],
    itinerary: [
      {
        title: 'Ho Chi Minh City to Ben Tre',
        description:
          'Leave the city for coconut groves, small boats, and a relaxed riverside stay.',
      },
      {
        title: 'Garden Houses and Cycling',
        description:
          'Visit orchards, family workshops, and village lanes by bike and boat.',
      },
      {
        title: 'Can Tho Floating Market',
        description:
          'Rise early for river trading scenes before a late breakfast and market walk.',
      },
      {
        title: 'Delta Leisure Day',
        description:
          'Keep a lighter day for local cooking, hammocks, or an optional countryside ride.',
      },
      {
        title: 'Return to Ho Chi Minh City',
        description:
          'Travel back with a final lunch stop and onward transfer support.',
      },
    ],
    gallery: [
      {
        image:
          'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Five nights in boutique river and city stays',
      'Private transfers and private boat segments',
      'Guided market visits and garden-house experiences',
      'Daily breakfast and selected local meals',
    ],
    exclusions: [
      'Domestic or international flights',
      'Alcoholic beverages unless specified',
      'Personal expenses and guide gratuities',
    ],
    destinationSlug: 'mekong-delta',
    hotelSlugs: [],
    departures: genericTourDepartures,
  },
  {
    slug: 'phu-quoc-island-retreat',
    title: 'Phu Quoc Island Retreat',
    badge: 'Featured',
    type: 'Beach Retreat',
    duration: '5 Days',
    guests: 'Private Stay',
    price: '$1,320',
    availability: 'Flexible daily starts',
    description: [
      'A relaxed island extension for travelers who want beach time, sunset pacing, and a softer ending after a Vietnam route.',
      'The itinerary keeps structure light: private arrival support, selected resort time, optional snorkeling, and enough open space for slow mornings.',
    ],
    shortDescription:
      'A flexible Phu Quoc island retreat with beach downtime, sunset dining, optional snorkeling, and private transfer support.',
    image:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'Soft island days, warm water, private resort time, and sunset dining after a busier Vietnam route.',
    highlights: [
      {
        icon: 'hotel',
        title: 'Resort-Led Pacing',
        description:
          'Stay near the water with flexible days designed around rest rather than constant transfers.',
      },
      {
        icon: 'boat',
        title: 'Optional Snorkeling',
        description:
          'Add a private boat day to nearby islands when sea conditions are favorable.',
      },
      {
        icon: 'sparkles',
        title: 'Milestone-Friendly',
        description:
          'A strong option for honeymoons, anniversaries, or decompression after cultural touring.',
      },
    ],
    itinerary: [
      {
        title: 'Arrive on Phu Quoc',
        description:
          'Private airport greeting and transfer to a selected beach resort.',
      },
      {
        title: 'Island Leisure',
        description:
          'Unstructured day for the pool, spa, beach, or a guided local market visit.',
      },
      {
        title: 'Optional Boat Day',
        description:
          'Choose snorkeling, fishing, or a private coastal cruise depending on season and sea conditions.',
      },
      {
        title: 'Sunset Dinner',
        description:
          'Reserve a relaxed seafood dinner or private beach setup for the final evening.',
      },
      {
        title: 'Departure Support',
        description:
          'Private transfer to the airport with onward connection guidance.',
      },
    ],
    gallery: [
      {
        image:
          'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Four nights in a curated island resort',
      'Private airport transfers',
      'Daily breakfast',
      'One hosted sunset dining arrangement',
    ],
    exclusions: [
      'Flights to and from Phu Quoc',
      'Optional boat charter and spa treatments',
      'Meals not specified in the itinerary',
    ],
    destinationSlug: 'phu-quoc-island',
    hotelSlugs: ['soneva-jani'],
    departures: genericTourDepartures,
  },
  {
    slug: 'london-design-and-gallery-week',
    title: 'London Design and Gallery Week',
    type: 'Urban Culture Journey',
    duration: '6 Days',
    guests: 'Max 8 Guests',
    price: '$2,450',
    availability: 'Private starts on request',
    description: [
      'A London itinerary for travelers who prefer galleries, design hotels, architecture, restaurants, and neighborhoods over a monuments-only city break.',
      'Private hosts help shape each day around current exhibitions, reservations, and the guest rhythm, keeping the route polished but not overprogrammed.',
    ],
    shortDescription:
      'A culture-led London week built around galleries, design neighborhoods, architecture, and refined dining.',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'A polished London city route through galleries, design hotels, restaurants, and characterful neighborhoods.',
    highlights: [
      {
        icon: 'camera',
        title: 'Gallery Access',
        description:
          'Plan around major museums, smaller galleries, and current exhibitions with private host support.',
      },
      {
        icon: 'coffee',
        title: 'Neighborhood Days',
        description:
          'Balance Mayfair and South Bank with Shoreditch, Notting Hill, or Hampstead depending on interests.',
      },
      {
        icon: 'food',
        title: 'Curated Dining',
        description:
          'Use reservation support for restaurants, wine bars, and design-led dining rooms.',
      },
    ],
    itinerary: [
      {
        title: 'Arrive and Settle In',
        description:
          'Private airport transfer, hotel check-in, and a low-pressure neighborhood dinner.',
      },
      {
        title: 'Classic London Reframed',
        description:
          'See landmark areas through architecture, design, and social history rather than a standard checklist.',
      },
      {
        title: 'Gallery and Museum Day',
        description:
          'Pair major collections with smaller gallery visits based on current programming.',
      },
      {
        title: 'Design Neighborhoods',
        description:
          'Explore boutiques, studios, bookstores, and restaurants across two contrasting neighborhoods.',
      },
      {
        title: 'Private Leisure and Dining',
        description:
          'Keep a flexible final day for shopping, spa, or a special dining reservation.',
      },
    ],
    gallery: [
      {
        image:
          'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
      {
        image:
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Five nights in a curated design hotel',
      'Private airport transfers',
      'Two privately hosted culture walks',
      'Restaurant planning and reservation support',
    ],
    exclusions: [
      'International flights',
      'Museum special exhibition tickets where separately priced',
      'Meals and drinks unless specified',
    ],
    destinationSlug: 'london-essence',
    hotelSlugs: ['aman-tokyo'],
    departures: genericTourDepartures,
  },
  {
    slug: 'nordic-fjords-scenic-expedition',
    title: 'Nordic Fjords Scenic Expedition',
    badge: 'Featured',
    type: 'Nature and Design Journey',
    duration: '9 Days',
    guests: 'Max 10 Guests',
    price: '$3,950',
    availability: 'May to September departures',
    description: [
      'A scenic Nordic route through fjords, coastal villages, quiet roads, and design-forward lodge stays.',
      'The journey is built for long light, water-level perspectives, and measured days that avoid turning the landscape into a checklist.',
    ],
    shortDescription:
      'A nine-day scenic journey through Nordic fjords, coastal villages, private boats, and design-led lodge stays.',
    image: nordicFjordsImage,
    heroImage:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85',
    subtitle:
      'Cinematic fjords, quiet harbor towns, private boat segments, and restrained Nordic design stays.',
    highlights: [
      {
        icon: 'boat',
        title: 'Fjord-Level Views',
        description:
          'Use ferries and private boat segments to experience the scenery from the water, not only the road.',
      },
      {
        icon: 'mountain',
        title: 'Scenic Roads',
        description:
          'Travel through dramatic passes and viewpoints with sensible daily drive times.',
      },
      {
        icon: 'hotel',
        title: 'Design Lodges',
        description:
          'Stay in atmospheric lodges and hotels selected for view, warmth, and architecture.',
      },
    ],
    itinerary: [
      {
        title: 'Arrive in Bergen',
        description:
          'Private arrival support and a calm harbor orientation before dinner.',
      },
      {
        title: 'Fjord Transfer Day',
        description:
          'Move by road and water toward a scenic lodge with stops for short walks and viewpoints.',
      },
      {
        title: 'Private Boat and Village Visit',
        description:
          'Spend the day on quieter waterways, visiting a small village and local producer when available.',
      },
      {
        title: 'High Road Viewpoints',
        description:
          'Drive a dramatic scenic route with flexible timing for weather and photography.',
      },
      {
        title: 'Coastal Design Stay',
        description:
          'Finish with a slower coastal base, sauna time, and a final Nordic tasting dinner.',
      },
    ],
    gallery: [
      { image: nordicFjordsImage, layout: 'landscape' },
      {
        image:
          'https://images.unsplash.com/photo-1517823382935-39a2da4ecb33?auto=format&fit=crop&w=1600&q=80',
        layout: 'portrait',
      },
      {
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
        layout: 'landscape',
      },
    ],
    inclusions: [
      'Eight nights in curated hotels and lodges',
      'Private transfers and selected ferry segments',
      'Private boat experience on one fjord day',
      'Daily breakfast and one Nordic tasting dinner',
    ],
    exclusions: [
      'Flights to and from Scandinavia',
      'Optional helicopter or premium boat upgrades',
      'Personal expenses and travel insurance',
    ],
    destinationSlug: 'nordic-fjords',
    hotelSlugs: ['72-north-lodge'],
    departures: genericTourDepartures,
  },
];
type SeedBlogImageSet = {
  image: string;
  heroImage: string;
  inlineImage: string;
  secondaryImage: string;
};

type SeedBlogPostDraft = Omit<
  SeedBlogPost,
  | 'image'
  | 'heroImage'
  | 'inlineImage'
  | 'secondaryFeature'
  | 'relatedPosts'
  | 'seo'
> & {
  relatedSlugs: string[];
  seoDescription: string;
  seoTitle?: string;
  secondaryFeature: {
    title: string;
    body: string;
  };
};

function requireDestination(slug: string) {
  const destination = seedDestinations.find((item) => item.slug === slug);

  if (!destination) {
    throw new Error(`Missing destination seed ${slug}.`);
  }

  return destination;
}

function requireTour(slug: string) {
  const tour = seedTours.find((item) => item.slug === slug);

  if (!tour) {
    throw new Error(`Missing tour seed ${slug}.`);
  }

  return tour;
}

function requireHotel(slug: string) {
  const hotel = seedHotels.find((item) => item.slug === slug);

  if (!hotel) {
    throw new Error(`Missing hotel seed ${slug}.`);
  }

  return hotel;
}

function buildBlogSections(
  openingHeading: string,
  openingBody: [string, string],
  middleHeading: string,
  middleBody: [string, string],
  closingHeading: string,
  closingBody: string[],
) {
  return [
    { heading: openingHeading, body: openingBody },
    { heading: middleHeading, body: middleBody },
    { heading: closingHeading, body: closingBody },
  ];
}

const seedBlogImageSets = {
  'hoi-an-lantern-mornings': {
    image: requireDestination('hoi-an-riverside').image,
    heroImage: requireHotel('shining-riverside-hoi-an').heroImage,
    inlineImage: requireTour('bay-mau-coconut-forest').image,
    secondaryImage: requireDestination('da-nang-coast').image,
  },
  'ninh-binh-weekend-notes': {
    image: requireDestination('ninh-binh-karsts').image,
    heroImage: requireTour('hanoi-ninh-binh-heritage-loop').heroImage,
    inlineImage: requireDestination('hanoi-old-quarter').image,
    secondaryImage: requireDestination('ninh-binh-karsts').heroImage,
  },
  'hue-da-nang-hoi-an-route': {
    image: requireDestination('hue-imperial-city').image,
    heroImage: requireTour('hue-da-nang-hoi-an-coastal-heritage').heroImage,
    inlineImage: requireDestination('da-nang-coast').image,
    secondaryImage: requireDestination('hoi-an-riverside').image,
  },
  'ha-giang-pass-mornings': {
    image: requireDestination('ha-giang-loop').image,
    heroImage: requireTour('sapa-ha-giang-highland-road').heroImage,
    inlineImage: requireDestination('sa-pa-highlands').image,
    secondaryImage: requireDestination('ha-giang-loop').heroImage,
  },
  'mekong-delta-slow-days': {
    image: requireDestination('mekong-delta').image,
    heroImage: requireTour('mekong-delta-slow-water-week').heroImage,
    inlineImage: requireDestination('mekong-delta').heroImage,
    secondaryImage: requireDestination('mekong-delta').image,
  },
  'phu-quoc-after-the-crowds': {
    image: requireDestination('phu-quoc-island').image,
    heroImage: requireTour('phu-quoc-island-retreat').heroImage,
    inlineImage: requireHotel('soneva-jani').listingImage,
    secondaryImage: requireDestination('phu-quoc-island').heroImage,
  },
  'hanoi-old-quarter-after-dark': {
    image: requireDestination('hanoi-old-quarter').image,
    heroImage: requireDestination('hanoi-old-quarter').heroImage,
    inlineImage: requireTour('hanoi-ninh-binh-heritage-loop').image,
    secondaryImage: requireDestination('ninh-binh-karsts').image,
  },
  'bay-mau-half-day-guide': {
    image: requireTour('bay-mau-coconut-forest').image,
    heroImage: requireDestination('hoi-an-riverside').heroImage,
    inlineImage: requireHotel('shining-riverside-hoi-an').listingImage,
    secondaryImage: requireDestination('hoi-an-riverside').image,
  },
  'london-gallery-weekend': {
    image: requireDestination('london-essence').image,
    heroImage: requireTour('london-design-and-gallery-week').heroImage,
    inlineImage: requireDestination('london-essence').heroImage,
    secondaryImage: requireTour('london-design-and-gallery-week').image,
  },
  'nordic-fjords-light-guide': {
    image: requireDestination('nordic-fjords').image,
    heroImage: requireTour('nordic-fjords-scenic-expedition').heroImage,
    inlineImage: requireHotel('72-north-lodge').listingImage,
    secondaryImage: requireDestination('nordic-fjords').heroImage,
  },
} satisfies Record<string, SeedBlogImageSet>;

const seedBlogPostDrafts: SeedBlogPostDraft[] = [
  {
    slug: 'hoi-an-lantern-mornings',
    title:
      '3 Days in Hoi An: Lantern Streets, Riverside Cafes, and Slow Mornings',
    excerpt:
      'A practical Hoi An guide for travelers who want old-town atmosphere, the right riverside base, and enough free time to enjoy the city after dark.',
    category: 'Guides',
    author: 'TouristWeb Editorial',
    status: 'published',
    publishedAt: new Date('2025-05-12T00:00:00.000Z'),
    readingTime: '7 min read',
    intro:
      'Hoi An works best when the itinerary is edited down. One riverside hotel, one half-day excursion, and plenty of room for lantern-lit evenings will usually outperform a schedule packed with checklists.',
    meta: 'Central Vietnam guide • 7 min read',
    quote:
      'The most memorable Hoi An trip is rarely the busiest one; it is the one that leaves enough time to walk back across the bridge after dinner.',
    sections: buildBlogSections(
      'Base Yourself Where the Old Town Is Reachable',
      [
        'Staying close to the river keeps the Ancient Town walkable without trapping you in the busiest lanes all day. That balance is what makes Hoi An feel atmospheric rather than tiring.',
        'A good base also changes the rhythm of the trip: sunrise coffee is easy, an afternoon reset is realistic, and dinner does not require logistics.',
      ],
      'Use One Half-Day for the Countryside',
      [
        'The smartest add-on is something compact like Bay Mau, where you get greenery, local contact, and a change of pace without losing a full day.',
        'That keeps the rest of the itinerary light enough for tailoring appointments, market stops, and the slower evening hours that make Hoi An worth staying for.',
      ],
      'Protect the Evenings',
      [
        'Lantern time is the city’s real advantage. Leave the late afternoon open, return to the hotel if you need to, and come back out once the light softens and the riverfront starts to glow.',
      ],
    ),
    secondaryFeature: {
      title: 'The Riverside Hotel Question',
      body: 'If you only optimize one part of the stay, optimize the base. A calm riverside hotel does more for the trip than adding one more day tour.',
    },
    relatedSlugs: [
      'bay-mau-half-day-guide',
      'hue-da-nang-hoi-an-route',
      'phu-quoc-after-the-crowds',
    ],
    seoDescription:
      'A 3-day Hoi An travel guide covering where to stay, how to pace the old town, and which half-day experiences actually fit the city well.',
    mentionedDestinationSlugs: ['hoi-an-riverside', 'da-nang-coast'],
    mentionedTourSlugs: [
      'bay-mau-coconut-forest',
      'hue-da-nang-hoi-an-coastal-heritage',
    ],
    mentionedHotelSlugs: ['shining-riverside-hoi-an'],
  },
  {
    slug: 'ninh-binh-weekend-notes',
    title:
      '2 Nights in Ninh Binh: Boats, Karsts, and the Right Base Near Hanoi',
    excerpt:
      'How to turn Ninh Binh into a clean overnight escape from Hanoi instead of a rushed day trip with too much driving and too little atmosphere.',
    category: 'Planning',
    author: 'Lan Nguyen',
    status: 'published',
    publishedAt: new Date('2025-05-04T00:00:00.000Z'),
    readingTime: '6 min read',
    intro:
      'Ninh Binh is one of the easiest wins in northern Vietnam, but only if you stop treating it like a same-day detour. One overnight stay changes the whole feel of the place.',
    meta: 'North Vietnam planning • 6 min read',
    quote:
      'The best Ninh Binh route is not the one that checks off the most stops; it is the one that gives the landscape enough time to do its work.',
    sections: buildBlogSections(
      'Why an Overnight Stay Matters',
      [
        'From Hanoi, the temptation is to force Ninh Binh into a single long day. That usually turns the scenery into a sequence of transfers rather than an experience.',
        'Two nights is enough to split the boat ride, temple visits, and countryside views into smaller pieces that actually feel relaxed.',
      ],
      'Use Hanoi as the Urban Counterpoint',
      [
        'The route works especially well when paired with Hanoi. One city gives you density, food, and movement; the other gives you air, water, and visual distance.',
        'That contrast is what makes the itinerary coherent. Without Hanoi, Ninh Binh can feel too quiet; without Ninh Binh, Hanoi can feel too compressed.',
      ],
      'Book the Scenic Hours, Not Every Hour',
      [
        'Prioritize morning boat departures and one late-afternoon viewpoint. Beyond that, the region rewards underplanning more than overplanning.',
      ],
    ),
    secondaryFeature: {
      title: 'Day Trip vs Overnight',
      body: 'If your schedule allows it, the overnight version wins almost every time. It trades speed for atmosphere, and that is exactly what Ninh Binh is good at.',
    },
    relatedSlugs: [
      'hanoi-old-quarter-after-dark',
      'ha-giang-pass-mornings',
      'mekong-delta-slow-days',
    ],
    seoDescription:
      'A Ninh Binh weekend guide from Hanoi with practical advice on timing, overnight pacing, and which scenic windows are worth planning around.',
    mentionedDestinationSlugs: ['ninh-binh-karsts', 'hanoi-old-quarter'],
    mentionedTourSlugs: ['hanoi-ninh-binh-heritage-loop'],
    mentionedHotelSlugs: [],
  },
  {
    slug: 'hue-da-nang-hoi-an-route',
    title: 'How to Split One Week Between Hue, Da Nang, and Hoi An',
    excerpt:
      'A one-week Central Vietnam route that balances imperial history, beach downtime, and Hoi An evenings without turning the trip into constant hotel changes.',
    category: 'Itineraries',
    author: 'Minh Chau',
    status: 'published',
    publishedAt: new Date('2025-04-29T00:00:00.000Z'),
    readingTime: '8 min read',
    intro:
      'This route works because each stop does something different. Hue gives the trip structure, Da Nang gives it breath, and Hoi An gives it atmosphere.',
    meta: '1-week itinerary • 8 min read',
    quote:
      'Central Vietnam feels most polished when you let each city play its own role instead of asking one place to do everything.',
    sections: buildBlogSections(
      'Start in Hue for Context',
      [
        'Hue is not the stop to rush. Beginning there gives the trip a historical backbone and makes the food, architecture, and slower tone of the region much easier to read.',
        'Two nights is usually enough to visit the major imperial sites while still keeping one evening for a garden-house dinner or a quieter river walk.',
      ],
      'Use Da Nang as Recovery Space',
      [
        'Da Nang is less about sightseeing density and more about making the route livable. A beach afternoon or a resort night keeps the middle of the trip from feeling overpacked.',
        'That breathing room is what lets Hoi An land well later. Arriving there rested is very different from arriving after too many back-to-back touring days.',
      ],
      'End in Hoi An',
      [
        'Hoi An is strongest as the closing note because it holds the evenings so well. Save room for the riverfront, tailoring, cafés, and a final half-day in the nearby countryside.',
      ],
    ),
    secondaryFeature: {
      title: 'When to Move Hotels',
      body: 'The route gets messy when you over-segment it. Keep Hue and Hoi An as the real anchors, and let Da Nang act as a flexible middle chapter.',
    },
    relatedSlugs: [
      'hoi-an-lantern-mornings',
      'bay-mau-half-day-guide',
      'phu-quoc-after-the-crowds',
    ],
    seoDescription:
      'A practical one-week Central Vietnam itinerary covering Hue, Da Nang, and Hoi An with pacing advice for culture, coast, and slow evenings.',
    mentionedDestinationSlugs: [
      'hue-imperial-city',
      'da-nang-coast',
      'hoi-an-riverside',
    ],
    mentionedTourSlugs: ['hue-da-nang-hoi-an-coastal-heritage'],
    mentionedHotelSlugs: ['shining-riverside-hoi-an'],
  },
  {
    slug: 'ha-giang-pass-mornings',
    title:
      'The Ha Giang Loop Without the Rush: Viewpoints, Villages, and Weather Windows',
    excerpt:
      'A calmer take on the Ha Giang route for travelers who want mountain drama without turning every day into a race against the next viewpoint.',
    category: 'Adventure',
    author: 'TouristWeb Editorial',
    status: 'published',
    publishedAt: new Date('2025-04-22T00:00:00.000Z'),
    readingTime: '7 min read',
    intro:
      'Ha Giang becomes more impressive when you stop trying to conquer it. The mountain roads are already the spectacle; the smarter move is to pace the loop around weather and energy.',
    meta: 'Highland road notes • 7 min read',
    quote:
      'Mountain travel gets better the moment you stop counting viewpoints and start paying attention to the quality of the hours between them.',
    sections: buildBlogSections(
      'Treat the Road as the Main Event',
      [
        'The strongest Ha Giang itineraries are built around driving windows, not only stop lists. Cloud, visibility, and how fresh the group feels matter more than squeezing in one extra pass.',
        'That is why private pacing beats the rushed loop mentality. The scenery is too good to turn into a stopwatch exercise.',
      ],
      'Pair It with Sa Pa Carefully',
      [
        'Sa Pa and Ha Giang can work together, but only if you accept that they deliver different kinds of mountain days. Sa Pa is more settled and accessible; Ha Giang is more road-driven and open-ended.',
        'Use Sa Pa as the softer approach and Ha Giang as the more dramatic second chapter, not the other way around.',
      ],
      'Leave Margin for Weather',
      [
        'The single most useful planning tool in the north is flexibility. A delayed start or an extra tea stop is often what protects the best mountain light later in the day.',
      ],
    ),
    secondaryFeature: {
      title: 'Why One Spare Hour Matters',
      body: 'In Ha Giang, an unallocated hour is not wasted time. It is what lets you wait for the clouds to lift or linger when the road suddenly becomes extraordinary.',
    },
    relatedSlugs: [
      'ninh-binh-weekend-notes',
      'nordic-fjords-light-guide',
      'hanoi-old-quarter-after-dark',
    ],
    seoDescription:
      'A practical Ha Giang Loop guide on pacing, weather, and how to combine the route with Sa Pa without exhausting the trip.',
    mentionedDestinationSlugs: ['ha-giang-loop', 'sa-pa-highlands'],
    mentionedTourSlugs: ['sapa-ha-giang-highland-road'],
    mentionedHotelSlugs: [],
  },
  {
    slug: 'mekong-delta-slow-days',
    title:
      'Mekong Delta at a Slower Pace: Floating Markets, Garden Houses, and Canal Mornings',
    excerpt:
      'A south Vietnam guide for travelers who want the Mekong as a lived-in region, not just a quick photo stop on the way back to the city.',
    category: 'Slow Travel',
    author: 'Thu Pham',
    status: 'published',
    publishedAt: new Date('2025-04-16T00:00:00.000Z'),
    readingTime: '6 min read',
    intro:
      'The Mekong Delta is at its best when the schedule loosens. Boats, hammocks, orchard paths, and family-run meals all need more time than a standard “in-and-out” day tour usually allows.',
    meta: 'South Vietnam guide • 6 min read',
    quote:
      'The Delta does not need embellishment; it needs enough time for the quiet details to become visible.',
    sections: buildBlogSections(
      'Go Early for the Water',
      [
        'Morning is not just cooler, it is also when the canals still feel like working space rather than scenery. That changes the whole tone of the visit.',
        'If you start too late, the region flattens quickly. The best part of the Delta is its first few hours of movement.',
      ],
      'Sleep in the Region if You Can',
      [
        'An overnight stay gives the route a different depth. You get evening quiet, breakfast without transfers, and the chance to see the waterways before the day fully opens.',
        'That is also when garden-house hospitality begins to matter. The best stays keep the pace modest and the setting personal.',
      ],
      'Let One Day Stay Light',
      [
        'You do not need nonstop activities here. One slower afternoon for tea, a short cycle, or a nap in the shade is often what makes the Delta memorable.',
      ],
    ),
    secondaryFeature: {
      title: 'The Garden House Advantage',
      body: 'The Delta becomes more specific when you stay somewhere small enough to feel domestic. Big logistics can still work, but smaller hospitality fits the landscape better.',
    },
    relatedSlugs: [
      'phu-quoc-after-the-crowds',
      'hoi-an-lantern-mornings',
      'ninh-binh-weekend-notes',
    ],
    seoDescription:
      'A Mekong Delta slow-travel guide on floating markets, overnight pacing, and the quieter experiences that make southern Vietnam feel distinct.',
    mentionedDestinationSlugs: ['mekong-delta'],
    mentionedTourSlugs: ['mekong-delta-slow-water-week'],
    mentionedHotelSlugs: [],
  },
  {
    slug: 'phu-quoc-after-the-crowds',
    title:
      'Phu Quoc Beyond the Resort Brochure: Quiet Beaches, Late Sunsets, and Easy Days',
    excerpt:
      'A Phu Quoc guide for travelers who want the island as a soft landing after a busier route, not as a schedule full of transfer-heavy excursions.',
    category: 'Beach Escapes',
    author: 'TouristWeb Editorial',
    status: 'published',
    publishedAt: new Date('2025-04-11T00:00:00.000Z'),
    readingTime: '5 min read',
    intro:
      'Phu Quoc is strongest as a decompression stop. If you ask it to be a theme park, it disappoints. If you ask it to be your slow final chapter, it tends to deliver.',
    meta: 'Island retreat • 5 min read',
    quote:
      'A good island ending is not defined by how much you did. It is defined by how little logistics you had to think about.',
    sections: buildBlogSections(
      'Use the Island as a Reset',
      [
        'Phu Quoc makes the most sense after a route with more movement. It is where you trade temple tickets and transfer times for long breakfasts and water views.',
        'That only works if you choose a property that can hold the day well. On this island, the hotel is part of the itinerary.',
      ],
      'Keep One Optional Excursion',
      [
        'A private boat or snorkeling day is enough. The mistake is planning too many excursions on an island that is supposed to reduce friction.',
        'One good outing plus generous hotel time usually feels more luxurious than trying to prove you used every daylight hour.',
      ],
      'Book for Sunset, Not Only for Price',
      [
        'The right side of the island and the right room orientation matter more here than squeezing for the lowest nightly rate. Sunsets are part of the product.',
      ],
    ),
    secondaryFeature: {
      title: 'Why the Room Matters More Here',
      body: 'On a beach extension, the villa, suite, or deck becomes part of the emotional payoff. That is why Phu Quoc rewards better room selection more than many other stops.',
    },
    relatedSlugs: [
      'hoi-an-lantern-mornings',
      'mekong-delta-slow-days',
      'hue-da-nang-hoi-an-route',
    ],
    seoDescription:
      'A Phu Quoc travel guide focused on quieter island pacing, better hotel choices, and how to use the island as a soft ending to a Vietnam trip.',
    mentionedDestinationSlugs: ['phu-quoc-island'],
    mentionedTourSlugs: ['phu-quoc-island-retreat'],
    mentionedHotelSlugs: ['soneva-jani'],
  },
  {
    slug: 'hanoi-old-quarter-after-dark',
    title: 'A Hanoi Old Quarter Food Walk That Actually Leaves Time to Breathe',
    excerpt:
      'How to experience Hanoi at night without turning the Old Quarter into an exhausting sequence of reservations, queues, and hurried street-food stops.',
    category: 'City Breaks',
    author: 'Anh Dao',
    status: 'published',
    publishedAt: new Date('2025-04-02T00:00:00.000Z'),
    readingTime: '5 min read',
    intro:
      'Hanoi at night is best discovered through a small radius. Pick one neighborhood, a few strong stops, and enough room to wander between them.',
    meta: 'City food walk • 5 min read',
    quote:
      'The Old Quarter does not reward speed. It rewards appetite, patience, and the willingness to let one alley lead to the next.',
    sections: buildBlogSections(
      'Shrink the Map',
      [
        'Trying to cover all of Hanoi in one evening is the fastest way to flatten the city. A smaller loop gives you time to read the architecture, the traffic rhythm, and the food scene together.',
        'That is why the best evenings are neighborhood-led rather than checklist-led. The city becomes more legible once the scale is manageable.',
      ],
      'Pair Street Stops with One Sit-Down Reset',
      [
        'An effective food walk alternates intensity. A bowl on the pavement, a coffee pause, a second quick bite, then one proper seated stop usually lands better than nonstop grazing.',
        'That structure also makes Hanoi easier to pair with Ninh Binh or other northern routes because you finish energized rather than overloaded.',
      ],
      'Save the Last Hour for Wandering',
      [
        'The final part of the evening should be unscripted. That is often when you find the bookshop, tea room, or small corner bar you remember most.',
      ],
    ),
    secondaryFeature: {
      title: 'Street Food and Sequence',
      body: 'The best Hanoi nights are edited, not maximalist. A strong sequence of three or four stops beats ten rushed ones almost every time.',
    },
    relatedSlugs: [
      'ninh-binh-weekend-notes',
      'hoi-an-lantern-mornings',
      'london-gallery-weekend',
    ],
    seoDescription:
      'A Hanoi Old Quarter night guide with practical advice on food-walk pacing, neighborhood scale, and how to build a better evening route.',
    mentionedDestinationSlugs: ['hanoi-old-quarter'],
    mentionedTourSlugs: ['hanoi-ninh-binh-heritage-loop'],
    mentionedHotelSlugs: [],
  },
  {
    slug: 'bay-mau-half-day-guide',
    title: 'Is Bay Mau Worth It? A Half-Day Coconut Forest Guide from Hoi An',
    excerpt:
      'A clear take on when the Bay Mau basket-boat trip works, when it feels too touristic, and how to fit it into a Hoi An stay without wasting the best hours in town.',
    category: 'Experiences',
    author: 'TouristWeb Editorial',
    status: 'published',
    publishedAt: new Date('2025-03-25T00:00:00.000Z'),
    readingTime: '4 min read',
    intro:
      'Bay Mau is not a full-day headline experience, and that is exactly why it can work so well. Treat it as a compact countryside contrast to Hoi An, not as the center of the trip.',
    meta: 'Half-day experience • 4 min read',
    quote:
      'The coconut forest is most useful as a change of texture, not as a reason to sacrifice the whole day.',
    sections: buildBlogSections(
      'Go with the Right Expectation',
      [
        'This is a short, accessible, photogenic outing. If you expect deep wilderness, you will be disappointed. If you expect a quick reset from the old town, it lands much better.',
        'That framing matters because Hoi An already has strong evening value. Any daytime add-on needs to respect that.',
      ],
      'Keep It Tight',
      [
        'The smartest version is a morning or late-afternoon slot with easy transfer support. That gives you the greenery, the basket boats, and the local contact without bloating the day.',
        'Afterward, a return to the hotel or a simple lunch nearby keeps the rest of the itinerary intact rather than fragmented.',
      ],
      'Use It to Support, Not Replace, Hoi An',
      [
        'Bay Mau is at its best when it supports a broader Hoi An stay: riverside hotel, old-town night, and one light countryside chapter.',
      ],
    ),
    secondaryFeature: {
      title: 'Best Pairing',
      body: 'If Bay Mau is on the schedule, pair it with a slower hotel afternoon and a strong Hoi An evening. That combination makes the half-day feel intentional instead of filler.',
    },
    relatedSlugs: [
      'hoi-an-lantern-mornings',
      'hue-da-nang-hoi-an-route',
      'mekong-delta-slow-days',
    ],
    seoDescription:
      'A practical Bay Mau Coconut Forest guide explaining how to fit the basket-boat experience into a Hoi An trip without overcommitting the day.',
    mentionedDestinationSlugs: ['hoi-an-riverside'],
    mentionedTourSlugs: ['bay-mau-coconut-forest'],
    mentionedHotelSlugs: ['shining-riverside-hoi-an'],
  },
  {
    slug: 'london-gallery-weekend',
    title: 'A Long Weekend in London for Gallery Days and Design Hotels',
    excerpt:
      'A London city-break template for travelers who want museums, smaller galleries, good hotel pacing, and neighborhoods that still feel alive after the landmarks.',
    category: 'City Breaks',
    author: 'Oliver Hart',
    status: 'published',
    publishedAt: new Date('2025-03-12T00:00:00.000Z'),
    readingTime: '6 min read',
    intro:
      'London gets better when you stop asking it to be a monuments sprint. Design hotels, one strong museum day, and two neighborhoods with different moods are enough for a polished long weekend.',
    meta: 'Culture weekend • 6 min read',
    quote:
      'The best London weekends feel curated, not crowded: one exhibition, one reservation, one neighborhood you did not mean to leave so soon.',
    sections: buildBlogSections(
      'Use the Hotel as an Anchor',
      [
        'In a city this large, the hotel does more than provide a bed. It decides how much friction sits between breakfast, your first neighborhood, and the part of the city you want at night.',
        'That is why location and atmosphere matter more than raw amenity count on a short London trip.',
      ],
      'One Major Museum Is Enough',
      [
        'Choose one primary institution for the day and let smaller galleries fill the edges. Trying to absorb too much visual material back to back usually flattens the experience.',
        'The city is best read in layers: museum, café, street, bookstore, dinner. Not museum after museum after museum.',
      ],
      'Finish in a Neighborhood, Not a Queue',
      [
        'Reserve your final evening for a district that still feels social after the day crowd disappears. London is strongest when the cultural route blends into ordinary city life.',
      ],
    ),
    secondaryFeature: {
      title: 'Why London Needs Editing',
      body: 'London offers almost too many viable options. The trick is not finding enough to do, but choosing a sequence that still leaves the weekend feeling composed.',
    },
    relatedSlugs: [
      'nordic-fjords-light-guide',
      'hanoi-old-quarter-after-dark',
      'phu-quoc-after-the-crowds',
    ],
    seoDescription:
      'A London long-weekend guide covering gallery pacing, neighborhood choices, and how to use a design-led hotel as the anchor for the route.',
    mentionedDestinationSlugs: ['london-essence'],
    mentionedTourSlugs: ['london-design-and-gallery-week'],
    mentionedHotelSlugs: [],
  },
  {
    slug: 'nordic-fjords-light-guide',
    title:
      'Nordic Fjords in Long Light: When to Go, Where to Stay, and How to Pace the Route',
    excerpt:
      'A practical fjords guide on seasonality, drive times, lodge choices, and why scenic routes in Scandinavia work best when the calendar stays generous.',
    category: 'Destination Guides',
    author: 'Freja Solberg',
    status: 'published',
    publishedAt: new Date('2025-02-20T00:00:00.000Z'),
    readingTime: '7 min read',
    intro:
      'The Nordic fjords are not difficult to love, but they are easy to mis-time. Long light, reasonable drive days, and one or two lodge bases do more for the route than trying to over-cover the map.',
    meta: 'Scenic expedition guide • 7 min read',
    quote:
      'Fjord travel is not about seeing every branch of the coastline. It is about giving one branch enough time to become immersive.',
    sections: buildBlogSections(
      'Plan for Light, Not Only for Temperature',
      [
        'The strongest fjord trips are built around daylight length as much as season. The extra evening hours change what is possible on the road and on the water.',
        'That also affects mood. Long northern light makes arrivals calmer and scenic stops less rushed.',
      ],
      'Choose Fewer Bases, Better Views',
      [
        'A route with two excellent stays usually performs better than one with four average ones. The lodges are part of the reward, not only a place to recover from driving.',
        'Once the hotels are chosen well, the whole trip feels more spacious. Meals improve, weather days become usable, and the landscape can breathe around the logistics.',
      ],
      'Let Water and Road Alternate',
      [
        'The route is strongest when you move between road perspective and water perspective. Seeing the same landscape from both scales is what gives the fjords their full effect.',
      ],
    ),
    secondaryFeature: {
      title: 'The Lodge Standard',
      body: 'In the fjords, a view-only hotel is not enough. The better properties also understand warmth, quiet public rooms, and the kind of pacing that suits long scenic days.',
    },
    relatedSlugs: [
      'ha-giang-pass-mornings',
      'london-gallery-weekend',
      'phu-quoc-after-the-crowds',
    ],
    seoDescription:
      'A Nordic fjords travel guide with advice on long-light seasonality, lodge selection, and how to pace a scenic Scandinavia route properly.',
    mentionedDestinationSlugs: ['nordic-fjords'],
    mentionedTourSlugs: ['nordic-fjords-scenic-expedition'],
    mentionedHotelSlugs: ['72-north-lodge'],
  },
];

const seedBlogDraftBySlug = new Map(
  seedBlogPostDrafts.map((post) => [post.slug, post] as const),
);

export const seedBlogPosts: SeedBlogPost[] = seedBlogPostDrafts.map((post) => {
  const { relatedSlugs, seoDescription, seoTitle, secondaryFeature, ...data } =
    post;

  const imageSet = seedBlogImageSets[post.slug];

  if (!imageSet) {
    throw new Error(`Missing image set for blog seed ${post.slug}.`);
  }

  return {
    ...data,
    image: imageSet.image,
    heroImage: imageSet.heroImage,
    inlineImage: {
      image: imageSet.inlineImage,
    },
    secondaryFeature: {
      ...secondaryFeature,
      image: {
        image: imageSet.secondaryImage,
      },
    },
    relatedPosts: relatedSlugs.map((relatedSlug) => {
      const relatedPost = seedBlogDraftBySlug.get(relatedSlug);
      const relatedImageSet = seedBlogImageSets[relatedSlug];

      if (!relatedPost || !relatedImageSet) {
        throw new Error(
          `Missing related blog seed data for ${post.slug} -> ${relatedSlug}.`,
        );
      }

      return {
        href: `/blog/${relatedPost.slug}`,
        title: relatedPost.title,
        excerpt: relatedPost.excerpt,
        category: relatedPost.category,
        image: relatedImageSet.image,
      };
    }),
    seo: {
      title: seoTitle ?? post.title,
      description: seoDescription,
      ogImage: imageSet.heroImage,
    },
  };
});

export const seedEvents: SeedEvent[] = [
  {
    id: 'event-heritage-weekend-escape',
    title: 'Heritage Weekend Escape',
    badge: 'Coming up',
    date: 'This weekend',
    location: 'Hoi An',
    description:
      'A short escape blending food, culture, and relaxed comfort for couples or families.',
    href: '/tours',
    image:
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Hoi An ancient town glowing with lanterns in the evening',
    sortOrder: 10,
  },
  {
    id: 'event-summer-by-the-coast',
    title: 'Summer by the Coast',
    badge: 'Featured',
    date: 'June - August',
    location: 'Central Vietnam',
    description:
      'A summer collection of island journeys with flexible pacing and private service touches.',
    href: '/hotels',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Luxury beachfront resort beside a tropical shoreline',
    sortOrder: 20,
  },
  {
    id: 'event-early-bird-travel-week',
    title: 'Early Bird Travel Week',
    badge: 'Special offer',
    date: 'Book early',
    location: 'Across Vietnam',
    description:
      'Smart-value combinations of stays and experiences for small groups that still want quality.',
    href: '/tours',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    alt: 'Travelers sitting beside a campfire under a clear starry sky',
    sortOrder: 30,
  },
  {
    id: 'event-northern-rice-terrace-season',
    title: 'Northern Rice Terrace Season',
    badge: 'Seasonal',
    date: 'September - October',
    location: 'Sa Pa',
    description:
      'Golden mountain terraces, cool air, and private guide days through northern highland villages.',
    href: '/destinations',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    alt: 'Golden mountain landscape under soft evening light',
    sortOrder: 40,
  },
  {
    id: 'event-mekong-slow-water-week',
    title: 'Mekong Slow Water Week',
    badge: 'New route',
    date: 'Next month',
    location: 'Mekong Delta',
    description:
      'A gentle southern journey pairing river markets, garden houses, and relaxed boutique stays.',
    href: '/tours',
    image:
      'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
    alt: 'Small boat moving through a calm tropical river',
    sortOrder: 50,
  },
  {
    id: 'event-honeymoon-island-edit',
    title: 'Honeymoon Island Edit',
    badge: 'Romantic',
    date: 'Limited suites',
    location: 'Phu Quoc',
    description:
      'Private villas, sunset tables, and quiet island pacing designed for couples who want privacy.',
    href: '/hotels',
    image:
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
    alt: 'Tropical island shoreline with clear blue water',
    sortOrder: 60,
  },
  {
    id: 'event-hue-heritage-table',
    title: 'Hue Heritage Table',
    badge: 'Culinary',
    date: 'Friday evenings',
    location: 'Hue',
    description:
      'Imperial recipes, garden-house dinners, and story-led dining around the old capital.',
    href: '/tours',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
    alt: 'Elegant dining table prepared with colorful dishes',
    sortOrder: 70,
  },
  {
    id: 'event-da-nang-family-break',
    title: 'Da Nang Family Break',
    badge: 'Family',
    date: 'School holidays',
    location: 'Da Nang',
    description:
      'Beach resorts, easy transfers, and kid-friendly day trips balanced with time for adults to rest.',
    href: '/hotels',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Resort pool surrounded by palm trees and sun loungers',
    sortOrder: 80,
  },
  {
    id: 'event-hanoi-gallery-weekend',
    title: 'Hanoi Gallery Weekend',
    badge: 'Culture',
    date: 'First weekend',
    location: 'Hanoi',
    description:
      'A city break shaped around private gallery visits, coffee rituals, and characterful old-quarter stays.',
    href: '/destinations',
    image:
      'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Historic city street with warm evening lights',
    sortOrder: 90,
  },
  {
    id: 'event-private-guide-openings',
    title: 'Private Guide Openings',
    badge: 'Last chance',
    date: 'This month',
    location: 'Vietnam',
    description:
      'A short list of remaining private guide slots for travelers who want flexible custom days.',
    href: '/contact',
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
    alt: 'Traveler looking across a scenic mountain viewpoint',
    sortOrder: 100,
  },
];

export const seedPartners: SeedPartner[] = [
  {
    id: 'partner-heritage-hotels',
    name: 'Heritage Hotels',
    description: 'Curated stays',
    sortOrder: 10,
  },
  {
    id: 'partner-local-guides-collective',
    name: 'Local Guides Collective',
    description: 'Private experiences',
    sortOrder: 20,
  },
  {
    id: 'partner-eco-transfer',
    name: 'Eco Transfer',
    description: 'Low-impact mobility',
    sortOrder: 30,
  },
  {
    id: 'partner-taste-vietnam',
    name: 'Taste Vietnam',
    description: 'Culinary access',
    sortOrder: 40,
  },
  {
    id: 'partner-boutique-retreats',
    name: 'Boutique Retreats',
    description: 'Resort partners',
    sortOrder: 50,
  },
];

export const seedTravelerReviews: SeedTravelerReview[] = [
  {
    id: 'traveler-review-minh-anh',
    name: 'Minh Anh',
    role: 'Founder, Hanoi',
    trip: 'Hoi An private retreat',
    quote:
      'The itinerary felt thoughtful and private while still giving us a real sense of local culture.',
    sortOrder: 10,
  },
  {
    id: 'traveler-review-quoc-huy',
    name: 'Quoc Huy',
    role: 'Family traveler',
    trip: 'Da Nang - Hue',
    quote:
      'The team handled every change quickly, so my family could simply enjoy the trip.',
    sortOrder: 20,
  },
  {
    id: 'traveler-review-linh-pham',
    name: 'Linh Pham',
    role: 'Creative Director',
    trip: 'Northern Vietnam',
    quote:
      'The hotels, tours, and experiences all felt carefully chosen, never generic or mass-market.',
    sortOrder: 30,
  },
];

const seedShopPaymentConfig = {
  id: 'site',
  bankBin: '970436',
  bankName: 'Vietcombank',
  accountNumber: '0123456789',
  accountName: 'CURATOR TRAVEL LTD',
} as const;

const seedSiteContentConfig = {
  id: 'site',
  siteName: 'CURATOR',
  siteTagline: 'High-End Travel Monograph',
  siteDescription: 'Curated destinations and exclusive travel experiences.',
  contactEmail: 'inquiries@curator.travel',
  hotline: 'Hotline: +44 (0) 20 7123 4567',
  topBarNote: 'Private itinerary support, 24/7',
  promoLabel: 'Travel freely without worrying about the price',
  promoCta: 'View offers',
  promoHref: '/tours',
  homeHeroImage: '/thumbnail.jpg',
  heroImageTwo:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  heroImageThree:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
} as const;

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
    await prisma.shopPaymentConfig.upsert({
      where: { id: seedShopPaymentConfig.id },
      create: seedShopPaymentConfig,
      update: seedShopPaymentConfig,
    });

    await prisma.siteContentConfig.upsert({
      where: { id: seedSiteContentConfig.id },
      create: seedSiteContentConfig,
      update: seedSiteContentConfig,
    });

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
          priceAmount: parsePrice(data.price),
          destinations: { connect: destinationSlugs.map((slug) => ({ slug })) },
          inventoryDays: { create: inventory },
        },
        update: {
          ...data,
          priceAmount: parsePrice(data.price),
          destinations: { set: destinationSlugs.map((slug) => ({ slug })) },
          inventoryDays: {
            deleteMany: {},
            create: inventory,
          },
        },
      });
    }

    await prisma.tour.deleteMany({
      where: { slug: { in: obsoleteSeedTourSlugs } },
    });

    for (const tour of seedTours) {
      const { destinationSlug, hotelSlugs, departures, ...data } = tour;
      await prisma.tour.upsert({
        where: { slug: tour.slug },
        create: {
          ...data,
          priceAmount: parsePrice(data.price),
          destination: { connect: { slug: destinationSlug } },
          hotels: { connect: hotelSlugs.map((slug) => ({ slug })) },
          departures: { create: departures },
        },
        update: {
          ...data,
          priceAmount: parsePrice(data.price),
          destination: { connect: { slug: destinationSlug } },
          hotels: { set: hotelSlugs.map((slug) => ({ slug })) },
          departures: {
            deleteMany: {},
            create: departures,
          },
        },
      });
    }

    await prisma.blogPost.deleteMany({
      where: { slug: { in: obsoleteSeedBlogSlugs } },
    });

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

    for (const event of seedEvents) {
      const { id, ...data } = event;
      await prisma.event.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
    }

    for (const partner of seedPartners) {
      const { id, ...data } = partner;
      await prisma.partner.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
    }

    for (const review of seedTravelerReviews) {
      const { id, ...data } = review;
      await prisma.travelerReview.upsert({
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
