import { notFound } from "next/navigation";

import HotelDetailPage from "@/src/components/travel/HotelDetailPage";
import { ApiError } from "@/src/lib/api/client";
import { getHotel } from "@/src/lib/api/hotels";

export const dynamic = "force-dynamic";

export default async function HotelSlugPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const hotel = await getHotel(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  });

  return <HotelDetailPage hotel={hotel} />;
}
