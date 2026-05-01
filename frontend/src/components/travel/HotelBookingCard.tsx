"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageCircle, ShoppingBag, Star } from "lucide-react";

import { useCart } from "@/src/components/travel/CartProvider";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { type CartItem, type HotelDetail, type HotelDetailSuite } from "@/src/types/travel";

const travelerOptions = [
  "2 Adults, 1 Room",
  "2 Adults, 2 Rooms",
  "4 Adults, 2 Rooms",
  "Family Suite Request",
] as const;

type AvailabilityStatus = "available" | "limited" | "sold-out";

interface AvailabilityOption {
  readonly nightlyRate: string;
  readonly status: AvailabilityStatus;
  readonly suite: HotelDetailSuite;
  readonly total: string;
}

function parseCurrency(value: string) {
  return Number(value.replace(/[^0-9.]/g, ""));
}

function formatDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function calculateNights(checkIn: string, checkOut: string) {
  const checkInDate = new Date(`${checkIn}T00:00:00`);
  const checkOutDate = new Date(`${checkOut}T00:00:00`);
  const difference = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.round(difference / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 0;
}

function availabilityStatusForSuite(
  suite: HotelDetailSuite,
  travelers: string,
  nights: number,
): AvailabilityStatus {
  if (travelers === "Family Suite Request" && suite.name !== "Grand Riverside Suite") {
    return "sold-out";
  }

  if (suite.name === "Grand Riverside Suite" && nights >= 5) {
    return "limited";
  }

  if (travelers === "4 Adults, 2 Rooms" && suite.name === "Heritage Deluxe Room") {
    return "limited";
  }

  return "available";
}

function buildAvailabilityOptions(
  hotel: HotelDetail,
  travelers: string,
  nights: number,
): readonly AvailabilityOption[] {
  return hotel.suites.map((suite) => {
    const nightlyRate = parseCurrency(suite.price);
    const status = availabilityStatusForSuite(suite, travelers, nights);
    const total = nightlyRate * nights + parseCurrency(hotel.booking.fee);

    return {
      nightlyRate: suite.price,
      status,
      suite,
      total: `$${total.toLocaleString()}`,
    };
  });
}

function statusLabel(status: AvailabilityStatus) {
  if (status === "available") {
    return "Available";
  }

  if (status === "limited") {
    return "Only 1 room left";
  }

  return "Sold out";
}

function statusClasses(status: AvailabilityStatus) {
  if (status === "available") {
    return "bg-emerald-100 text-emerald-900";
  }

  if (status === "limited") {
    return "bg-amber-100 text-amber-900";
  }

  return "bg-stone-200 text-stone-700";
}

function createCartItem(
  hotel: HotelDetail,
  suite: HotelDetailSuite,
  stayLabel: string,
  travelers: string,
  total: string,
  nights: number,
): CartItem {
  return {
    id: `${hotel.title}-${suite.name}-${stayLabel}-${travelers}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    alt: hotel.heroAlt,
    date: stayLabel,
    image: hotel.heroImage,
    itemType: "hotel",
    meta: `${suite.name} • ${travelers}`,
    nights,
    price: total,
    quantity: 1,
    roomType: suite.name,
    slug: hotel.slug,
    title: hotel.title,
  };
}

export function HotelBookingCard({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [checkIn, setCheckIn] = useState("2026-05-12");
  const [checkOut, setCheckOut] = useState("2026-05-18");
  const [travelers, setTravelers] = useState<(typeof travelerOptions)[number]>("2 Adults, 1 Room");
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [selectedSuiteName, setSelectedSuiteName] = useState<string | null>(null);

  const nights = calculateNights(checkIn, checkOut);
  const stayLabel =
    nights > 0 ? `${formatDate(checkIn)} - ${formatDate(checkOut)}` : "";
  const availabilityOptions =
    nights > 0 ? buildAvailabilityOptions(hotel, travelers, nights) : [];
  const selectedOption = availabilityOptions.find(
    (option) => option.suite.name === selectedSuiteName,
  );
  const cartItem = selectedOption
    ? createCartItem(hotel, selectedOption.suite, stayLabel, travelers, selectedOption.total, nights)
    : null;
  const inCart = cartItem ? isInCart(cartItem) : false;

  return (
    <aside className="lg:sticky lg:top-32 lg:col-span-4">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-2xl shadow-stone-950/5 md:p-10">
        <div className="mb-10 flex items-baseline justify-between">
          <div>
            <span className="text-4xl font-black text-stone-950">{hotel.price}</span>
            <span className="ml-2 text-stone-500">/ night</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-black text-stone-950">
            <Star className="size-4 fill-emerald-800 text-emerald-800" />
            {hotel.booking.rating}
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-stone-100 p-4">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-stone-500" htmlFor="hotel-check-in">
                Check-in
              </label>
              <Input
                className="mt-2 h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm font-bold shadow-none focus-visible:ring-0"
                id="hotel-check-in"
                min={new Date().toISOString().split("T")[0]}
                onChange={(event) => {
                  setCheckIn(event.target.value);
                  setHasCheckedAvailability(false);
                  setSelectedSuiteName(null);
                }}
                type="date"
                value={checkIn}
              />
            </div>
            <div className="rounded-xl bg-stone-100 p-4">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-stone-500" htmlFor="hotel-check-out">
                Check-out
              </label>
              <Input
                className="mt-2 h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm font-bold shadow-none focus-visible:ring-0"
                id="hotel-check-out"
                min={checkIn}
                onChange={(event) => {
                  setCheckOut(event.target.value);
                  setHasCheckedAvailability(false);
                  setSelectedSuiteName(null);
                }}
                type="date"
                value={checkOut}
              />
            </div>
          </div>

          <div className="rounded-xl bg-stone-100 p-4">
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-stone-500" htmlFor="hotel-travelers">
              Travelers
            </label>
            <Select
              onValueChange={(value) => {
                setTravelers(value as (typeof travelerOptions)[number]);
                setHasCheckedAvailability(false);
                setSelectedSuiteName(null);
              }}
              value={travelers}
            >
              <SelectTrigger
                className="mt-2 h-11 rounded-xl border border-stone-200 bg-white pl-4 pr-3 shadow-none focus-visible:ring-0 [&>span]:pl-0.5"
                id="hotel-travelers"
              >
                <SelectValue placeholder="Select travelers">{travelers}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {travelerOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="mt-2 w-full py-6 text-lg font-black"
            disabled={nights === 0}
            onClick={() => setHasCheckedAvailability(true)}
            size="lg"
            type="button"
          >
            Check Availability
          </Button>
          <p className="text-center text-xs text-stone-500">You won&apos;t be charged yet</p>

          {hasCheckedAvailability ? (
            <div className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-800">Availability Results</p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    {stayLabel} • {nights} nights
                  </p>
                </div>
                <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                  {travelers}
                </span>
              </div>

              <div className="space-y-3">
                {availabilityOptions.map((option) => {
                  const selected = selectedSuiteName === option.suite.name;
                  const disabled = option.status === "sold-out";

                  return (
                    <button
                      className={
                        selected
                          ? "w-full rounded-[1.25rem] border border-emerald-800 bg-white p-4 text-left shadow-[0_18px_40px_-30px_rgba(6,78,59,0.35)]"
                          : "w-full rounded-[1.25rem] border border-stone-200 bg-white p-4 text-left transition-colors hover:border-stone-300"
                      }
                      disabled={disabled}
                      key={option.suite.name}
                      onClick={() => setSelectedSuiteName(option.suite.name)}
                      type="button"
                    >
                      <div>
                        <p className="font-bold text-stone-950">{option.suite.name}</p>
                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] ${statusClasses(option.status)}`}
                        >
                          {statusLabel(option.status)}
                        </span>
                        <p className="mt-3 text-sm leading-relaxed text-stone-500">
                          {option.suite.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-stone-950">
                            {option.nightlyRate}
                            <span className="ml-1 font-normal text-stone-500">/ night</span>
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            Total stay {option.total}
                          </p>
                        </div>
                        <span className={selected ? "text-xs font-black uppercase tracking-[0.18em] text-emerald-800" : "text-xs font-black uppercase tracking-[0.18em] text-stone-400"}>
                          {selected ? "Selected" : disabled ? "Unavailable" : "Select room"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="space-y-4 border-t border-stone-200 pt-8">
            <div className="flex justify-between text-stone-500">
              <span>{selectedOption ? `${selectedOption.nightlyRate} x ${nights} nights` : `${hotel.price} x ${hotel.booking.nights}`}</span>
              <span>{selectedOption ? `$${(parseCurrency(selectedOption.nightlyRate) * nights).toLocaleString()}` : hotel.booking.nightlyTotal}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Wellness Service Fee</span>
              <span>{hotel.booking.fee}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-black text-stone-950">
              <span>Total</span>
              <span>{selectedOption ? selectedOption.total : hotel.booking.total}</span>
            </div>
          </div>

          <Button
            className="w-full py-6 text-lg font-black uppercase tracking-widest"
            disabled={!selectedOption}
            onClick={() => {
              if (!cartItem) {
                return;
              }

              addItem(cartItem);
            }}
            size="lg"
            type="button"
            variant="outline"
          >
            {inCart ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
            {inCart ? "Added to Cart" : "Add to Cart"}
          </Button>

          <Button
            className="w-full py-6 text-lg font-black uppercase tracking-widest"
            disabled={!selectedOption}
            onClick={() => {
              if (!cartItem) {
                return;
              }

              addItem(cartItem);
              startTransition(() => {
                router.push("/checkout");
              });
            }}
            size="lg"
            type="button"
          >
            Reserve Stay
          </Button>

          <div className="border-t border-stone-200 pt-8">
            <Button className="w-full gap-2 text-xs uppercase tracking-widest" variant="outline">
              <MessageCircle className="size-4" />
              Ask a Curator
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
