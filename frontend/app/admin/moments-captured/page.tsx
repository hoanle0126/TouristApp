import AdminMomentsCapturedPage from "@/src/components/admin/AdminMomentsCapturedPage";
import { getMomentsCaptured } from "@/src/lib/api/moments-captured";

export const dynamic = "force-dynamic";

export default async function AdminMomentsCapturedRoute() {
  const moments = await getMomentsCaptured();
  return <AdminMomentsCapturedPage initialMoments={moments} />;
}
