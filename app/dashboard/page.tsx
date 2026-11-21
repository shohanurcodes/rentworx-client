"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  if (user?.role === "owner") {
    return <OwnerDashboard />;
  }

  return <CustomerDashboard />;
}
