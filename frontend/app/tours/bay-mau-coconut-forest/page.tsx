import TourDetailPage from "@/src/components/travel/TourDetailPage";
import { getTour } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function BayMauCoconutForestPage() {
  const tour = await getTour("bay-mau-coconut-forest");

  return <TourDetailPage tour={tour} />;
}
