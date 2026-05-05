import SearchResultsPage from "@/src/components/travel/SearchResultsPage";
import { searchTravelProducts } from "@/src/lib/api/search";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  readonly searchParams?: Promise<{
    readonly q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Readonly<SearchPageProps>) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? "";
  const results = await searchTravelProducts(query);

  return <SearchResultsPage initialQuery={query} initialResults={results} />;
}
