import TravelLandingPage from "@/src/components/travel/TravelLandingPage";
import { getBlogPosts } from "@/src/lib/api/blogs";
import { getDestinations } from "@/src/lib/api/destinations";
import { getHotels } from "@/src/lib/api/hotels";
import { getMomentsCaptured } from "@/src/lib/api/moments-captured";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [destinations, blogPosts, hotels, momentsCaptured, tours] = await Promise.all([
    getDestinations({ perPage: 3 }),
    getBlogPosts({ perPage: 3 }),
    getHotels({ perPage: 4 }),
    getMomentsCaptured(),
    getTours(),
  ]);

  const suggestionCards = [
    ...destinations.map((destination) => ({
      alt: destination.alt,
      category: "destination" as const,
      href: destination.href,
      image: destination.image,
      location: destination.title,
      price: destination.price,
      title: destination.title,
    })),
    ...tours.slice(0, 2).map((tour) => ({
      alt: tour.alt,
      category: "tour" as const,
      href: tour.slug ? `/tours/${tour.slug}` : "/tours",
      image: tour.image,
      location: tour.duration,
      price: tour.price,
      title: tour.title,
    })),
    ...hotels.slice(0, 2).map((hotel) => ({
      alt: hotel.alt,
      category: "hotel" as const,
      href: hotel.slug ? `/hotels/${hotel.slug}` : "/hotels",
      image: hotel.image,
      location: hotel.location,
      price: hotel.price,
      title: hotel.name,
    })),
  ];

  return (
    <TravelLandingPage
      blogPosts={blogPosts}
      destinationCards={destinations}
      suggestionCards={suggestionCards}
      visualDiaryItems={momentsCaptured}
    />
  );
}
