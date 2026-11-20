"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import type { UserRole } from "@/lib/types";

export function RoleGuard({
  allowed,
  children,
}: {
  allowed: UserRole[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user && allowed.includes(user.role) ? (
        children
      ) : (
        <div className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-16">
          <Card className="w-full text-center">
            <CardHeader>
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                <ShieldAlert className="size-6" />
              </div>
              <CardTitle className="mt-3">Access restricted</CardTitle>
              <CardDescription>
                Your role does not have permission to view this page. Use the
                dashboard link below to return to your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </AuthGuard>
  );
}
