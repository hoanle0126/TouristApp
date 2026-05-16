import TravelLandingPage from "@/src/components/travel/TravelLandingPage";
import { getBlogPosts } from "@/src/lib/api/blogs";
import { getDestinations } from "@/src/lib/api/destinations";
import { getEvents } from "@/src/lib/api/events";
import { getHotels } from "@/src/lib/api/hotels";
import { getPartners } from "@/src/lib/api/partners";
import { getSiteContentSettings } from "@/src/lib/api/settings";
import { getTours } from "@/src/lib/api/tours";
import { getTravelerReviews } from "@/src/lib/api/traveler-reviews";
import { visualDiaryItems } from "@/src/data/mockData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    destinations,
    blogPosts,
    events,
    hotels,
    partners,
    siteContent,
    travelerReviews,
    tours,
  ] = await Promise.all([
    getDestinations({ perPage: 12 }),
    getBlogPosts({ perPage: 3 }),
    getEvents(),
    getHotels({ perPage: 4 }),
    getPartners(),
    getSiteContentSettings(),
    getTravelerReviews(),
    getTours(),
  ]);

  return (
    <TravelLandingPage
      blogPosts={blogPosts}
      destinationCards={destinations}
      eventCards={events}
      hotelCards={hotels}
      siteContent={siteContent}
      tourCards={tours}
      travelPartners={partners}
      travelerFeedback={travelerReviews}
      visualDiaryItems={visualDiaryItems}
    />
  );
}
