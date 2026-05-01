import AdminEditHotelPage from "@/src/components/admin/AdminEditHotelPage";

export const dynamic = "force-dynamic";

interface AdminEditHotelRouteProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export default async function AdminEditHotelRoute({ params }: AdminEditHotelRouteProps) {
  const { slug } = await params;

  return <AdminEditHotelPage slug={slug} />;
}
