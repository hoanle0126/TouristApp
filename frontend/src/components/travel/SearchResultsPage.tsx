"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Search } from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export interface SearchResult {
  readonly alt: string;
  readonly category: string;
  readonly cta: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
  readonly meta?: string;
  readonly price: string;
  readonly title: string;
}

const sortOptions = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
] as const;

const categoryFilters = ["Tour", "Hotel", "Destination"] as const;

const durationFilters = [
  { label: "1-3 Days", value: "1-3" },
  { label: "4-7 Days", value: "4-7" },
  { label: "8-14 Days", value: "8-14" },
  { label: "14+ Days", value: "14+" },
] as const;

function SearchResultCard({
  result,
}: Readonly<{
  result: SearchResult;
}>) {
  return (
    <article className="group">
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-xl bg-stone-100">
        <Image
          alt={result.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={result.image}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-950 backdrop-blur-md">
          {result.category}
        </span>
        <Button
          aria-label={`Save ${result.title}`}
          className="absolute right-4 top-4 size-10 rounded-full bg-white/90 text-stone-700 backdrop-blur-md hover:bg-white hover:text-emerald-800"
          size="icon"
          variant="ghost"
        >
          <Heart className="size-4" />
        </Button>
      </div>
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-stone-950 transition-colors group-hover:text-emerald-800">
        {result.title}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-stone-600">
        {result.description}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-stone-400">
            From
          </p>
          <p className="text-lg font-medium text-stone-950">{result.price}</p>
        </div>
        <Button asChild className="text-xs font-semibold tracking-[0.08em] text-emerald-800 hover:text-emerald-900" size="sm" variant="ghost">
          <Link href={result.href}>{result.cta}</Link>
        </Button>
      </div>
    </article>
  );
}

interface SearchResponse {
  readonly results: SearchResult[];
}

interface SearchResultsPageProps {
  readonly initialCategories: readonly string[];
  readonly initialDuration: string | null;
  readonly initialMaxPrice: number;
  readonly initialMinPrice: number;
  readonly initialQuery: string;
  readonly initialResults: readonly SearchResult[];
  readonly initialSort: string;
}

export default function SearchResultsPage({
  initialCategories,
  initialDuration,
  initialMaxPrice,
  initialMinPrice,
  initialQuery,
  initialResults,
  initialSort,
}: Readonly<SearchResultsPageProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const didHydrate = useRef(false);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<readonly SearchResult[]>(initialResults);
  const [selectedCategories, setSelectedCategories] = useState<readonly string[]>(
    initialCategories,
  );
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(
    initialDuration,
  );
  const [sort, setSort] = useState<(typeof sortOptions)[number]>(
    sortOptions.includes(initialSort as (typeof sortOptions)[number])
      ? (initialSort as (typeof sortOptions)[number])
      : "Recommended",
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const serializedSearchParams = useMemo(() => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    selectedCategories.forEach((category) => params.append("category", category));

    if (minPrice > 0) {
      params.set("minPrice", String(minPrice));
    }

    if (maxPrice < 10000) {
      params.set("maxPrice", String(maxPrice));
    }

    if (selectedDuration) {
      params.set("duration", selectedDuration);
    }

    if (sort !== "Recommended") {
      params.set("sort", sort);
    }

    return params.toString();
  }, [maxPrice, minPrice, query, selectedCategories, selectedDuration, sort]);

  useEffect(() => {
    if (!didHydrate.current) {
      didHydrate.current = true;
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      router.replace(
        serializedSearchParams ? `${pathname}?${serializedSearchParams}` : pathname,
        { scroll: false },
      );

      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await fetch(`/api/search?${serializedSearchParams}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to search right now.");
        }

        const payload = (await response.json()) as SearchResponse;
        setResults(payload.results);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSearchError(
          error instanceof Error ? error.message : "Unable to search right now.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [pathname, router, serializedSearchParams]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function updateMinPrice(value: number) {
    setMinPrice(Math.min(value, maxPrice - 100));
  }

  function updateMaxPrice(value: number) {
    setMaxPrice(Math.max(value, minPrice + 100));
  }

  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />

      <section className="mx-auto w-full max-w-screen-2xl px-8 pb-24 pt-32">
        <header className="mb-16">
          <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-stone-950 md:text-[3.5rem]">
            {results.length} Journeys Found for{" "}
            <span className="font-normal italic text-emerald-800">
              &quot;{query || "all trips"}&quot;
            </span>
          </h1>
          <div className="mt-8 max-w-2xl">
            <form
              className="flex items-center rounded-xl bg-stone-100 px-4 py-3 ring-1 ring-transparent transition-colors focus-within:ring-emerald-800"
              onSubmit={(event) => event.preventDefault()}
            >
              <Search className="mr-3 size-5 text-stone-400" />
              <Input
                className="h-auto border-none bg-transparent p-0 text-lg font-normal shadow-none focus-visible:ring-0"
                name="q"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tours, hotels, destinations..."
                value={query}
              />
              {isSearching ? (
                <span className="ml-3 text-sm font-medium text-emerald-800">
                  Searching...
                </span>
              ) : null}
            </form>
            {searchError ? (
              <p className="mt-3 text-sm font-semibold text-rose-700">
                {searchError}
              </p>
            ) : null}
          </div>
        </header>

        <div className="flex flex-col gap-16 lg:flex-row">
          <aside className="w-full flex-shrink-0 space-y-12 lg:w-64">
            <div className="mb-8 lg:hidden">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Sort By
              </h3>
              <Select
                onValueChange={(value: (typeof sortOptions)[number]) => setSort(value)}
                value={sort}
              >
                <SelectTrigger className="w-full rounded-xl border-none bg-stone-100 p-3 text-stone-950 shadow-none focus:ring-0">
                  <SelectValue placeholder="Sort results" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Category
              </h3>
              <div className="space-y-3">
                {categoryFilters.map((filter) => (
                  <label className="group flex cursor-pointer items-center gap-3" key={filter}>
                    <input
                      checked={selectedCategories.includes(filter)}
                      className="size-4 rounded border-stone-400 accent-emerald-800"
                      onChange={() => toggleCategory(filter)}
                      type="checkbox"
                    />
                    <span className="text-stone-600 transition-colors group-hover:text-stone-950">
                      {filter === "Destination" ? "Destinations" : `${filter}s`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="relative h-6">
                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-stone-200" />
                  <div
                    className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-800"
                    style={{
                      left: `${minPrice / 100}%`,
                      right: `${100 - maxPrice / 100}%`,
                    }}
                  />
                  <input
                    aria-label="Minimum price"
                    className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent accent-emerald-800 [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                    max="10000"
                    min="0"
                    onChange={(event) => updateMinPrice(Number(event.target.value))}
                    step="100"
                    type="range"
                    value={minPrice}
                  />
                  <input
                    aria-label="Maximum price"
                    className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent accent-emerald-800 [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                    max="10000"
                    min="0"
                    onChange={(event) => updateMaxPrice(Number(event.target.value))}
                    step="100"
                    type="range"
                    value={maxPrice}
                  />
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>${minPrice.toLocaleString()}</span>
                  <span>
                    {maxPrice >= 10000 ? "$10,000+" : `$${maxPrice.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Duration
              </h3>
              <div className="flex flex-wrap gap-2">
                {durationFilters.map((filter) => {
                  const active = selectedDuration === filter.value;

                  return (
                    <Button
                      className={
                        active
                          ? "rounded-xl bg-emerald-100 text-stone-950 hover:bg-emerald-200"
                          : "rounded-xl border border-stone-200 bg-stone-100 text-stone-600 hover:border-emerald-800/40 hover:bg-stone-50"
                      }
                      key={filter.value}
                      onClick={() => setSelectedDuration(active ? null : filter.value)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="mb-8 hidden items-center justify-between border-b border-stone-200 pb-4 lg:flex">
              <p className="text-sm text-stone-500">Showing {results.length} results</p>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Sort:
                </span>
                <Select
                  onValueChange={(value: (typeof sortOptions)[number]) => setSort(value)}
                  value={sort}
                >
                  <SelectTrigger className="h-auto w-52 border-none bg-transparent p-0 font-medium text-stone-950 shadow-none focus:ring-0">
                    <SelectValue placeholder="Sort results" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {results.map((result) => (
                  <SearchResultCard
                    key={`${result.category}-${result.href}`}
                    result={result}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-stone-100 p-8 text-center">
                <p className="text-lg font-semibold text-stone-950">
                  No journeys found
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Try searching for another tour, hotel, or destination.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <TravelFooter />
    </main>
  );
}
