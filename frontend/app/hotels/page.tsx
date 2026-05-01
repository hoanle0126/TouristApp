import HotelsListingPage from "@/src/components/travel/HotelsListingPage";
import { getHotels } from "@/src/lib/api/hotels";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const hotels = await getHotels();

  return <HotelsListingPage hotels={hotels} />;
}
