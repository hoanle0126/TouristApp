import AdminEditTourPage from "@/src/components/admin/AdminEditTourPage";

interface AdminEditTourRouteProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export default async function AdminEditTourRoute({ params }: AdminEditTourRouteProps) {
  const { slug } = await params;

  return <AdminEditTourPage slug={slug} />;
}
