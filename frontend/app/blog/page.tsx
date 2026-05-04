import BlogListingPage from "@/src/components/travel/BlogListingPage";
import { getJournalPosts } from "@/src/lib/api/blogs";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getJournalPosts();
  const [featuredPost, ...journalPosts] = posts;

  return <BlogListingPage featuredPost={featuredPost ? { ...featuredPost, badge: "Featured Experience" } : null} posts={journalPosts} />;
}
