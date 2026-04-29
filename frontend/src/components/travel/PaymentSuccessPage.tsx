"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import {
  CheckCheck,
  Circle,
  Download,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

const headlineFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const successPageData = {
  bookingDate: "Oct 24, 2024",
  heroAlt:
    "serene high-angle view of a mountain lake at dawn with misty atmosphere and soft morning light reflecting on emerald water",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCz-mWdJQF5X7JH95YcyqyydzLIGqLJVerrdtx1vI-JJ6NNhd8O71Rz-uPzp4kJplyncJEpp9mFeoE5EQwcHP1fn0RyGkcGAdyRknoGLKxXO0DgMBMcLHZjYYebkzCspXnzh23-er5UTjeqDLqBcpAUD9NZhuNO-PoojhJ4W9TITyyvV4Z_jXjEUtHEpktiH8j7o-rN9G17h8kHIoN_vMTKkCPQvY24MFnFHJCTOwafosWRifz1bo-DQcxOhH_KKA0LWbInFQxMcgKC",
  intro:
    "Thank you for choosing CURATOR. Your itinerary has been sent to your email. We've curated something truly special for your upcoming exploration.",
  paymentStatus: "Total Paid $90",
  referenceNumber: "#CRT-2024-88",
  tiles: [
    {
      alt: "cinematic view of jagged mountain peaks under a clear indigo sky at twilight with soft glowing light",
      description:
        "View our curated list of essentials and travel tips for your specific itinerary.",
      href: "/blog",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBXfuvw7clywxQEN-UpvIZvZvSEbvQqtRQa0waeTnVWBVVBADpQDgK-3Unji9MOTDdD3qpM6a975aJYdyi5JjJRpSMHDna1Vrfj9s7mf6HhPmLebvzTul5ZgmoHnI3bkqAKMxGnZ2uEhn3kBnFOD68j7jsz_kBK1s-rNiX9xFegiYSX5MGbdN75K9PCVEMYGMuvypzVCL6qlncKqrGQkkPlYP6mOK0GZTkjOqSNKvVO3PunLvpfz4lJmxifQj7TUttetwzuwfiMZ-ey",
      title: "Prepare for your Destination",
    },
    {
      alt: "peaceful alpine lake reflecting surrounding pine forests and snow-capped peaks in glassy still water",
      description:
        "Discover other hidden gems that match your refined travel profile.",
      href: "/tours",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAK-h4CTuPzGpmOuhHA7zpTvEhkGSKaGDdcpYZdcumoJhx6RgQdAW-nROWXOQKo2CNWgKxTCCqWCwZitC5tZIcgZxBG6w1O11NknVQr7EDyJYat0dxslBRuXcxywK0b5pDyMJ-ahUzd1PLFZGkLxxh1ziNdBekk1EYZ27p1rBiUKZw4K3qbOgWHmdgQ3nRsJm8scvdaAuJ1DAw2z-xU7WNrH98egwuu-T4eO61c1wIHlrl3ltAGR94uCdWxGgdwxKamUcFcEIBm3js_",
      title: "Explore Similar Journeys",
    },
  ],
} as const;

function SummaryItem({
  children,
  label,
}: Readonly<{
  children: React.ReactNode;
  label: string;
}>) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className={cn(bodyFont.className, "min-h-screen overflow-x-hidden bg-[#f9faf6] text-stone-950")}>
      <section
        className="relative h-[320px] overflow-hidden bg-emerald-900 md:h-[409px]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)" }}
      >
        <Image
          alt={successPageData.heroAlt}
          className="object-cover opacity-70 mix-blend-overlay"
          fill
          priority
          sizes="100vw"
          src={successPageData.heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/40" />
        <div className="absolute inset-0 bg-emerald-900/40" />
      </section>

      <main className="relative mx-auto -mt-32 max-w-4xl px-6 pb-24 md:-mt-48 md:px-12">
        <Card className="rounded-xl border-none bg-white shadow-[0_40px_80px_rgba(26,28,26,0.06)]">
          <CardContent className="p-8 text-center md:p-16">
            <div className="mb-8 inline-flex size-24 items-center justify-center rounded-full bg-emerald-100">
              <CheckCheck className="size-12 text-emerald-800" strokeWidth={2.2} />
            </div>

            <h1
              className={cn(
                headlineFont.className,
                "mb-4 text-4xl font-extrabold tracking-[-0.06em] text-stone-950 md:text-5xl",
              )}
            >
              Your Journey Awaits
            </h1>
            <h2
              className={cn(
                headlineFont.className,
                "mb-6 text-xl font-semibold text-emerald-800 md:text-2xl",
              )}
            >
              Booking Confirmed
            </h2>
            <p className="mx-auto mb-12 max-w-md leading-7 text-stone-500">
              {successPageData.intro}
            </p>

            <Card className="mb-12 rounded-xl border-none bg-stone-100 text-left shadow-none">
              <CardContent className="p-8">
                <h3
                  className={cn(
                    headlineFont.className,
                    "mb-6 text-xs font-bold uppercase tracking-[0.2em] text-stone-500",
                  )}
                >
                  Booking Summary
                </h3>
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <SummaryItem label="Reference Number">
                    <span
                      className={cn(
                        headlineFont.className,
                        "text-lg font-bold text-stone-950",
                      )}
                    >
                      {successPageData.referenceNumber}
                    </span>
                  </SummaryItem>

                  <div className="h-px bg-stone-300/60 md:h-12 md:w-px" />

                  <SummaryItem label="Payment Status">
                    <div className="flex items-center gap-2">
                      <Circle className="size-2 fill-emerald-800 text-emerald-800" />
                      <span
                        className={cn(
                          headlineFont.className,
                          "text-lg font-bold text-stone-950",
                        )}
                      >
                        {successPageData.paymentStatus}
                      </span>
                    </div>
                  </SummaryItem>

                  <div className="h-px bg-stone-300/60 md:h-12 md:w-px" />

                  <SummaryItem label="Date">
                    <span
                      className={cn(
                        headlineFont.className,
                        "text-lg font-bold text-stone-950",
                      )}
                    >
                      {successPageData.bookingDate}
                    </span>
                  </SummaryItem>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
              <Button asChild className="w-full px-10 py-4 md:w-auto" size={null}>
                <Link href="/blog">Back to Journal</Link>
              </Button>
              <Button className="w-full px-10 py-4 md:w-auto" size={null} variant="outline">
                <Download className="size-4" />
                Download Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {successPageData.tiles.map((tile) => (
            <Link className="group block" href={tile.href} key={tile.title}>
              <div className="mb-4 aspect-[16/9] overflow-hidden rounded-xl">
                <Image
                  alt={tile.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  height={420}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src={tile.image}
                  width={720}
                />
              </div>
              <h4
                className={cn(
                  headlineFont.className,
                  "mb-2 text-lg font-bold text-stone-950",
                )}
              >
                {tile.title}
              </h4>
              <p className="text-sm leading-7 text-stone-500">
                {tile.description}
              </p>
            </Link>
          ))}
        </section>
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
