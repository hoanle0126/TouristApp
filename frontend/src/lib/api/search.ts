import type { SearchResult } from "@/src/components/travel/SearchResultsPage";
import { getDestinations } from "@/src/lib/api/destinations";
import { getHotels } from "@/src/lib/api/hotels";
import { getTours } from "@/src/lib/api/tours";

export interface TravelSearchFilters {
  readonly categories?: readonly string[];
  readonly duration?: string;
  readonly maxPrice?: number;
  readonly minPrice?: number;
  readonly sort?: string;
}

function parsePrice(value: string) {
  const match = value.match(/\d[\d,.]*/);
  return match ? Number(match[0].replace(/[,\.]/g, "")) : 0;
}

function getDurationDays(value: string) {
  const match = value.match(/\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  const number = Number(match[0]);
  return value.toLowerCase().includes("hour") ? Math.max(1, number / 24) : number;
}

function matchesDuration(result: SearchResult, duration?: string) {
  if (!duration || result.category !== "Tour") {
    return true;
  }

  const days = getDurationDays(result.meta ?? "");
  if (days === null) {
    return false;
  }

  if (duration === "1-3") {
    return days <= 3;
  }
  if (duration === "4-7") {
    return days >= 4 && days <= 7;
  }
  if (duration === "8-14") {
    return days >= 8 && days <= 14;
  }
  return days >= 14;
}

function sortResults(results: SearchResult[], sort?: string) {
  if (sort === "Price: Low to High") {
    return results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }
  if (sort === "Price: High to Low") {
    return results.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }
  if (sort === "Newest") {
    return results.reverse();
  }
  return results;
}

function filterResults(results: readonly SearchResult[], filters: TravelSearchFilters) {
  const categories = new Set(filters.categories ?? []);
  const filteredResults = results.filter((result) => {
    const price = parsePrice(result.price);
    const categoryMatch = categories.size === 0 || categories.has(result.category);
    const minPriceMatch = filters.minPrice === undefined || price >= filters.minPrice;
    const maxPriceMatch =
      filters.maxPrice === undefined ||
      filters.maxPrice >= 10000 ||
      price <= filters.maxPrice;

    return (
      categoryMatch &&
      minPriceMatch &&
      maxPriceMatch &&
      matchesDuration(result, filters.duration)
    );
  });

  return sortResults([...filteredResults], filters.sort);
}

export async function searchTravelProducts(
  query: string,
  filters: TravelSearchFilters = {},
): Promise<SearchResult[]> {
  const search = query.trim();
  const [tours, hotels, destinations] = await Promise.all([
    getTours({ search }),
    getHotels({ search }),
    getDestinations({ search }),
  ]);

  const results = [
    ...tours.map((tour) => ({
      alt: tour.alt,
      category: "Tour",
      cta: "View Tour",
      description: tour.description,
      href: `/tours/${tour.slug}`,
      image: tour.image,
      meta: tour.duration,
      price: tour.price,
      title: tour.title,
    })),
    ...hotels.map((hotel) => ({
      alt: hotel.alt,
      category: "Hotel",
      cta: "View Hotel",
      description: `${hotel.location}${hotel.amenities.length > 0 ? ` · ${hotel.amenities.join(", ")}` : ""}`,
      href: `/hotels/${hotel.slug}`,
      image: hotel.image,
      meta: hotel.location,
      price: hotel.price,
      title: hotel.name,
    })),
    ...destinations.map((destination) => ({
      alt: destination.alt,
      category: "Destination",
      cta: "View Destination",
      description: destination.description,
      href: destination.href,
      image: destination.image,
      meta: destination.description,
      price: destination.price,
      title: destination.title,
    })),
  ];

  return filterResults(results, filters);
}
