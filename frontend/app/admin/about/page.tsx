import AdminAboutPage from "@/src/components/admin/AdminAboutPage";
import { getAboutPage } from "@/src/lib/api/about-page";

export const dynamic = "force-dynamic";

export default async function AdminAboutRoute() {
  const content = await getAboutPage();
  return <AdminAboutPage initialContent={content} />;
}
