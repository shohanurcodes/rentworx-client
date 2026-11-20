import Link from "next/link";
import { ArrowRight, CircleDollarSign, ClipboardCheck, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: CircleDollarSign,
    label: "Earn from idle equipment",
  },
  {
    icon: ClipboardCheck,
    label: "Approved listing workflow",
  },
  {
    icon: Wrench,
    label: "Simple rental management",
  },
];

export function OwnerCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-xl sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
              For equipment owners
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Put your idle equipment to work
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              List your machinery, cameras, vehicles, or event gear and reach
              renters who are ready to book. You stay in control of pricing,
              availability, and rental terms.
            </p>
            <Button asChild variant="accent" className="mt-8">
              <Link href="/register">
                Start listing equipment
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.label}
                className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-accent">
                  <benefit.icon className="size-5" />
                </div>
                <span className="text-sm font-medium">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
