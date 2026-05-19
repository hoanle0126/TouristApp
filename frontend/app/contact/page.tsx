import ContactPage from "@/src/components/travel/ContactPage";
import { getContactPage } from "@/src/lib/api/contact-page";
import { getSiteContentSettings } from "@/src/lib/api/settings";

export const dynamic = "force-dynamic";

export default async function ContactRoutePage() {
  const [content, siteContent] = await Promise.all([
    getContactPage(),
    getSiteContentSettings().catch(() => ({
      contactEmail: "inquiries@curator.travel",
      hotline: "Hotline: +44 (0) 20 7123 4567",
    })),
  ]);

  return <ContactPage content={content} siteContent={siteContent} />;
}
