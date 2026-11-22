"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { safeNextPath } from "@/lib/redirect";
import { PageLoader } from "@/components/ui/page-loader";
import { useAuth } from "@/providers/AuthProvider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const current =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/dashboard";

      router.replace(
        `/login?next=${encodeURIComponent(safeNextPath(current))}`,
      );
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
