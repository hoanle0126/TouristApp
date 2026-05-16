import { Suspense } from "react";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { ToursSidebarFilters } from "@/src/components/travel/filters/ToursFilters";
import { ToursSkeleton } from "@/src/components/travel/filters/Skeletons";
import { ToursHero, ToursListingContent } from "@/src/components/travel/ToursListingPage";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

export default async function ToursPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const searchParamsString = new URLSearchParams(resolvedParams as any).toString();

  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />
      <ToursHero />
      <section className="mx-auto mb-24 max-w-screen-2xl px-8 lg:px-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <ToursSidebarFilters />
          <Suspense fallback={<ToursSkeleton />} key={searchParamsString}>
            <ToursDataWrapper params={resolvedParams} />
          </Suspense>
        </div>
      </section>
      <TravelFooter />
    </main>
  );
}

async function ToursDataWrapper({ params }: { params: { [key: string]: string | undefined } }) {
  const tours = await getTours({
    search: params.search,
    type: params.type,
    duration: params.duration,
    priceRange: params.priceRange,
    departureDate: params.departureDate,
  });

  return <ToursListingContent tours={tours} />;
}
