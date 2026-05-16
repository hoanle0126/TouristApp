"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { FormEvent, useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  CreditCard,
  Leaf,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useCart } from "@/src/components/travel/CartProvider";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { getTour } from "@/src/lib/api/tours";
import { cn } from "@/src/lib/utils";
import { createBooking } from "@/src/lib/api/bookings";
import type { CartItem } from "@/src/types/travel";

const headlineFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function SectionHeading({
  index,
  title,
}: Readonly<{
  index: string;
  title: string;
}>) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="text-xs font-bold uppercase tracking-[0.32em] text-emerald-800">
        {index}
      </span>
      <h2
        className={cn(
          headlineFont.className,
          "text-3xl font-bold tracking-[-0.04em] text-stone-950",
        )}
      >
        {title}
      </h2>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: Readonly<{
  icon: typeof CalendarDays;
  label: string;
  value: string;
  valueClassName?: string;
}>) {
  return (
    <div className="flex items-center justify-between border-b border-stone-200/80 py-4 last:border-b-0">
      <div className="flex items-center gap-4">
        <Icon className="size-5 text-stone-500" strokeWidth={1.8} />
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
          {label}
        </span>
      </div>
      <span className={cn("text-right font-bold text-stone-950", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

function formatTourDepartureDate(value: string) {
  const parsedDate = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

async function resolveCheckoutItem(item: CartItem) {
  if (item.itemType !== "tour" || !item.slug) {
    return {
      itemType: item.itemType ?? "tour",
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      date: item.date,
      meta: item.meta,
      nights: item.nights,
      quantity: item.quantity ?? 1,
      roomType: item.roomType,
      tourDepartureId: item.tourDepartureId,
      slug: item.slug ?? item.id,
      unitPrice: item.unitPrice ?? Number(item.price.replace(/[^0-9.]/g, "")),
    } as const;
  }

  const latestTour = await getTour(item.slug);
  const matchedDeparture = latestTour.departures.find(
    (departure) =>
      departure.status === "open" &&
      departure.remaining > 0 &&
      formatTourDepartureDate(departure.date) === item.date,
  );

  if (!matchedDeparture) {
    throw new Error("The selected tour departure is no longer available. Please remove it from the cart and choose another date.");
  }

  return {
    itemType: item.itemType,
    checkIn: item.checkIn,
    checkOut: item.checkOut,
    date: item.date,
    meta: item.meta,
    nights: item.nights,
    quantity: item.quantity ?? 1,
    roomType: item.roomType,
    tourDepartureId: matchedDeparture.id,
    slug: item.slug,
    unitPrice: item.unitPrice ?? Number(item.price.replace(/[^0-9.]/g, "")),
  } as const;
}

export default function CheckoutPage() {
  const { clearCart, items, subtotal } = useCart();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const primaryItem = items[0];

  const journey = useMemo(() => {
    if (!primaryItem) {
      return {
        carbonContribution: "$0",
        date: "No departure selected",
        imageAlt: "Empty travel cart",
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo8noBnaTnSEeA4yEz0-rRKslv_QVN8t2mju5icPgeLY6q1BmMoShJ0UXUm6Vfqo-D0zU9klXK2kSX1sxKDZol5QhrB9BcgGAPUw20oMRbce9ZnOdxjsK8xHWtbx5IcBo614vxvjdT7wLQ1solZ6LOA2vVCYnkfse4EHKrApJkiNev4jN2RplpEW8QmBSkpOqZsxZn9ODmYJF-equyV8HGfUCkbfpxggUAQDfHs1S2YHYk9rIU0vSt3DmzsJneWbUcovmSNVt1GWza",
        title: "Your cart is empty",
        totalPrice: "$0.00",
        travelers: "0 Guests",
      };
    }

    return {
      carbonContribution: "$2",
      date: primaryItem.date,
      imageAlt: primaryItem.alt,
      imageSrc: primaryItem.image,
      title:
        items.length > 1 ? `${primaryItem.title} + ${items.length - 1} more` : primaryItem.title,
      totalPrice: `$${subtotal.toFixed(2)}`,
      travelers: items.length > 1 ? `${items.reduce((total, item) => total + (item.quantity ?? 1), 0)} total travelers/rooms` : primaryItem.meta,
    };
  }, [items, primaryItem, subtotal]);

  const securePaymentLabel = useMemo(() => {
    return `Place Booking & Generate QR - ${journey.totalPrice}`;
  }, [journey.totalPrice]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Please add at least one tour or hotel before checkout.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();

    if (!fullName || !phone || !email || !country) {
      setErrorMessage("Please complete full name, phone, email, and country before payment.");
      return;
    }

    startTransition(async () => {
      try {
        const resolvedItems = await Promise.all(items.map((item) => resolveCheckoutItem(item)));
        const booking = await createBooking({
          country,
          email,
          fullName,
          items: resolvedItems,
          paymentMethod: "bank-transfer",
          phone,
          travelers: Math.max(items.reduce((total, item) => total + (item.quantity ?? 1), 0), 1),
        });

        clearCart();
        window.location.href = `/checkout/success?bookingCode=${booking.bookingCode}`;
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to create booking.");
      }
    });
  }

  return (
    <div className={cn(bodyFont.className, "min-h-screen bg-[#f9faf6] text-stone-950")}>
      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#f9faf6]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-6 lg:px-8">
          <Link
            className={cn(
              headlineFont.className,
              "text-2xl font-bold uppercase tracking-[-0.08em] text-emerald-950",
            )}
            href="/"
          >
            Curator
          </Link>
          <Button asChild className="gap-2 rounded-full px-4 text-stone-500 hover:text-emerald-900" variant="ghost">
            <Link href="/">
              <X className="size-4" />
              <span className="text-xs uppercase tracking-[0.22em]">
                Cancel Journey
              </span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col px-6 pb-24 pt-14 lg:px-8 lg:pt-20">
        <section className="mb-16 lg:mb-20">
          <h1
            className={cn(
              headlineFont.className,
              "text-5xl font-bold tracking-[-0.08em] text-stone-950 md:text-7xl lg:text-8xl",
            )}
          >
            Checkout
          </h1>
          <div className="mt-5 h-1 w-24 rounded-full bg-emerald-800" />
        </section>

        <form className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20 xl:gap-24" onSubmit={handleSubmit}>
          <div className="space-y-16 lg:col-span-7 lg:space-y-20">
            <section>
              <SectionHeading index="01" title="Traveler Details" />
              <div className="space-y-7">
                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <div>
                    <Label className="text-stone-500" htmlFor="full-name">
                      Full Name
                    </Label>
                    <Input
                      className="h-14 rounded-xl border-none bg-stone-100 px-6 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                      id="full-name"
                      name="fullName"
                      placeholder="Johnathan Doe"
                    />
                  </div>
                  <div>
                    <Label className="text-stone-500" htmlFor="phone-number">
                      Phone Number
                    </Label>
                    <Input
                      className="h-14 rounded-xl border-none bg-stone-100 px-6 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                      id="phone-number"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-stone-500" htmlFor="email-address">
                    Email Address
                  </Label>
                  <Input
                    className="h-14 rounded-xl border-none bg-stone-100 px-6 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                    id="email-address"
                    name="email"
                    placeholder="curator@travel.com"
                    type="email"
                  />
                </div>
                <div>
                  <Label className="text-stone-500" htmlFor="country">
                    Country
                  </Label>
                  <Input
                    className="h-14 rounded-xl border-none bg-stone-100 px-6 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                    id="country"
                    name="country"
                    placeholder="Vietnam"
                  />
                </div>
                <div className="rounded-xl border border-dashed border-emerald-800/30 bg-white px-5 py-4 text-sm leading-6 text-stone-600">
                  After you submit this booking, you will be taken to a VietQR payment page with the shop account, total amount, and booking reference filled in automatically.
                </div>
              </div>
            </section>

            <section className="pt-2">
              {errorMessage ? (
                <p aria-live="polite" className="mb-4 rounded-xl bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700" role="alert">
                  {errorMessage}
                </p>
              ) : null}
              <Button className="h-auto w-full rounded-xl py-6 text-lg font-bold shadow-[0_24px_50px_-28px_rgba(6,78,59,0.6)]" disabled={isPending || items.length === 0} size={null} type="submit">
                <ShieldCheck className="size-5" />
                {isPending ? "Preparing QR Payment..." : securePaymentLabel}
              </Button>
              <p className="mt-6 text-center text-xs leading-6 tracking-[0.04em] text-stone-500">
                By completing this booking, you agree to the Curator{" "}
                <a className="underline underline-offset-2" href="#">
                  Terms of Service
                </a>{" "}
                &{" "}
                <a className="underline underline-offset-2" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Card className="overflow-hidden rounded-xl border-none bg-stone-100 shadow-none">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    alt={journey.imageAlt}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    src={journey.imageSrc}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-100/10 to-transparent" />
                </div>

                <CardContent className="space-y-8 p-6 md:p-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-800">
                      Journey Summary
                    </span>
                    <h3
                      className={cn(
                        headlineFont.className,
                        "mt-2 text-3xl font-bold tracking-[-0.05em] text-stone-950",
                      )}
                    >
                      {journey.title}
                    </h3>
                  </div>

                  <div>
                    <SummaryRow
                      icon={CalendarDays}
                      label="Date"
                      value={journey.date}
                    />
                    <SummaryRow
                      icon={Users}
                      label="Travelers"
                      value={journey.travelers}
                    />
                    <SummaryRow
                      icon={CreditCard}
                      label="Total Price"
                      value={journey.totalPrice}
                      valueClassName="text-2xl text-emerald-800"
                    />
                  </div>

                  <div className="rounded-xl border border-stone-200/70 bg-white p-5">
                    <div className="flex items-start gap-4">
                      <Leaf className="mt-0.5 size-5 shrink-0 text-emerald-800" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-950">
                          Curator Carbon Credit
                        </p>
                        <p className="mt-2 text-xs leading-6 text-stone-500">
                          This journey includes a{" "}
                          {journey.carbonContribution} contribution to local
                          mangrove restoration in the Quang Nam province.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </form>
      </main>

      <footer className="border-t border-stone-200/70 bg-stone-50">
        <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-8 px-6 py-12 text-center md:flex-row md:px-8 md:text-left">
          <Link
            className={cn(
              headlineFont.className,
              "text-lg font-bold uppercase tracking-[-0.07em] text-emerald-950",
            )}
            href="/"
          >
            Curator
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <a
              className="text-xs uppercase tracking-[0.16em] text-stone-400 transition-colors hover:text-stone-900"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs uppercase tracking-[0.16em] text-stone-400 transition-colors hover:text-stone-900"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-xs uppercase tracking-[0.16em] text-stone-400 transition-colors hover:text-stone-900"
              href="#"
            >
              Sustainability
            </a>
            <Link
              className="text-xs uppercase tracking-[0.16em] text-stone-400 transition-colors hover:text-stone-900"
              href="/contact"
            >
              Contact
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
            © 2024 The Digital Curator. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
