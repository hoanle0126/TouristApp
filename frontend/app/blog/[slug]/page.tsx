import { notFound } from "next/navigation";

import BlogDetailPage from "@/src/components/travel/BlogDetailPage";
import { ApiError } from "@/src/lib/api/client";
import { getJournalDetail } from "@/src/lib/api/blogs";

export const dynamic = "force-dynamic";

export default async function BlogSlugPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const article = await getJournalDetail(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return <BlogDetailPage article={article} />;
}
