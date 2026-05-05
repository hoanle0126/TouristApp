import Image from "next/image";
import Link from "next/link";
import { Heart, Search } from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export interface SearchResult {
  readonly alt: string;
  readonly category: string;
  readonly cta: string;
  readonly description: string;
  readonly href: string;
  readonly image: string;
  readonly price: string;
  readonly title: string;
}

const sortOptions = [
  "Recommended",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
] as const;

const categoryFilters = [
  { checked: true, label: "Tours" },
  { checked: false, label: "Hotels" },
  { checked: false, label: "Experiences" },
] as const;

const durationFilters = ["1-3 Days", "4-7 Days", "8-14 Days", "14+ Days"] as const;

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

interface SearchResultsPageProps {
  readonly query: string;
  readonly results: readonly SearchResult[];
}

export default function SearchResultsPage({ query, results }: Readonly<SearchResultsPageProps>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Tours" />

      <section className="mx-auto w-full max-w-screen-2xl px-8 pb-24 pt-32">
        <header className="mb-16">
          <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-stone-950 md:text-[3.5rem]">
            24 Journeys Found for{" "}
            <span className="font-normal italic text-emerald-800">&quot;{query}&quot;</span>
          </h1>
          <div className="mt-8 max-w-2xl">
            <form action="/search" className="flex items-center rounded-xl bg-stone-100 px-4 py-3 ring-1 ring-transparent transition-colors focus-within:ring-emerald-800">
              <Search className="mr-3 size-5 text-stone-400" />
              <Input
                className="h-auto border-none bg-transparent p-0 text-lg font-normal shadow-none focus-visible:ring-0"
                defaultValue={query}
                name="q"
              />
              <Button className="ml-3 h-auto py-0 font-medium text-emerald-800 hover:bg-transparent hover:text-emerald-900" size={null} type="submit" variant="ghost">
                Update
              </Button>
            </form>
          </div>
        </header>

        <div className="flex flex-col gap-16 lg:flex-row">
          <aside className="w-full flex-shrink-0 space-y-12 lg:w-64">
            <div className="mb-8 lg:hidden">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Sort By
              </h3>
              <select className="w-full rounded-xl border-none bg-stone-100 p-3 text-stone-950 outline-none ring-0">
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Category
              </h3>
              <div className="space-y-3">
                {categoryFilters.map((filter) => (
                  <label className="group flex cursor-pointer items-center gap-3" key={filter.label}>
                    <input
                      className="size-4 rounded border-stone-400 accent-emerald-800"
                      defaultChecked={filter.checked}
                      type="checkbox"
                    />
                    <span className="text-stone-600 transition-colors group-hover:text-stone-950">
                      {filter.label}
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
                <input
                  className="w-full accent-emerald-800"
                  max="10000"
                  min="0"
                  type="range"
                />
                <div className="flex justify-between text-sm text-stone-500">
                  <span>$0</span>
                  <span>$10,000+</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-stone-950">
                Duration
              </h3>
              <div className="flex flex-wrap gap-2">
                {durationFilters.map((filter, index) => (
                  <Button
                    className={
                      index === 0
                        ? "rounded-xl bg-emerald-100 text-stone-950 hover:bg-emerald-200"
                        : "rounded-xl border border-stone-200 bg-stone-100 text-stone-600 hover:border-emerald-800/40 hover:bg-stone-50"
                    }
                    key={filter}
                    size="sm"
                    variant="ghost"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="mb-8 hidden items-center justify-between border-b border-stone-200 pb-4 lg:flex">
              <p className="text-sm text-stone-500">Showing 1-12 of 24 results</p>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Sort:
                </span>
                <select className="cursor-pointer border-none bg-transparent p-0 pr-6 font-medium text-stone-950 outline-none">
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <SearchResultCard key={result.title} result={result} />
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <Button className="rounded-xl border border-stone-200 bg-stone-100 px-8 py-4 text-sm font-medium text-stone-950 hover:bg-stone-200" size={null} variant="ghost">
                Load More Results
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TravelFooter />
    </main>
  );
}
