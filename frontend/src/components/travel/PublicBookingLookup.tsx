"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { lookupBooking } from "@/src/lib/api/bookings";
import { ApiError, isApiNetworkError } from "@/src/lib/api/client";
import type { ApiBooking } from "@/src/lib/api/types";

const REQUIRED_MESSAGE = "Enter your booking code and email or phone.";
const NOT_FOUND_MESSAGE = "We could not find a booking matching those details.";
const NETWORK_MESSAGE = "The booking service is unavailable. Please try again in a moment.";
const GENERIC_MESSAGE = "We could not load your booking. Please try again.";

function formatDate(value?: string) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function DetailRow({ label, value }: { readonly label: string; readonly value?: string | number }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-stone-950">{value || "Not provided"}</p>
    </div>
  );
}

function BookingResult({ booking }: { readonly booking: ApiBooking }) {
  return (
    <Card className="overflow-hidden border-red-100">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-red-800">
              Booking found
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              {booking.bookingCode}
            </h2>
            <p className="mt-2 text-sm text-stone-500">Created {formatDate(booking.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-900">
              {booking.status}
            </span>
            <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-700">
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow label="Guest" value={booking.customer.fullName} />
          <DetailRow label="Email" value={booking.customer.email} />
          <DetailRow label="Phone" value={booking.customer.phone} />
          <DetailRow label="Trip start" value={formatDate(booking.trip?.startDate)} />
          <DetailRow label="Trip end" value={formatDate(booking.trip?.endDate)} />
          <DetailRow label="Travelers" value={booking.travelers} />
          <DetailRow label="Total" value={formatCurrency(booking.totals.total, booking.totals.currency)} />
          <DetailRow label="Pickup" value={booking.trip?.pickupLocation} />
          <DetailRow label="Dropoff" value={booking.trip?.dropoffLocation} />
        </div>

        <section className="mt-8">
          <h3 className="text-lg font-bold tracking-tight text-stone-950">Booked items</h3>
          <div className="mt-4 space-y-3">
            {booking.items.map((item) => (
              <article className="rounded-2xl border border-stone-200 bg-white p-4" key={item.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-stone-950">{item.title}</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {[item.itemType, item.meta, item.date && formatDate(item.date), item.checkIn && `Check-in ${formatDate(item.checkIn)}`, item.checkOut && `Check-out ${formatDate(item.checkOut)}`, item.guests, item.roomType]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-500">Qty {item.quantity}</p>
                    <p className="mt-1 text-base font-bold text-stone-950">
                      {formatCurrency(item.lineTotal, item.currency)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-red-50 p-5">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-red-900">
            Special requests
          </p>
          <p className="mt-2 text-sm leading-6 text-red-950">
            {booking.trip?.specialRequests || "No special requests were added to this booking."}
          </p>
        </section>
      </CardContent>
    </Card>
  );
}

export function PublicBookingLookup() {
  const [bookingCode, setBookingCode] = useState("");
  const [contact, setContact] = useState("");
  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedBookingCode = bookingCode.trim();
    const trimmedContact = contact.trim();

    if (!trimmedBookingCode || !trimmedContact) {
      setBooking(null);
      setError(REQUIRED_MESSAGE);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await lookupBooking({ bookingCode: trimmedBookingCode, contact: trimmedContact });
      setBooking(result);
    } catch (caughtError) {
      setBooking(null);

      if (caughtError instanceof ApiError && caughtError.status === 404) {
        setError(NOT_FOUND_MESSAGE);
      } else if (isApiNetworkError(caughtError)) {
        setError(NETWORK_MESSAGE);
      } else {
        setError(GENERIC_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="booking-code">Booking code</Label>
              <Input
                autoComplete="off"
                id="booking-code"
                name="bookingCode"
                onChange={(event) => setBookingCode(event.target.value)}
                placeholder="TW-2026-0001"
                value={bookingCode}
              />
            </div>
            <div>
              <Label htmlFor="booking-contact">Email or phone</Label>
              <Input
                autoComplete="email tel"
                id="booking-contact"
                name="contact"
                onChange={(event) => setContact(event.target.value)}
                placeholder="you@example.com or +1 555 0100"
                value={contact}
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
                {error}
              </p>
            ) : null}

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Loading booking..." : "View booking"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {booking ? (
        <BookingResult booking={booking} />
      ) : (
        <Card className="border-dashed bg-stone-50/70">
          <CardContent className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-red-800">
              Booking details
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-950">
              Your booking details will appear here.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
              Enter the booking code and matching email or phone number from your reservation to view your itinerary, payment status, pickup, dropoff, and booked items.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
