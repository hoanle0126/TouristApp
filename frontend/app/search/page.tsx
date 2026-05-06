import SearchResultsPage from "@/src/components/travel/SearchResultsPage";
import { searchTravelProducts } from "@/src/lib/api/search";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  readonly searchParams?: Promise<{
    readonly category?: string | string[];
    readonly duration?: string;
    readonly maxPrice?: string;
    readonly minPrice?: string;
    readonly q?: string;
    readonly sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Readonly<SearchPageProps>) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const rawCategories = resolvedSearchParams?.category;
  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories
      ? [rawCategories]
      : ["Tour", "Hotel", "Destination"];
  const maxPrice = resolvedSearchParams?.maxPrice
    ? Number(resolvedSearchParams.maxPrice)
    : undefined;
  const minPrice = resolvedSearchParams?.minPrice
    ? Number(resolvedSearchParams.minPrice)
    : undefined;
  const results = await searchTravelProducts(query, {
    categories,
    duration: resolvedSearchParams?.duration,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    sort: resolvedSearchParams?.sort,
  });

  return (
    <SearchResultsPage
      initialCategories={categories}
      initialDuration={resolvedSearchParams?.duration ?? null}
      initialMaxPrice={Number.isFinite(maxPrice) ? maxPrice ?? 10000 : 10000}
      initialMinPrice={Number.isFinite(minPrice) ? minPrice ?? 0 : 0}
      initialQuery={query}
      initialResults={results}
      initialSort={resolvedSearchParams?.sort ?? "Recommended"}
    />
  );
}
