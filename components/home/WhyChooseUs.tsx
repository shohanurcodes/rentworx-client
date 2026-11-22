import {
  BadgeDollarSign,
  Headset,
  LockKeyhole,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";

const reasons: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Verified equipment owners",
    description:
      "Every listing is reviewed before it goes live, so you know who you are renting from.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent pricing",
    description:
      "Daily, weekly, and monthly rates are shown up front with no surprise fees at checkout.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Stripe checkout",
    description:
      "Payments are processed by Stripe and your booking status updates as soon as payment clears.",
  },
  {
    icon: Headset,
    title: "Support from start to return",
    description:
      "Your rentals, favorites, and owner conversations stay organised in one dashboard.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Why choose us"
        title="A rental platform built around real work"
        description="Less time chasing quotes and payment links, more time getting the job done."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason, index) => (
          <div
            key={reason.title}
            className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40"
          >
            <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
            <div className="flex items-center justify-between">
              <div className="grid size-11 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <reason.icon className="size-5" />
              </div>
              <span className="font-heading text-xs font-bold tracking-[0.25em] text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 text-base font-bold text-foreground">
              {reason.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
