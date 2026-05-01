import ToursListingPage from "@/src/components/travel/ToursListingPage";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const tours = await getTours();

  return <ToursListingPage tours={tours} />;
}
