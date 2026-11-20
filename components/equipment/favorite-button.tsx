"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useFavorites } from "@/providers/FavoritesProvider";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  equipmentId,
  className,
}: {
  equipmentId: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [pending, setPending] = useState(false);

  const saved = isFavorite(equipmentId);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.info("Sign in to save favorites");
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setPending(true);
      await toggleFavorite(equipmentId);
    } catch {
      // Toast is shown by the favorites provider.
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={saved ? "Remove from favorites" : "Add to favorites"}
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "size-9 rounded-full bg-background/90 shadow-sm backdrop-blur hover:bg-background",
        saved && "text-rose-500 hover:text-rose-600",
        className,
      )}
    >
      <Heart className={cn("size-4", saved && "fill-current")} />
    </Button>
  );
}
