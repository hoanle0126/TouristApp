import HotelDetailPage from "@/src/components/travel/HotelDetailPage";
import { getHotel } from "@/src/lib/api/hotels";

export const dynamic = "force-dynamic";

export default async function ShiningRiversideHoiAnPage() {
  const hotel = await getHotel("shining-riverside-hoi-an");

  return <HotelDetailPage hotel={hotel} />;
}
