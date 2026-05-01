"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { updateBookingStatus } from "@/src/lib/api/bookings";
import type { ApiBooking } from "@/src/lib/api/types";

const statusStyles: Record<string, string> = {
  cancelled: "bg-stone-200 text-stone-700",
  completed: "bg-stone-900 text-white",
  confirmed: "bg-emerald-100 text-emerald-900",
  pending: "bg-amber-100 text-amber-900",
  review: "bg-stone-200 text-stone-700",
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function toStatusLabel(status: string) {
  return status.replace(/-/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

export function AdminBookingQueuePanel({ bookings }: { readonly bookings: readonly ApiBooking[] }) {
  const [rows, setRows] = useState(bookings);
  const [updatingCode, setUpdatingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusUpdate(bookingCode: string, status: "confirmed" | "completed") {
    setUpdatingCode(bookingCode);
    setError(null);

    try {
      const updatedBooking = await updateBookingStatus(bookingCode, { status });
      setRows((currentRows) => currentRows.map((booking) => (booking.bookingCode === bookingCode ? updatedBooking : booking)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update booking status.");
    } finally {
      setUpdatingCode(null);
    }
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">
              Booking queue
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
              Reservations requiring active handling
            </h3>
          </div>
          <Button disabled size="sm" variant="ghost">
            Export queue
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">
                <th className="pb-1 pr-4">Guest</th>
                <th className="pb-1 pr-4">Product</th>
                <th className="pb-1 pr-4">Booked</th>
                <th className="pb-1 pr-4">Payment</th>
                <th className="pb-1 pr-4">Status</th>
                <th className="pb-1 pr-4">Actions</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booking) => {
                const product = booking.items[0]?.title ?? booking.bookingCode;
                const statusClassName = statusStyles[booking.status] ?? "bg-stone-200 text-stone-700";

                return (
                  <tr className="bg-stone-50 text-sm text-stone-600" key={booking.bookingCode}>
                    <td className="rounded-l-2xl px-4 py-4 font-semibold text-stone-950">
                      {booking.customer.fullName}
                      <p className="mt-1 text-xs font-medium text-stone-500">{booking.bookingCode}</p>
                    </td>
                    <td className="px-4 py-4">{product}</td>
                    <td className="px-4 py-4">{formatDate(booking.createdAt)}</td>
                    <td className="px-4 py-4">{toStatusLabel(booking.paymentStatus)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClassName}`}>
                        {toStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          disabled={updatingCode === booking.bookingCode || booking.status === "confirmed"}
                          onClick={() => handleStatusUpdate(booking.bookingCode, "confirmed")}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Confirm
                        </Button>
                        <Button
                          disabled={updatingCode === booking.bookingCode || booking.status === "completed"}
                          onClick={() => handleStatusUpdate(booking.bookingCode, "completed")}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          Complete
                        </Button>
                      </div>
                    </td>
                    <td className="rounded-r-2xl px-4 py-4 text-right font-semibold text-stone-950">
                      {formatCurrency(booking.totals.total, booking.totals.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
