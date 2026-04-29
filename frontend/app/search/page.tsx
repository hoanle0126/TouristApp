import SearchResultsPage from "@/src/components/travel/SearchResultsPage";

interface SearchPageProps {
  readonly searchParams?: Promise<{
    readonly q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Readonly<SearchPageProps>) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() || "Japan";

  return <SearchResultsPage query={query} />;
}
