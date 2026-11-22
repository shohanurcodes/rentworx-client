import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <span className="mb-4 block h-1 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
