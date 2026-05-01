"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { FormEvent, useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  CreditCard,
  Landmark,
  Leaf,
  Lock,
  ShieldCheck,
  Smartphone,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useCart } from "@/src/components/travel/CartProvider";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";
import { createBooking } from "@/src/lib/api/bookings";

const headlineFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const paymentOptions = [
  {
    description: "Credit Card",
    icon: CreditCard,
    value: "credit-card",
  },
  {
    description: "Apple Pay",
    icon: Smartphone,
    value: "apple-pay",
  },
  {
    description: "Bank Transfer",
    icon: Landmark,
    value: "bank-transfer",
  },
] as const;

type PaymentMethod = (typeof paymentOptions)[number]["value"];

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

function PaymentOptionCard({
  checked,
  icon: Icon,
  label,
}: Readonly<{
  checked: boolean;
  icon: typeof CreditCard;
  label: string;
}>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border px-6 py-7 transition-all",
        checked
          ? "border-emerald-800 bg-emerald-100/45 shadow-[0_18px_40px_-32px_rgba(6,78,59,0.55)]"
          : "border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50/80",
      )}
    >
      <Icon
        className={cn(
          "size-7",
          checked ? "text-emerald-800" : "text-stone-700",
        )}
        strokeWidth={2}
      />
      <span className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-stone-950">
        {label}
      </span>
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

export default function CheckoutPage() {
  const { clearCart, items, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card");
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
      travelers: items.length > 1 ? `${items.length} items in cart` : primaryItem.meta,
    };
  }, [items, primaryItem, subtotal]);

  const securePaymentLabel = useMemo(() => {
    return `Secure Payment - ${journey.totalPrice}`;
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
        const booking = await createBooking({
          country,
          email,
          fullName,
          items: items.map((item) => ({
            itemType: item.itemType ?? "tour",
            meta: item.meta,
            nights: item.nights,
            quantity: item.quantity ?? 1,
            roomType: item.roomType,
            slug: item.slug ?? item.id,
            unitPrice: Number(item.price.replace(/[^0-9.]/g, "")),
          })),
          paymentMethod,
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
              </div>
            </section>

            <section>
              <SectionHeading index="02" title="Payment Method" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {paymentOptions.map((option) => (
                  <label className="cursor-pointer" key={option.value}>
                    <input
                      checked={paymentMethod === option.value}
                      className="sr-only"
                      name="payment-method"
                      onChange={() => setPaymentMethod(option.value)}
                      type="radio"
                    />
                    <PaymentOptionCard
                      checked={paymentMethod === option.value}
                      icon={option.icon}
                      label={option.description}
                    />
                  </label>
                ))}
              </div>

              <Card className="mt-8 rounded-xl border-none bg-stone-100 shadow-none">
                <CardContent className="space-y-6 p-6 md:p-8">
                  <div>
                    <Label className="text-stone-500" htmlFor="card-number">
                      Card Number
                    </Label>
                    <div className="relative">
                      <Input
                        className="h-14 rounded-xl border-none bg-white px-6 pr-14 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                        id="card-number"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                      />
                      <Lock className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label className="text-stone-500" htmlFor="expiry-date">
                        Expiry Date
                      </Label>
                      <Input
                        className="h-14 rounded-xl border-none bg-white px-6 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                        id="expiry-date"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-500" htmlFor="cvv">
                        CVV
                      </Label>
                      <Input
                        className="h-14 rounded-xl border-none bg-white px-6 shadow-none focus-visible:ring-4 focus-visible:ring-emerald-800/12"
                        id="cvv"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="pt-2">
              {errorMessage ? (
                <p className="mb-4 rounded-xl bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
                  {errorMessage}
                </p>
              ) : null}
              <Button className="h-auto w-full rounded-xl py-6 text-lg font-bold shadow-[0_24px_50px_-28px_rgba(6,78,59,0.6)]" disabled={isPending || items.length === 0} size={null} type="submit">
                <ShieldCheck className="size-5" />
                {isPending ? "Creating Booking..." : securePaymentLabel}
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
