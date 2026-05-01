import SearchResultsPage from "@/src/components/travel/SearchResultsPage";
import { getHotels } from "@/src/lib/api/hotels";
import { getTours } from "@/src/lib/api/tours";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  readonly searchParams?: Promise<{
    readonly q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: Readonly<SearchPageProps>) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() || "Japan";
  const [tours, hotels] = await Promise.all([
    getTours(),
    getHotels({ search: query }),
  ]);
  const normalizedQuery = query.toLowerCase();
  const tourResults = tours
    .filter((tour) => {
      const haystack = `${tour.title} ${tour.description} ${tour.duration}`.toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    })
    .map((tour) => ({
      alt: tour.alt,
      category: "Tour",
      cta: "View Tour",
      description: tour.description,
      href: `/tours/${tour.slug}`,
      image: tour.image,
      price: tour.price,
      title: tour.title,
    }));
  const hotelResults = hotels.map((hotel) => ({
    alt: hotel.alt,
    category: "Hotel",
    cta: "View Hotel",
    description: `${hotel.location}${hotel.amenities.length > 0 ? ` · ${hotel.amenities.join(", ")}` : ""}`,
    href: `/hotels/${hotel.slug}`,
    image: hotel.image,
    price: hotel.price,
    title: hotel.name,
  }));

  return <SearchResultsPage query={query} results={[...tourResults, ...hotelResults]} />;
}
