import { getSiteContentSettings } from "@/src/lib/api/settings";
import { SocialSideRailClient } from "@/src/components/travel/SocialSideRailClient";

export async function SocialSideRail() {
  const siteContent = await getSiteContentSettings().catch(() => null);

  return (
    <SocialSideRailClient
      facebookUrl={siteContent?.facebookUrl ?? ""}
      instagramUrl={siteContent?.instagramUrl ?? ""}
      tiktokUrl={siteContent?.tiktokUrl ?? ""}
    />
  );
}
