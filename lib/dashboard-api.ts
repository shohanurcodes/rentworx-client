import { api } from "@/lib/api";
import type {
  AdminAnalytics,
  AuthUser,
  BookingSummary,
  EquipmentPayload,
  ManageEquipment,
  OwnerAnalytics,
  UploadResponse,
  UserRole,
} from "@/lib/types";

// Shared booking actions
export function updateBookingStatus(
  id: string,
  bookingStatus: "confirmed" | "completed" | "cancelled",
) {
  return api.patch<BookingSummary>(`/bookings/${id}/status`, { bookingStatus });
}

// Owner APIs
export function fetchMyEquipment() {
  return api.get<ManageEquipment[]>("/equipment/my");
}

export function fetchOwnerBookings() {
  return api.get<BookingSummary[]>("/bookings/owner");
}

export function fetchOwnerAnalytics() {
  return api.get<OwnerAnalytics>("/analytics/owner");
}

export function createEquipment(payload: EquipmentPayload) {
  return api.post<ManageEquipment>("/equipment", payload);
}

export function updateEquipment(id: string, payload: Partial<EquipmentPayload>) {
  return api.patch<ManageEquipment>(`/equipment/${id}`, payload);
}

export function deleteEquipment(id: string) {
  return api.delete<{ id: string }>(`/equipment/${id}`);
}

export function uploadImage(image: string) {
  return api.post<UploadResponse>("/upload/imgbb", { image });
}

// Admin APIs
export function fetchAdminEquipment(
  params: { status?: string; search?: string } = {},
) {
  const query = new URLSearchParams();

  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);

  const suffix = query.toString();

  return api.get<ManageEquipment[]>(
    `/equipment/admin${suffix ? `?${suffix}` : ""}`,
  );
}

export function fetchAdminBookings() {
  return api.get<BookingSummary[]>("/bookings/admin");
}

export function fetchUsers() {
  return api.get<AuthUser[]>("/users");
}

export function fetchAdminAnalytics() {
  return api.get<AdminAnalytics>("/analytics/admin");
}

export function setEquipmentStatus(
  id: string,
  status: "approved" | "rejected",
) {
  return api.patch<ManageEquipment>(`/equipment/${id}/status`, { status });
}

export function changeUserRole(id: string, role: UserRole) {
  return api.patch<AuthUser>(`/users/${id}/role`, { role });
}

export function setUserActive(id: string, isActive: boolean) {
  return api.patch<AuthUser>(`/users/${id}/manage`, { isActive });
}

export function deleteUser(id: string) {
  return api.delete<{ id: string }>(`/users/${id}`);
}

// Profile (all roles)
export function fetchMe() {
  return api.get<AuthUser>("/auth/me");
}

export function updateProfile(input: {
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
}) {
  return api.patch<AuthUser>("/users/me", input);
}
