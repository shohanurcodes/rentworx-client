import { BadgeCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
      <div className="hidden lg:block">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-midnight p-10 text-white shadow-[var(--ds-shadow-lift)]">
          <div className="hero-grid absolute inset-0 -z-10 opacity-50" />
          <div className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-amber-500/20 blur-[100px]" />
          <div className="absolute -bottom-24 -left-16 -z-10 size-72 rounded-full bg-sky-500/10 blur-[100px]" />

          <div className="relative">
            <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-[#251803] shadow-lg ring-1 ring-white/20">
              <Wrench className="size-6" />
            </div>
            <h2 className="mt-8 font-heading text-4xl font-bold leading-tight tracking-tight">
              The right equipment,
              <br />
              <span className="amber-gradient-text">right when you need it.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              Join RentWorx to browse verified listings, book securely, and
              manage every rental from one clean workspace.
            </p>

            <div className="mt-10 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <BadgeCheck className="size-5 text-amber-400" />
                <span className="text-sm font-medium">Verified equipment owners</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <ShieldCheck className="size-5 text-amber-400" />
                <span className="text-sm font-medium">Secure Stripe checkout</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <Sparkles className="size-5 text-amber-400" />
                <span className="text-sm font-medium">One workspace for every rental</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <span className="mb-4 block h-1 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
            RentWorx account
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
