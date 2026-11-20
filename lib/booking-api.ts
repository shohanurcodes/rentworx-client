import { api } from "@/lib/api";
import type {
  BookingCheckoutPayload,
  BookingSummary,
  CheckoutResponse,
} from "@/lib/types";

export function createCheckoutSession(payload: BookingCheckoutPayload) {
  return api.post<CheckoutResponse>("/bookings/checkout", payload);
}

export function fetchBookingStatus(id: string) {
  return api.get<BookingSummary>(`/bookings/${id}/status`);
}

export function fetchMyBookings() {
  return api.get<BookingSummary[]>("/bookings/my");
}
