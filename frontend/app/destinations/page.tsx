import DestinationsListingPage from "@/src/components/travel/DestinationsListingPage";
import { getDestinations } from "@/src/lib/api/destinations";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const [destinations, suggestions] = await Promise.all([
    getDestinations(),
    getTours(),
  ]);

  return <DestinationsListingPage destinations={destinations} suggestions={suggestions.slice(0, 4)} />;
}
