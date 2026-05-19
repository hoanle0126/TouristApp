import AdminFeedbackPage from "@/src/components/admin/AdminFeedbackPage";
import { getAdminPartners } from "@/src/lib/api/partners";
import { getAdminTravelMoments } from "@/src/lib/api/travel-moments";
import { getAdminTravelerReviews } from "@/src/lib/api/traveler-reviews";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackRoute() {
  const [partners, reviews, moments] = await Promise.all([
    getAdminPartners(),
    getAdminTravelerReviews(),
    getAdminTravelMoments(),
  ]);

  return (
    <AdminFeedbackPage
      initialMoments={moments}
      initialPartners={partners}
      initialReviews={reviews}
    />
  );
}
