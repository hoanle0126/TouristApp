import AdminContactPage from "@/src/components/admin/AdminContactPage";
import { getContactPage } from "@/src/lib/api/contact-page";

export const dynamic = "force-dynamic";

export default async function AdminContactRoute() {
  const content = await getContactPage();
  return <AdminContactPage initialContent={content} />;
}
