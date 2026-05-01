import TravelLandingPage from "@/src/components/travel/TravelLandingPage";
import { getBlogPosts } from "@/src/lib/api/blogs";
import { getDestinations } from "@/src/lib/api/destinations";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [destinationCards, blogPosts] = await Promise.all([
    getDestinations({ perPage: 3 }),
    getBlogPosts({ perPage: 3 }),
  ]);

  return <TravelLandingPage blogPosts={blogPosts} destinationCards={destinationCards} />;
}
