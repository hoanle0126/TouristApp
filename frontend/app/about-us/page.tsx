import AboutUsPage from "@/src/components/travel/AboutUsPage";
import { getAboutPage } from "@/src/lib/api/about-page";

export const dynamic = "force-dynamic";

export default async function AboutUsRoutePage() {
  const content = await getAboutPage();
  return <AboutUsPage content={content} />;
}
