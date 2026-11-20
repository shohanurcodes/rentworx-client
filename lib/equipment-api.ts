import { api } from "@/lib/api";
import type { Equipment, EquipmentQuery, FeaturedEquipment } from "@/lib/types";

export async function fetchEquipment(query: EquipmentQuery = {}) {
  const params = new URLSearchParams();

  const entries: [string, string | number | undefined | boolean][] = [
    ["search", query.search],
    ["location", query.location],
    ["category", query.category],
    ["rentalType", query.rentalType],
    ["minPrice", query.minPrice],
    ["maxPrice", query.maxPrice],
    ["available", query.available],
    ["sort", query.sort],
    ["page", query.page],
    ["limit", query.limit],
  ];

  for (const [key, value] of entries) {
    if (value !== undefined && value !== "" && value !== false) {
      params.set(key, String(value));
    }
  }

  const suffix = params.toString();
  return api.get<FeaturedEquipment[]>(`/equipment${suffix ? `?${suffix}` : ""}`, {
    auth: false,
  });
}

export async function fetchEquipmentById(id: string) {
  return api.get<Equipment>(`/equipment/${id}`, { auth: false });
}
