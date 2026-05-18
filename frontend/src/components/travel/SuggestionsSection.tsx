"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { type SuggestionCard } from "@/src/data/mockData";

const suggestionTabs = [
  { label: "All", value: "all" },
  { label: "Hotels", value: "hotel" },
  { label: "Tours", value: "tour" },
  { label: "Destinations", value: "destination" },
] as const;

type SuggestionTabValue = (typeof suggestionTabs)[number]["value"];

const categoryListingHref = {
  destination: "/destinations",
  hotel: "/hotels",
  tour: "/tours",
} satisfies Record<SuggestionCard["category"], string>;

const categoryHoverItems = {
  destination: ["Featured areas", "Best season to visit", "Matching tours"],
  hotel: ["Room style guidance", "Standout amenities", "Stay packages"],
  tour: ["Detailed itinerary", "Included services", "Departure advice"],
} satisfies Record<SuggestionCard["category"], readonly string[]>;

function SuggestionCardView({ suggestion }: { readonly suggestion: SuggestionCard }) {
  return (
    <article className="group">
      <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-stone-200">
        <Image
          alt={suggestion.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          src={suggestion.image}
        />
        <div className="absolute inset-0 flex translate-y-4 flex-col justify-end bg-gradient-to-t from-stone-950/88 via-stone-950/35 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <ul className="mb-4 space-y-2 text-xs font-semibold text-white/90">
            {categoryHoverItems[suggestion.category].map((item) => (
              <li className="flex items-center gap-2" key={item}>
                <span className="size-1.5 rounded-full bg-red-300" />
                {item}
              </li>
            ))}
          </ul>
          <Link className="inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-stone-950 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={categoryListingHref[suggestion.category]}>
            View listing
          </Link>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">{suggestion.category}</p>
          <Link className="mt-2 block text-xl font-bold tracking-tight text-stone-950 transition-colors hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700" href={suggestion.href}>
            {suggestion.title}
          </Link>
          <p className="mt-1 text-sm text-stone-600">{suggestion.location}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-bold text-red-800">{suggestion.price}</p>
      </div>
    </article>
  );
}

export function SuggestionTabs({ suggestions }: { readonly suggestions: readonly SuggestionCard[] }) {
  const [activeTab, setActiveTab] = useState<SuggestionTabValue>("all");

  const filteredSuggestions = useMemo(() => {
    const nextSuggestions =
      activeTab === "all"
        ? suggestions
        : suggestions.filter((suggestion) => suggestion.category === activeTab);

    return nextSuggestions.slice(0, 4);
  }, [activeTab, suggestions]);

  return (
    <section>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-red-800">Curated Next</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">Suggestions tailored to your travel mood</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestionTabs.map((tab) => (
            <Button
              className="rounded-full"
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              size="sm"
              type="button"
              variant={activeTab === tab.value ? "default" : "outline"}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {filteredSuggestions.map((suggestion) => (
            <SuggestionCardView key={`${suggestion.category}-${suggestion.title}`} suggestion={suggestion} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-800">
            <Sparkles className="size-7" />
          </div>
          <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">No matches in this tab yet</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
            Try another category to explore more curated stays, tours, and destination ideas.
          </p>
        </div>
      )}
    </section>
  );
}
