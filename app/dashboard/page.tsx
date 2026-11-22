"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardShell user={user ?? null}>
      {user?.role === "admin" ? (
        <AdminDashboard />
      ) : user?.role === "owner" ? (
        <OwnerDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </DashboardShell>
  );
}
