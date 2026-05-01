"use client";

import { startTransition, useMemo, useState } from "react";
import Image from "next/image";
import { Check, MessageCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { type CartItem, type TourDetail } from "@/src/types/travel";

const travelerOptions = [
  "1 Guest",
  "2 Guests",
  "4 Guests",
  "Private Group",
] as const;

function createCartItem(tour: TourDetail, departureDate: string, travelers: string): CartItem {
  return {
    id: `${tour.title}-${departureDate}-${travelers}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    alt: tour.heroAlt,
    date: departureDate,
    image: tour.heroImage,
    itemType: "tour",
    meta: `${tour.duration} • ${travelers}`,
    price: tour.price,
    quantity: 1,
    slug: tour.slug,
    title: tour.title,
  };
}

function formatDepartureDate(value: string) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function TourBookingCard({ tour }: Readonly<{ tour: TourDetail }>) {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [departureDate, setDepartureDate] = useState("");
  const [travelers, setTravelers] = useState<(typeof travelerOptions)[number]>("2 Guests");

  const cartItem = useMemo(() => {
    if (!departureDate) {
      return null;
    }

    return createCartItem(tour, formatDepartureDate(departureDate), travelers);
  }, [departureDate, tour, travelers]);

  const inCart = cartItem ? isInCart(cartItem) : false;
  const isReadyToBook = cartItem !== null;

  return (
    <aside className="lg:sticky lg:top-32 lg:col-span-4">
      <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-2xl shadow-stone-950/5 md:p-10">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Journey Price</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-stone-950">From {tour.price}</span>
            <span className="text-stone-500">/ person</span>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          {[
            ["Duration", tour.duration],
            ["Type", tour.type],
            ["Availability", tour.availability],
          ].map(([label, value]) => (
            <div className="flex items-center justify-between border-b border-stone-200 py-3" key={label}>
              <span className="text-stone-500">{label}</span>
              <span className={label === "Availability" ? "font-semibold text-emerald-800" : "font-semibold text-stone-950"}>{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-8 space-y-4 rounded-xl bg-stone-50 p-5">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500" htmlFor="tour-departure-date">
              Departure Date
            </label>
            <Input
              id="tour-departure-date"
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setDepartureDate(event.target.value)}
              type="date"
              value={departureDate}
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500" htmlFor="tour-travelers">
              Travelers
            </label>
            <Select onValueChange={(value) => setTravelers(value as (typeof travelerOptions)[number])} value={travelers}>
              <SelectTrigger id="tour-travelers">
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
        </div>

        <Button
          className="mb-3 w-full py-6 text-lg font-bold uppercase tracking-widest"
          disabled={!isReadyToBook}
          onClick={() => {
            if (!cartItem) {
              return;
            }

            addItem(cartItem);
          }}
          size="lg"
          type="button"
        >
          {inCart ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
          {inCart ? "Added to Cart" : "Add to Cart"}
        </Button>
        <Button
          className="mb-4 w-full py-6 text-lg font-bold uppercase tracking-widest"
          disabled={!isReadyToBook}
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
          variant="outline"
        >
          Book This Journey
        </Button>
        <p className="text-center text-xs uppercase tracking-widest text-stone-500">Select date and travelers to continue</p>
        <div className="mt-10 border-t border-stone-200 pt-8">
          <h4 className="mb-4 font-bold text-stone-950">Need help planning?</h4>
          <div className="flex items-center gap-4">
            <div className="relative size-12 overflow-hidden rounded-full bg-stone-200">
              <Image alt={tour.curatorImageAlt} className="object-cover" fill sizes="48px" src={tour.curatorImage} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-950">Talk to a Curator</p>
              <a className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-tight text-emerald-800 hover:underline" href="#">
                <MessageCircle className="size-3.5" />
                Chat with us now
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
