import AdminFeedbackPage from "@/src/components/admin/AdminFeedbackPage";
import { getAdminPartners } from "@/src/lib/api/partners";
import { getAdminTravelerReviews } from "@/src/lib/api/traveler-reviews";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackRoute() {
  const [partners, reviews] = await Promise.all([
    getAdminPartners(),
    getAdminTravelerReviews(),
  ]);

  return (
    <AdminFeedbackPage initialPartners={partners} initialReviews={reviews} />
  );
}
