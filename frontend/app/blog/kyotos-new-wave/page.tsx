import BlogDetailPage from "@/src/components/travel/BlogDetailPage";
import { getJournalDetail } from "@/src/lib/api/blogs";

export const dynamic = "force-dynamic";

export default async function KyotoNewWavePage() {
  const article = await getJournalDetail("kyotos-new-wave");

  return <BlogDetailPage article={article} />;
}
