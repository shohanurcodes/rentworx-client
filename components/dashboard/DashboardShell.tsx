"use client";

import Link from "next/link";
import {
  CalendarCheck2,
  Heart,
  LayoutDashboard,
  Package,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AuthUser } from "@/lib/types";

type NavItem = { label: string; href: string; icon: LucideIcon };

const NAV: Record<string, NavItem[]> = {
  admin: [
    { label: "Overview", href: "#overview", icon: LayoutDashboard },
    { label: "Equipment", href: "#equipment", icon: Package },
    { label: "Rentals", href: "#rentals", icon: CalendarCheck2 },
    { label: "Users", href: "#users", icon: Users },
    { label: "Profile", href: "#profile", icon: UserRound },
  ],
  owner: [
    { label: "Overview", href: "#overview", icon: LayoutDashboard },
    { label: "Equipment", href: "#equipment", icon: Package },
    { label: "Requests", href: "#requests", icon: CalendarCheck2 },
    { label: "Earnings", href: "#earnings", icon: Heart },
    { label: "Profile", href: "#profile", icon: UserRound },
  ],
  customer: [
    { label: "Overview", href: "#overview", icon: LayoutDashboard },
    { label: "Rentals", href: "#rentals", icon: CalendarCheck2 },
    { label: "Favorites", href: "#favorites", icon: Heart },
    { label: "Profile", href: "#profile", icon: UserRound },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  owner: "Equipment owner",
  customer: "Renter",
};

function initials(name?: string) {
  if (!name) return "RW";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardShell({
  user,
  children,
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  const role = user?.role ?? "customer";
  const nav = NAV[role] ?? NAV.customer;
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="relative isolate overflow-hidden rounded-3xl bg-midnight px-6 py-8 text-white shadow-[var(--ds-shadow-lift)] sm:px-9 sm:py-10">
        <div className="hero-grid absolute inset-0 -z-10 opacity-50" />
        <div className="absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-amber-500/20 blur-[90px]" />
        <div className="absolute -bottom-24 left-1/3 -z-10 size-64 rounded-full bg-sky-500/10 blur-[90px]" />

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
              Your workspace
            </p>
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Here is what is happening with your RentWorx account today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <Badge
                variant="accent"
                className="border-amber-400/30 bg-amber-400/15 text-amber-300"
              >
                {ROLE_LABEL[role] ?? role}
              </Badge>
              <p className="mt-2 text-xs text-slate-500">{today}</p>
            </div>
            <div className="grid size-12 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-amber-300 to-orange-500 font-heading text-sm font-bold text-[#251803] shadow-lg">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Profile"}
                  className="size-full object-cover"
                />
              ) : (
                initials(user?.name)
              )}
            </div>
          </div>
        </div>

        <nav
          aria-label="Dashboard sections"
          className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-5"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-10 space-y-10">{children}</div>
    </div>
  );
}
