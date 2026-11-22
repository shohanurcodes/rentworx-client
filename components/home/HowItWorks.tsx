import { CreditCard, RotateCcw, Search } from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";

const steps = [
  {
    icon: Search,
    title: "Browse & compare",
    description:
      "Search by category, location, price, and rental type. Review condition, terms, and owner ratings before you choose.",
  },
  {
    icon: CreditCard,
    title: "Book securely",
    description:
      "Reserve available equipment and complete checkout through Stripe. Your booking and payment status stay visible in one place.",
  },
  {
    icon: RotateCcw,
    title: "Use, return & review",
    description:
      "Coordinate handover with the owner, return the gear on time, and leave a review to help the next renter.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="How it works"
        title="Three simple steps from search to site"
        description="RentWorx keeps the whole rental lifecycle clear, from the first quote to the final review."
      />

      <div className="relative mt-12 grid gap-8 md:grid-cols-3">
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent md:block" />

        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            <div className="relative z-10 grid size-12 place-items-center rounded-2xl border border-amber-500/30 bg-card text-amber-600 shadow-[0_10px_24px_-12px_rgba(245,158,11,0.7)] dark:text-amber-400">
              <step.icon className="size-5" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
