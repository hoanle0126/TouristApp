import AdminEditDestinationPage from "@/src/components/admin/AdminEditDestinationPage";

export const dynamic = "force-dynamic";

interface AdminEditDestinationRouteProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export default async function AdminEditDestinationRoute({ params }: AdminEditDestinationRouteProps) {
  const { slug } = await params;

  return <AdminEditDestinationPage slug={slug} />;
}
