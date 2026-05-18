import Link from "next/link";

import { PublicBookingLookup } from "@/src/components/travel/PublicBookingLookup";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

export const metadata = {
  description: "View an existing TouristWeb booking without signing in.",
  title: "View booking | TouristWeb",
};

export default function PublicBookingLookupPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <TravelHeader activeItem="Booking history" />
      <main className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold text-stone-500">
              <li>
                <Link className="transition-colors hover:text-red-700" href="/">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-stone-300">
                /
              </li>
              <li aria-current="page" className="text-stone-950">
                Booking history
              </li>
            </ol>
          </nav>

          <div className="mb-8 max-w-3xl">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-red-800">
              Booking lookup
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              View an existing booking without signing in
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Use your booking code and the email address or phone number on the reservation to check your itinerary, payment status, trip details, and traveler information.
            </p>
          </div>

          <PublicBookingLookup />
        </section>
      </main>
      <TravelFooter />
    </div>
  );
}
