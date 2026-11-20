"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { FavoritesProvider } from "@/providers/FavoritesProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          {children}
          <Toaster />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
