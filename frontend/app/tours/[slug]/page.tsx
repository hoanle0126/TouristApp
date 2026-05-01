import { notFound } from "next/navigation";

import TourDetailPage from "@/src/components/travel/TourDetailPage";
import { ApiError } from "@/src/lib/api/client";
import { getTour } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function TourSlugPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const tour = await getTour(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return <TourDetailPage tour={tour} />;
}
