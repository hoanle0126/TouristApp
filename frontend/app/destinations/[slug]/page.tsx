import { notFound } from "next/navigation";

import DestinationDetailPage from "@/src/components/travel/DestinationDetailPage";
import { destinationDetails } from "@/src/data/mockData";

export function generateStaticParams() {
  return Object.keys(destinationDetails).map((slug) => ({ slug }));
}

export default async function DestinationSlugPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const detail = destinationDetails[slug];

  if (!detail) {
    notFound();
  }

  return <DestinationDetailPage detail={detail} />;
}
