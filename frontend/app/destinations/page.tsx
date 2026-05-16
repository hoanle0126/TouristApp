import { Suspense } from "react";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { DestinationsSidebarFilters } from "@/src/components/travel/filters/DestinationsFilters";
import { DestinationsSkeleton } from "@/src/components/travel/filters/Skeletons";
import { DestinationsHero, DestinationsListingContent, PremiumExtensions } from "@/src/components/travel/DestinationsListingPage";
import { getDestinations } from "@/src/lib/api/destinations";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const searchParamsString = new URLSearchParams(resolvedParams as any).toString();
  const suggestions = await getTours();

  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Destinations" />
      <DestinationsHero />
      <section className="mx-auto max-w-screen-2xl px-8 pb-24 pt-8 lg:px-24 lg:pb-32">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <DestinationsSidebarFilters />
          <Suspense fallback={<DestinationsSkeleton />} key={searchParamsString}>
            <DestinationsDataWrapper params={resolvedParams} />
          </Suspense>
        </div>
      </section>
      <PremiumExtensions suggestions={suggestions.slice(0, 4)} />
      <TravelFooter />
    </main>
  );
}

async function DestinationsDataWrapper({ params }: { params: { [key: string]: string | undefined } }) {
  const destinations = await getDestinations({
    search: params.search,
    region: params.region,
    style: params.style,
  });

  return <DestinationsListingContent destinations={destinations} />;
}
