import TravelLandingPage from "@/src/components/travel/TravelLandingPage";
import { getBlogPosts } from "@/src/lib/api/blogs";
import { getDestinations } from "@/src/lib/api/destinations";
import { getEvents } from "@/src/lib/api/events";
import { getHotels } from "@/src/lib/api/hotels";
import { getSiteContentSettings } from "@/src/lib/api/settings";
import { getTours } from "@/src/lib/api/tours";
import { getTravelMoments } from "@/src/lib/api/travel-moments";
import { getTravelerReviews } from "@/src/lib/api/traveler-reviews";
import { visualDiaryItems } from "@/src/data/mockData";
import type { TravelPartner } from "@/src/types/travel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    destinations,
    blogPosts,
    events,
    hotels,
    partnerHotels,
    siteContent,
    travelMoments,
    travelerReviews,
    tours,
  ] = await Promise.all([
    getDestinations({ perPage: 12 }),
    getBlogPosts({ perPage: 3 }),
    getEvents(),
    getHotels({ perPage: 4 }),
    getHotels(),
    getSiteContentSettings(),
    getTravelMoments(),
    getTravelerReviews(),
    getTours(),
  ]);

  const travelPartners: TravelPartner[] = partnerHotels.map((hotel, index) => ({
    description: hotel.location,
    name: hotel.name,
    sortOrder: index,
  }));

  return (
    <TravelLandingPage
      blogPosts={blogPosts}
      destinationCards={destinations}
      eventCards={events}
      hotelCards={hotels}
      siteContent={siteContent}
      tourCards={tours}
      travelMoments={travelMoments}
      travelPartners={travelPartners}
      travelerFeedback={travelerReviews}
      visualDiaryItems={visualDiaryItems}
    />
  );
}
