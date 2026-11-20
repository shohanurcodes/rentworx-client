"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import { addFavorite, fetchFavorites, removeFavorite } from "@/lib/favorites-api";
import { useAuth } from "@/providers/AuthProvider";

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    if (isLoading) return;

    if (!user) {
      setFavoriteIds([]);
      return;
    }

    fetchFavorites()
      .then((response) => {
        if (active) setFavoriteIds(response.data.map((item) => item.id));
      })
      .catch(() => {
        if (active) setFavoriteIds([]);
      });

    return () => {
      active = false;
    };
  }, [user, isLoading]);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user) {
        throw new Error("Sign in to save favorites");
      }

      const alreadySaved = favoriteIds.includes(id);

      try {
        if (alreadySaved) {
          await removeFavorite(id);
          setFavoriteIds((current) => current.filter((item) => item !== id));
          toast.success("Removed from favorites");
          return false;
        }

        await addFavorite(id);
        setFavoriteIds((current) => [...current, id]);
        toast.success("Saved to favorites");
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to update favorites",
        );
        throw error;
      }
    },
    [favoriteIds, user],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
