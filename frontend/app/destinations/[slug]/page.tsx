import { notFound } from "next/navigation";

import DestinationDetailPage from "@/src/components/travel/DestinationDetailPage";
import { ApiError } from "@/src/lib/api/client";
import { getDestination } from "@/src/lib/api/destinations";

export const dynamic = "force-dynamic";

export default async function DestinationSlugPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const detail = await getDestination(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return <DestinationDetailPage detail={detail} />;
}
