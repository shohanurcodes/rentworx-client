import Link from "next/link";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="RentWorx home"
    >
      <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 text-[#251803] shadow-[0_8px_24px_-8px_rgba(245,158,11,0.9)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <span className="absolute inset-px rounded-[11px] ring-1 ring-white/30" />
        <Wrench className="relative size-5" strokeWidth={2.5} />
      </span>
      <span className="font-heading text-xl font-bold tracking-tight text-foreground">
        Rent<span className="amber-gradient-text">Worx</span>
      </span>
    </Link>
  );
}
