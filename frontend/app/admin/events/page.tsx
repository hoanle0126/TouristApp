import AdminEventsPage from "@/src/components/admin/AdminEventsPage";
import { getAdminEvents } from "@/src/lib/api/events";

export const dynamic = "force-dynamic";

export default async function AdminEventsRoute() {
  const events = await getAdminEvents();
  return <AdminEventsPage initialEvents={events} />;
}
