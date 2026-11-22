"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/all-equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How It Works" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  function isActive(href: string) {
    if (href.includes("#")) {
      return pathname === "/" && hash === href.slice(href.indexOf("#"));
    }
    if (href === "/") return pathname === "/" && !hash;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast.success("You have been logged out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-9 w-40 animate-pulse rounded-xl bg-secondary" />
          ) : user ? (
            <>
              {user.role !== "customer" && (
                <Badge variant="warning" className="hidden capitalize sm:inline-flex">
                  {user.role}
                </Badge>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" variant="accent">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-3 h-px bg-border" />

            {!isLoading && user ? (
              <>
                {user.role !== "customer" && (
                  <Badge variant="warning" className="w-fit capitalize">
                    {user.role}
                  </Badge>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="mt-1"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut />
                  Logout
                </Button>
              </>
            ) : !isLoading ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="accent" className="mt-2">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
