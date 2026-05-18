"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
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

export function HotelsSidebarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSearch = searchParams.get("search") ?? "";
  const currentRating = searchParams.get("rating") ?? "";
  const currentPriceRange = searchParams.get("priceRange") ?? "";
  const currentAmenities = searchParams.get("amenities") ?? "";

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_30px_80px_-55px_rgba(28,25,23,0.45)] lg:sticky lg:top-28">
        <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-800">Filters</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-stone-950">Refine stays</h2>
          </div>
          <Search aria-hidden="true" className="size-5 text-red-800" />
        </div>
        
        <div className="space-y-7">
          <div>
            <Label className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-stone-500" htmlFor="hotel-search">
              Search hotels
            </Label>
            <Input 
              id="hotel-search" 
              placeholder="E.g. The Aman, Tokyo..." 
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
              Star Rating
            </Label>
            <Select value={currentRating} onValueChange={(v) => updateFilter("rating", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="boutique">Boutique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-stone-500">
              Price Per Night
            </Label>
            <Select value={currentPriceRange} onValueChange={(v) => updateFilter("priceRange", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="under-200">Under $200</SelectItem>
                <SelectItem value="200-500">$200 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000+">$1,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-stone-500">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {["Pool", "Spa", "Gym", "Restaurant", "Beachfront"].map((option) => {
                const isActive = currentAmenities === option.toLowerCase();
                return (
                  <Button
                    aria-label={`Filter by ${option}`}
                    className={`rounded-xl border size-sm type-button transition-colors ${
                      isActive 
                        ? "border-red-800 bg-red-50 text-red-900" 
                        : "border-stone-200 bg-stone-50 text-stone-600 hover:border-red-800/40 hover:bg-stone-50 hover:text-stone-950"
                    }`}
                    key={option}
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => updateFilter("amenities", isActive ? "" : option.toLowerCase())}
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
