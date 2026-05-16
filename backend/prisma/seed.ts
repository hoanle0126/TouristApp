import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import 'dotenv/config';

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

type SeedMomentCaptured = {
  id: string;
  title: string;
  country: string;
  image: string;
  wide: boolean;
  sortOrder: number;
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
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
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
            description: 'Spacious suite with floor-to-ceiling windows and calm natural materials.',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
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
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
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
            description: 'Light-filled suite with vineyard-facing terrace and soaking tub.',
            image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
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
        image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80',
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
            description: 'Coastal suite with private plunge pool and uninterrupted sunset view.',
            image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80',
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
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
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
            description: 'Minimalist suite with sandstone terrace and panoramic desert outlook.',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
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
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
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
            description: 'Overwater villa with expansive deck, private pool, and direct lagoon entry.',
            image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
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
        image: 'https://images.unsplash.com/photo-1517823382935-39a2da4ecb33?auto=format&fit=crop&w=1600&q=80',
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
            description: 'Warm timber room designed for winter stays and aurora watching.',
            image: 'https://images.unsplash.com/photo-1517823382935-39a2da4ecb33?auto=format&fit=crop&w=1600&q=80',
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
      suites: { name: string; price: string; badge: string; description: string; image: string }[];
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
        description: 'Board a bamboo basket boat, follow narrow channels, and watch local rowing and fishing demonstrations.',
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
      { title: 'Arrive in Hanoi', description: 'Private arrival transfer, old-quarter orientation, and a gentle evening food walk.' },
      { title: 'Hanoi Culture and Coffee', description: 'Visit historic neighborhoods, galleries, temples, and characterful coffee stops with flexible pacing.' },
      { title: 'Transfer to Ninh Binh', description: 'Travel south for temple visits, countryside roads, and a sunset viewpoint when weather allows.' },
      { title: 'River Caves and Cycling', description: 'Take a sampan ride through limestone scenery, then cycle village lanes before a relaxed lodge evening.' },
      { title: 'Return to Hanoi', description: 'Morning at leisure before returning to Hanoi for onward flights or an extended stay.' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: [
      'Private airport and intercity transfers',
      'Four nights in curated boutique accommodation',
      'Daily breakfast and selected local tastings',
      'Private English-speaking guides and entrance fees',
    ],
    exclusions: ['International and domestic flights', 'Meals not listed as included', 'Travel insurance and personal expenses'],
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
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1800&q=85',
    subtitle: 'Imperial gardens, coastal resort rhythm, and lantern-lit Hoi An in one easy central Vietnam itinerary.',
    highlights: [
      { icon: 'map', title: 'Three-City Routing', description: 'Connect Hue, Da Nang, and Hoi An without backtracking or heavy transfer days.' },
      { icon: 'food', title: 'Central Vietnamese Cuisine', description: 'Taste Hue garden-house dishes, coastal seafood, and Hoi An market flavors.' },
      { icon: 'hotel', title: 'Beach and Riverside Stays', description: 'Balance heritage touring with resort time and atmospheric riverside evenings.' },
    ],
    itinerary: [
      { title: 'Arrive in Hue', description: 'Settle into a calm heritage stay and begin with a slow Perfume River orientation.' },
      { title: 'Imperial Hue', description: 'Visit the citadel, royal tombs, and a garden house lunch with a private guide.' },
      { title: 'Hai Van Pass to Da Nang', description: 'Drive the scenic coastal pass with viewpoints before reaching a beach resort base.' },
      { title: 'Hoi An Old Town', description: 'Move to Hoi An for lantern streets, tailoring lanes, and a relaxed riverside dinner.' },
      { title: 'Market, Cooking and Coast', description: 'Spend the final days between a market-led cooking session, beach time, and optional countryside cycling.' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: [
      'Six nights in curated hotel stays',
      'Private transfers between Hue, Da Nang, and Hoi An',
      'Guided heritage visits and selected entrance fees',
      'Daily breakfast and two hosted dining experiences',
    ],
    exclusions: ['Flights to Hue or Da Nang', 'Optional spa, tailoring, and beach activities', 'Personal expenses and gratuities'],
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
    shortDescription: 'A private northern highland road journey through Sa Pa terraces, Ha Giang passes, and village landscapes.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85',
    subtitle: 'Terraced valleys, limestone passes, cooler air, and highland villages with a comfortable private route.',
    highlights: [
      { icon: 'mountain', title: 'Highland Passes', description: 'Drive scenic mountain roads with frequent viewpoint stops and flexible photography time.' },
      { icon: 'walk', title: 'Village Walks', description: 'Take moderated walks through terraced valleys and market villages with local context.' },
      { icon: 'hotel', title: 'Selected Lodges', description: 'Stay in simple but characterful properties chosen for setting and warmth.' },
    ],
    itinerary: [
      { title: 'Hanoi to Sa Pa', description: 'Travel north into the mountains and settle into a lodge with valley views.' },
      { title: 'Sa Pa Terraces', description: 'Explore rice terraces, village paths, and market stops at a gentle pace.' },
      { title: 'Road to Ha Giang', description: 'Move east through changing mountain scenery with a private driver and guide.' },
      { title: 'Dong Van Karst Plateau', description: 'Spend two days around limestone passes, old towns, and dramatic viewpoints.' },
      { title: 'Return Through the Valleys', description: 'Descend slowly toward Hanoi with a final rural lunch and transfer support.' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: [
      'Private vehicle and experienced mountain driver',
      'Seven nights in selected lodges and boutique stays',
      'English-speaking guide throughout highland routing',
      'Daily breakfast and selected lunches on travel days',
    ],
    exclusions: ['Personal trekking gear', 'Optional motorbike upgrades', 'Travel insurance and personal expenses'],
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
    shortDescription: 'A gentle Mekong Delta route with private boats, garden houses, floating markets, and southern hospitality.',
    image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1800&q=85',
    subtitle: 'Private boats, garden houses, floating markets, and warm southern hospitality at a slower pace.',
    highlights: [
      { icon: 'boat', title: 'Private Waterway Travel', description: 'Move by private boat through small canals, river crossings, and floating market approaches.' },
      { icon: 'food', title: 'Garden House Meals', description: 'Share regional dishes, tropical fruit, and tea in family-run garden settings.' },
      { icon: 'eco', title: 'Slow Delta Rhythm', description: 'Build in time for hammocks, cycling lanes, and mornings that start before the heat.' },
    ],
    itinerary: [
      { title: 'Ho Chi Minh City to Ben Tre', description: 'Leave the city for coconut groves, small boats, and a relaxed riverside stay.' },
      { title: 'Garden Houses and Cycling', description: 'Visit orchards, family workshops, and village lanes by bike and boat.' },
      { title: 'Can Tho Floating Market', description: 'Rise early for river trading scenes before a late breakfast and market walk.' },
      { title: 'Delta Leisure Day', description: 'Keep a lighter day for local cooking, hammocks, or an optional countryside ride.' },
      { title: 'Return to Ho Chi Minh City', description: 'Travel back with a final lunch stop and onward transfer support.' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: [
      'Five nights in boutique river and city stays',
      'Private transfers and private boat segments',
      'Guided market visits and garden-house experiences',
      'Daily breakfast and selected local meals',
    ],
    exclusions: ['Domestic or international flights', 'Alcoholic beverages unless specified', 'Personal expenses and guide gratuities'],
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
    shortDescription: 'A flexible Phu Quoc island retreat with beach downtime, sunset dining, optional snorkeling, and private transfer support.',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1800&q=85',
    subtitle: 'Soft island days, warm water, private resort time, and sunset dining after a busier Vietnam route.',
    highlights: [
      { icon: 'hotel', title: 'Resort-Led Pacing', description: 'Stay near the water with flexible days designed around rest rather than constant transfers.' },
      { icon: 'boat', title: 'Optional Snorkeling', description: 'Add a private boat day to nearby islands when sea conditions are favorable.' },
      { icon: 'sparkles', title: 'Milestone-Friendly', description: 'A strong option for honeymoons, anniversaries, or decompression after cultural touring.' },
    ],
    itinerary: [
      { title: 'Arrive on Phu Quoc', description: 'Private airport greeting and transfer to a selected beach resort.' },
      { title: 'Island Leisure', description: 'Unstructured day for the pool, spa, beach, or a guided local market visit.' },
      { title: 'Optional Boat Day', description: 'Choose snorkeling, fishing, or a private coastal cruise depending on season and sea conditions.' },
      { title: 'Sunset Dinner', description: 'Reserve a relaxed seafood dinner or private beach setup for the final evening.' },
      { title: 'Departure Support', description: 'Private transfer to the airport with onward connection guidance.' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: ['Four nights in a curated island resort', 'Private airport transfers', 'Daily breakfast', 'One hosted sunset dining arrangement'],
    exclusions: ['Flights to and from Phu Quoc', 'Optional boat charter and spa treatments', 'Meals not specified in the itinerary'],
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
    shortDescription: 'A culture-led London week built around galleries, design neighborhoods, architecture, and refined dining.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85',
    subtitle: 'A polished London city route through galleries, design hotels, restaurants, and characterful neighborhoods.',
    highlights: [
      { icon: 'camera', title: 'Gallery Access', description: 'Plan around major museums, smaller galleries, and current exhibitions with private host support.' },
      { icon: 'coffee', title: 'Neighborhood Days', description: 'Balance Mayfair and South Bank with Shoreditch, Notting Hill, or Hampstead depending on interests.' },
      { icon: 'food', title: 'Curated Dining', description: 'Use reservation support for restaurants, wine bars, and design-led dining rooms.' },
    ],
    itinerary: [
      { title: 'Arrive and Settle In', description: 'Private airport transfer, hotel check-in, and a low-pressure neighborhood dinner.' },
      { title: 'Classic London Reframed', description: 'See landmark areas through architecture, design, and social history rather than a standard checklist.' },
      { title: 'Gallery and Museum Day', description: 'Pair major collections with smaller gallery visits based on current programming.' },
      { title: 'Design Neighborhoods', description: 'Explore boutiques, studios, bookstores, and restaurants across two contrasting neighborhoods.' },
      { title: 'Private Leisure and Dining', description: 'Keep a flexible final day for shopping, spa, or a special dining reservation.' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: ['Five nights in a curated design hotel', 'Private airport transfers', 'Two privately hosted culture walks', 'Restaurant planning and reservation support'],
    exclusions: ['International flights', 'Museum special exhibition tickets where separately priced', 'Meals and drinks unless specified'],
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
    shortDescription: 'A nine-day scenic journey through Nordic fjords, coastal villages, private boats, and design-led lodge stays.',
    image: nordicFjordsImage,
    heroImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=85',
    subtitle: 'Cinematic fjords, quiet harbor towns, private boat segments, and restrained Nordic design stays.',
    highlights: [
      { icon: 'boat', title: 'Fjord-Level Views', description: 'Use ferries and private boat segments to experience the scenery from the water, not only the road.' },
      { icon: 'mountain', title: 'Scenic Roads', description: 'Travel through dramatic passes and viewpoints with sensible daily drive times.' },
      { icon: 'hotel', title: 'Design Lodges', description: 'Stay in atmospheric lodges and hotels selected for view, warmth, and architecture.' },
    ],
    itinerary: [
      { title: 'Arrive in Bergen', description: 'Private arrival support and a calm harbor orientation before dinner.' },
      { title: 'Fjord Transfer Day', description: 'Move by road and water toward a scenic lodge with stops for short walks and viewpoints.' },
      { title: 'Private Boat and Village Visit', description: 'Spend the day on quieter waterways, visiting a small village and local producer when available.' },
      { title: 'High Road Viewpoints', description: 'Drive a dramatic scenic route with flexible timing for weather and photography.' },
      { title: 'Coastal Design Stay', description: 'Finish with a slower coastal base, sauna time, and a final Nordic tasting dinner.' },
    ],
    gallery: [
      { image: nordicFjordsImage, layout: 'landscape' },
      { image: 'https://images.unsplash.com/photo-1517823382935-39a2da4ecb33?auto=format&fit=crop&w=1600&q=80', layout: 'portrait' },
      { image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80', layout: 'landscape' },
    ],
    inclusions: [
      'Eight nights in curated hotels and lodges',
      'Private transfers and selected ferry segments',
      'Private boat experience on one fjord day',
      'Daily breakfast and one Nordic tasting dinner',
    ],
    exclusions: ['Flights to and from Scandinavia', 'Optional helicopter or premium boat upgrades', 'Personal expenses and travel insurance'],
    destinationSlug: 'nordic-fjords',
    hotelSlugs: ['72-north-lodge'],
    departures: genericTourDepartures,
  },
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
    heroImage: nordicFjordsImage,
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
    },
    secondaryFeature: {
      title: 'A Dialogue with Nature',
      body: 'Pocket gardens remain the spiritual heart of the home.',
      image: {
        image: nordicFjordsImage,
      },
    },
    relatedPosts: [],
    seo: {
      title: 'The Architectural Poetry of Kyoto’s New Wave',
      description: 'Modern Kyoto machiya architecture and design.',
    },
    mentionedDestinationSlugs: [],
    mentionedTourSlugs: ['hanoi-ninh-binh-heritage-loop'],
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
    heroImage: nordicFjordsImage,
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
    inlineImage: { image: nordicFjordsImage },
    secondaryFeature: {
      title: 'Editor’s Field Note',
      body: `A focused companion note for ${title}, pairing practical context with the sensory details that shape the experience.`,
      image: { image: nordicFjordsImage },
    },
    relatedPosts: [],
    seo: { title, description: `${title} travel journal.` },
    mentionedDestinationSlugs: [],
    mentionedTourSlugs: [],
    mentionedHotelSlugs: [],
  })),
];

export const seedEvents: SeedEvent[] = [
  {
    id: 'event-heritage-weekend-escape',
    title: 'Heritage Weekend Escape',
    badge: 'Coming up',
    date: 'This weekend',
    location: 'Hoi An',
    description: 'A short escape blending food, culture, and relaxed comfort for couples or families.',
    href: '/tours',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Hoi An ancient town glowing with lanterns in the evening',
    sortOrder: 10,
  },
  {
    id: 'event-summer-by-the-coast',
    title: 'Summer by the Coast',
    badge: 'Featured',
    date: 'June - August',
    location: 'Central Vietnam',
    description: 'A summer collection of island journeys with flexible pacing and private service touches.',
    href: '/hotels',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Luxury beachfront resort beside a tropical shoreline',
    sortOrder: 20,
  },
  {
    id: 'event-early-bird-travel-week',
    title: 'Early Bird Travel Week',
    badge: 'Special offer',
    date: 'Book early',
    location: 'Across Vietnam',
    description: 'Smart-value combinations of stays and experiences for small groups that still want quality.',
    href: '/tours',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    alt: 'Travelers sitting beside a campfire under a clear starry sky',
    sortOrder: 30,
  },
  {
    id: 'event-northern-rice-terrace-season',
    title: 'Northern Rice Terrace Season',
    badge: 'Seasonal',
    date: 'September - October',
    location: 'Sa Pa',
    description: 'Golden mountain terraces, cool air, and private guide days through northern highland villages.',
    href: '/destinations',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
    alt: 'Golden mountain landscape under soft evening light',
    sortOrder: 40,
  },
  {
    id: 'event-mekong-slow-water-week',
    title: 'Mekong Slow Water Week',
    badge: 'New route',
    date: 'Next month',
    location: 'Mekong Delta',
    description: 'A gentle southern journey pairing river markets, garden houses, and relaxed boutique stays.',
    href: '/tours',
    image: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=1600&q=80',
    alt: 'Small boat moving through a calm tropical river',
    sortOrder: 50,
  },
  {
    id: 'event-honeymoon-island-edit',
    title: 'Honeymoon Island Edit',
    badge: 'Romantic',
    date: 'Limited suites',
    location: 'Phu Quoc',
    description: 'Private villas, sunset tables, and quiet island pacing designed for couples who want privacy.',
    href: '/hotels',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
    alt: 'Tropical island shoreline with clear blue water',
    sortOrder: 60,
  },
  {
    id: 'event-hue-heritage-table',
    title: 'Hue Heritage Table',
    badge: 'Culinary',
    date: 'Friday evenings',
    location: 'Hue',
    description: 'Imperial recipes, garden-house dinners, and story-led dining around the old capital.',
    href: '/tours',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80',
    alt: 'Elegant dining table prepared with colorful dishes',
    sortOrder: 70,
  },
  {
    id: 'event-da-nang-family-break',
    title: 'Da Nang Family Break',
    badge: 'Family',
    date: 'School holidays',
    location: 'Da Nang',
    description: 'Beach resorts, easy transfers, and kid-friendly day trips balanced with time for adults to rest.',
    href: '/hotels',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Resort pool surrounded by palm trees and sun loungers',
    sortOrder: 80,
  },
  {
    id: 'event-hanoi-gallery-weekend',
    title: 'Hanoi Gallery Weekend',
    badge: 'Culture',
    date: 'First weekend',
    location: 'Hanoi',
    description: 'A city break shaped around private gallery visits, coffee rituals, and characterful old-quarter stays.',
    href: '/destinations',
    image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Historic city street with warm evening lights',
    sortOrder: 90,
  },
  {
    id: 'event-private-guide-openings',
    title: 'Private Guide Openings',
    badge: 'Last chance',
    date: 'This month',
    location: 'Vietnam',
    description: 'A short list of remaining private guide slots for travelers who want flexible custom days.',
    href: '/contact',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
    alt: 'Traveler looking across a scenic mountain viewpoint',
    sortOrder: 100,
  },
];

export const seedMomentsCaptured: SeedMomentCaptured[] = [
  {
    id: 'moment-ubud-sanctuary',
    title: 'Ubud Sanctuary',
    country: 'Indonesia',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXt_uOk39Ti37dURaaAO9Gv1kYVRVrW8XysehQZYZ-kt8ZIZ2bwtsNbCd8AQ10u4z3Ws-ygeCNJUv5Gop1UT63u6X8MxMOwsc3rhdMRY3tsgjeEe7qMzcd2149-FycyLeFDO7xpx9kcEWk2_fS8DKpX_9kDbN7JeuBgbv1G_I2vQxg6YBjFVxc2nyFZne7rAd3m-oBrS93hnfaOSPn5-SrDsWnmzW4Kbf9FhEm3BsIhBf9ZX3-3YD5FUAC77BSp5tPXQZqXBkT11Kv',
    wide: false,
    sortOrder: 10,
  },
  {
    id: 'moment-oia-heights',
    title: 'Oia Heights',
    country: 'Greece',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPOgbPq_XwQHxqcdV8CyyHHmuASmYTCmNh8iC7Qa31o9m88sCugttUqmVEJ9bS5RPzElQEn3SYK-jK_z3ZTIrVazznHG0pefnGU_WXvkW-iVA_-PFDRH_IKzie9_WL8XUqXMxcvGZ2MQlUIH04iFzpzi0-Dw9h8BagV-0zsnmNHMyzCNzFKofG6m8Jgt1H4eP9Kmlfbm3tlEv7MKPMhepN0PChYlQh5bYZy_lqG6VpCO0OfdJSwkDnmnv66dBHDhuW2r9OkGCMoo0l',
    wide: true,
    sortOrder: 20,
  },
  {
    id: 'moment-kyoto-rituals',
    title: 'Kyoto Rituals',
    country: 'Japan',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAF4vsCxEPUT55N-RY2qaIvB_vfZFOivZwZ9iOvf16bFRt0ntzY8S9f8SN1Y69IGH9UEwQJJ4z-s409ytBeuTtHET1tRKmmZZ7purJkx80yYpcbQu-HMrFGCLFQrH9MmxYVPtwbNMaGNC0pX5pHQFf6Pf20qr-d6DU5b8mbJ09TwyrMdeGgJK7i0ug1bPf7MuX84yyLKpMlihdxXp-Rx3Wny5jGquG2LmnAUEA0Xk-SSmox9ULLpYVMrzC7tbttWUuf-vk8cdjTvwoC',
    wide: false,
    sortOrder: 30,
  },
  {
    id: 'moment-alpine-silence',
    title: 'Alpine Silence',
    country: 'Switzerland',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmQGXS04u9LQQr8k62J4bbs5yRMtU1_3unbCZXTbhnDlAJZd6PTnWl9ObnEBg_XeHpk1EW78JTlcFrpgc03E6GF_GD30D8cTau7EFb48AKzznjX8M3MAwWIJrOGch91X09_JxAecQVTs0keSp11X99OraPR_Nmvc-aV-NT4PPebtaG5J9v2tIMaM5eCrLoVdStV6ZMQr2G8xdbmvLDtw1ByehwABdtCZGgp9ceBVrFy-U-3crNf73iAB6_pRpzvDuMxU397e3baeGv',
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

    await prisma.tour.deleteMany({
      where: { slug: { in: obsoleteSeedTourSlugs } },
    });

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

    for (const event of seedEvents) {
      const { id, ...data } = event;
      await prisma.event.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
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
