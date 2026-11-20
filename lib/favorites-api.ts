import { api } from "@/lib/api";
import type { FeaturedEquipment } from "@/lib/types";

export function fetchFavorites() {
  return api.get<FeaturedEquipment[]>("/favorites");
}

export function addFavorite(equipmentId: string) {
  return api.post<{ id: string }>("/favorites", { equipmentId });
}

export function removeFavorite(equipmentId: string) {
  return api.delete<{ id: string }>(`/favorites/${equipmentId}`);
}
