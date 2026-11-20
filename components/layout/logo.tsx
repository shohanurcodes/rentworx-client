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
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <Wrench className="size-5" strokeWidth={2.4} />
      </span>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Rent<span className="text-primary">Worx</span>
      </span>
    </Link>
  );
}
