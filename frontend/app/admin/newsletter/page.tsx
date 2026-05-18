import AdminNewsletterPage from "@/src/components/admin/AdminNewsletterPage";
import { getNewsletterSubscribers } from "@/src/lib/api/newsletter";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterRoute() {
  const subscribers = await getNewsletterSubscribers();

  return <AdminNewsletterPage initialSubscribers={subscribers} />;
}
