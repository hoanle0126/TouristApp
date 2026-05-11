import AdminEditBlogPage from "@/src/components/admin/AdminEditBlogPage";

export const dynamic = "force-dynamic";

interface AdminEditBlogRouteProps {
  readonly params: Promise<{
    readonly slug: string;
  }>;
}

export default async function AdminEditBlogRoute({ params }: AdminEditBlogRouteProps) {
  const { slug } = await params;

  return <AdminEditBlogPage slug={slug} />;
}
