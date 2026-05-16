import ContactPage from "@/src/components/travel/ContactPage";
import { getSiteContentSettings } from "@/src/lib/api/settings";

export default async function ContactRoutePage() {
  const siteContent = await getSiteContentSettings().catch(() => ({
    contactEmail: "inquiries@curator.travel",
    hotline: "Hotline: +44 (0) 20 7123 4567",
  }));

  return <ContactPage siteContent={siteContent} />;
}
