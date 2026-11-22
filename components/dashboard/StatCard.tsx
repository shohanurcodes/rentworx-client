import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40">
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-heading text-3xl font-bold tracking-tight">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600 transition-transform duration-300 group-hover:scale-110 dark:text-amber-400">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
