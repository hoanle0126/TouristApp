import { NextResponse } from "next/server";

import { searchTravelProducts } from "@/src/lib/api/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const categories = searchParams.getAll("category");
  const duration = searchParams.get("duration") ?? undefined;
  const maxPriceParam = searchParams.get("maxPrice");
  const minPriceParam = searchParams.get("minPrice");
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;
  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const results = await searchTravelProducts(query, {
    categories,
    duration,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  return NextResponse.json({ results });
}
