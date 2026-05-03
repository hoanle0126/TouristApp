"use client";

import Image from "next/image";
import Link from "next/link";
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

function SuggestionCardView({ suggestion }: { readonly suggestion: SuggestionCard }) {
  return (
    <article className="group">
      <Link className="block" href={suggestion.href}>
        <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-stone-200">
          <Image
            alt={suggestion.alt}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            src={suggestion.image}
          />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{suggestion.category}</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-stone-950">{suggestion.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{suggestion.location}</p>
          </div>
          <p className="whitespace-nowrap text-sm font-bold text-emerald-800">{suggestion.price}</p>
        </div>
      </Link>
    </article>
  );
}

export function SuggestionTabs({ suggestions }: { readonly suggestions: readonly SuggestionCard[] }) {
  const [activeTab, setActiveTab] = useState<SuggestionTabValue>("all");

  const filteredSuggestions = useMemo(() => {
    if (activeTab === "all") {
      return suggestions;
    }

    return suggestions.filter((suggestion) => suggestion.category === activeTab);
  }, [activeTab, suggestions]);

  return (
    <section>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Curated Next</p>
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {filteredSuggestions.map((suggestion) => (
          <SuggestionCardView key={`${suggestion.category}-${suggestion.title}`} suggestion={suggestion} />
        ))}
      </div>
    </section>
  );
}
