import { api } from "@/lib/api";
import type { BookingCheckoutPayload, CheckoutResponse } from "@/lib/types";

export function createCheckoutSession(payload: BookingCheckoutPayload) {
  return api.post<CheckoutResponse>("/bookings/checkout", payload);
}
