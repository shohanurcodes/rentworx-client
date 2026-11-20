import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageLoader } from "@/components/ui/page-loader";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your RentWorx account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue to your rentals, favorites, and dashboard."
    >
      <Suspense fallback={<PageLoader label="Preparing login..." />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
