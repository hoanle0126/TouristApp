"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export function DestinationsSidebarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSearch = searchParams.get("search") ?? "";
  const currentRegion = searchParams.get("region") ?? "";
  const currentStyle = searchParams.get("style") ?? "";

  return (
    <aside className="w-full flex-shrink-0 lg:w-72">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_30px_80px_-55px_rgba(28,25,23,0.45)] lg:sticky lg:top-28">
        <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-800">Filters</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-stone-950">Refine places</h2>
          </div>
          <Filter aria-hidden="true" className="size-5 text-emerald-800" />
        </div>

        <div className="space-y-7">
          <div>
            <Label className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-stone-500" htmlFor="destination-search">
              Search destinations
            </Label>
            <Input 
              id="destination-search" 
              placeholder="E.g. Kyoto, Tokyo..." 
              defaultValue={currentSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilter("search", e.currentTarget.value);
                }
              }}
              onBlur={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-stone-500">
              Region
            </Label>
            <Select value={currentRegion} onValueChange={(v) => updateFilter("region", v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-stone-500">Travel Style</h3>
            <div className="flex flex-wrap gap-2">
              {["Adventure", "Culture", "Relaxation", "Wildlife", "Culinary"].map((option) => {
                const isActive = currentStyle === option.toLowerCase();
                return (
                  <Button
                    aria-label={`Filter by ${option}`}
                    className={`rounded-xl border size-sm type-button transition-colors ${
                      isActive 
                        ? "border-emerald-800 bg-emerald-50 text-emerald-900" 
                        : "border-stone-200 bg-stone-50 text-stone-600 hover:border-emerald-800/40 hover:bg-stone-50 hover:text-stone-950"
                    }`}
                    key={option}
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => updateFilter("style", isActive ? "" : option.toLowerCase())}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
