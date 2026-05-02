"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

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

function AdminBookingDetailModal({ booking, onClose }: { readonly booking: ApiBooking; readonly onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm" role="presentation">
      <div aria-hidden="true" className="absolute inset-0 cursor-default" onClick={onClose} />
      <section
        ref={dialogRef}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative z-[1001] flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-[#fbfcf7] shadow-[0_40px_120px_-40px_rgba(28,25,23,0.75)] outline-none"
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 p-6 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-800">Booking detail</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950" id={titleId}>
              {booking.bookingCode}
            </h2>
            <p className="mt-2 text-sm text-stone-600" id={descriptionId}>
              {booking.customer.fullName} · {booking.customer.email}
            </p>
          </div>
          <button
            aria-label="Close booking detail"
            className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:text-stone-950"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-6 text-sm text-stone-600 sm:p-7">
          <section className="rounded-2xl bg-stone-100 p-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Customer</h4>
            <div className="mt-3 space-y-2">
              <p className="font-semibold text-stone-950">{booking.customer.fullName}</p>
              <p>{booking.customer.email}</p>
              <p>{booking.customer.phone}</p>
              <p>{[booking.customer.city, booking.customer.country].filter(Boolean).join(", ")}</p>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Booking items</h4>
            <div className="mt-3 space-y-3">
              {booking.items.map((item) => (
                <div className="rounded-2xl border border-stone-200 p-4" key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-stone-950">{item.title}</p>
                      {item.meta ? <p className="mt-1 text-xs text-stone-500">{item.meta}</p> : null}
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                        {item.itemType} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-stone-950">{formatCurrency(item.lineTotal, item.currency)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-stone-950 p-4 text-white">
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">Totals</h4>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatCurrency(booking.totals.subtotal, booking.totals.currency)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Taxes and fees</span>
                <span>{formatCurrency(booking.totals.taxesAndFees, booking.totals.currency)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/15 pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(booking.totals.total, booking.totals.currency)}</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-stone-100 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Status</p>
              <p className="mt-1 font-semibold text-stone-950">{toStatusLabel(booking.status)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Payment</p>
              <p className="mt-1 font-semibold text-stone-950">{toStatusLabel(booking.paymentStatus)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Travelers</p>
              <p className="mt-1 font-semibold text-stone-950">{booking.travelers}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Booked</p>
              <p className="mt-1 font-semibold text-stone-950">{formatDate(booking.createdAt)}</p>
            </div>
          </div>

          <Button className="w-full" onClick={onClose} type="button" variant="outline">
            Close
          </Button>
        </div>
      </section>
    </div>
  );
}

export function AdminBookingQueuePanel({ bookings }: { readonly bookings: readonly ApiBooking[] }) {
  const [rows, setRows] = useState(bookings);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
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
    <>
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
                          onClick={() => setSelectedBooking(booking)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          View
                        </Button>
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

      {selectedBooking ? <AdminBookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} /> : null}
    </>
  );
}
