"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, LayoutDashboard, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  const { user } = useAuth();

  const tiles = [
    {
      label: "My Rentals",
      description: "Review bookings, payment status, and rental dates.",
      icon: ReceiptText,
    },
    {
      label: "Favorites",
      description: "Keep the equipment you want to rent again close by.",
      icon: Heart,
    },
    {
      label: "Profile",
      description: "Update your contact details and profile image.",
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Hello, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your RentWorx dashboard is ready. Detailed management views will be
            added in the next build stage.
          </p>
        </div>
        <Badge variant="accent" className="uppercase">
          {user?.role ?? "customer"}
        </Badge>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Card key={tile.label} className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <tile.icon className="size-5" />
              </div>
              <CardTitle className="mt-3">{tile.label}</CardTitle>
              <CardDescription>{tile.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/all-equipment"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Browse equipment
                <ArrowUpRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
