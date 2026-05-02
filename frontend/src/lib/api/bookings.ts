import { apiFetch } from "@/src/lib/api/client";
import type { ApiBooking, CreateBookingInput, LookupBookingInput } from "@/src/lib/api/types";

export async function createBooking(input: CreateBookingInput) {
  return apiFetch<ApiBooking>("/bookings", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function getBooking(bookingCode: string) {
  return apiFetch<ApiBooking>(`/bookings/${bookingCode}`, {
    cache: "no-store",
  });
}

export async function lookupBooking(input: LookupBookingInput) {
  return apiFetch<ApiBooking>("/bookings/lookup", {
    body: input,
    cache: "no-store",
    method: "POST",
  });
}

export async function getBookings(query: { readonly email?: string; readonly status?: string; readonly paymentStatus?: string; readonly perPage?: number } = {}) {
  return apiFetch<ApiBooking[]>("/bookings", {
    cache: "no-store",
    query: {
      email: query.email,
      status: query.status,
      payment_status: query.paymentStatus,
      per_page: query.perPage,
    },
  });
}

export async function updateBookingStatus(
  bookingCode: string,
  input: { readonly status?: string; readonly paymentStatus?: string },
) {
  return apiFetch<ApiBooking>(`/bookings/${bookingCode}/status`, {
    body: input,
    cache: "no-store",
    method: "PATCH",
  });
}
