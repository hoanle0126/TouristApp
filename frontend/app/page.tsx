import TravelLandingPage from "@/src/components/travel/TravelLandingPage";
import { getBlogPosts } from "@/src/lib/api/blogs";
import { getDestinations } from "@/src/lib/api/destinations";
import { getEvents } from "@/src/lib/api/events";
import { getHotels } from "@/src/lib/api/hotels";
import { getMomentsCaptured } from "@/src/lib/api/moments-captured";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [destinations, blogPosts, events, hotels, momentsCaptured, tours] = await Promise.all([
    getDestinations({ perPage: 12 }),
    getBlogPosts({ perPage: 3 }),
    getEvents(),
    getHotels({ perPage: 4 }),
    getMomentsCaptured(),
    getTours(),
  ]);

  return (
    <TravelLandingPage
      blogPosts={blogPosts}
      destinationCards={destinations}
      eventCards={events}
      hotelCards={hotels}
      tourCards={tours}
      visualDiaryItems={momentsCaptured}
    />
  );
}
