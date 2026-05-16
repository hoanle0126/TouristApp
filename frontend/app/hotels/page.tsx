import { Suspense } from "react";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { HotelsSidebarFilters } from "@/src/components/travel/filters/HotelsFilters";
import { HotelsSkeleton } from "@/src/components/travel/filters/Skeletons";
import { HotelsHero, HotelsListingContent, PrivateCurationCta } from "@/src/components/travel/HotelsListingPage";
import { getHotels } from "@/src/lib/api/hotels";

export const dynamic = "force-dynamic";

export default async function HotelsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const searchParamsString = new URLSearchParams(resolvedParams as any).toString();

  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Hotels" />
      <HotelsHero />
      <section className="mx-auto max-w-screen-2xl px-8 pb-24 pt-8 lg:px-24 lg:pb-32">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <HotelsSidebarFilters />
          <Suspense fallback={<HotelsSkeleton />} key={searchParamsString}>
            <HotelsDataWrapper params={resolvedParams} />
          </Suspense>
        </div>
      </section>
      <PrivateCurationCta />
      <TravelFooter />
    </main>
  );
}

async function HotelsDataWrapper({ params }: { params: { [key: string]: string | undefined } }) {
  const hotels = await getHotels({
    search: params.search,
    rating: params.rating,
    priceRange: params.priceRange,
    amenities: params.amenities,
  });

  return <HotelsListingContent hotels={hotels} />;
}
