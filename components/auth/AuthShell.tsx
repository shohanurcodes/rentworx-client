import { BadgeCheck, ShieldCheck, Wrench } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 text-white shadow-xl">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Wrench className="size-6 text-accent" />
            </div>
            <h2 className="mt-8 text-4xl font-bold leading-tight tracking-tight">
              The right equipment, right when you need it.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              Join RentWorx to browse verified listings, book securely, and
              manage every rental from one clean workspace.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <BadgeCheck className="size-5 text-accent" />
                <span className="text-sm font-medium">Verified equipment owners</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <ShieldCheck className="size-5 text-accent" />
                <span className="text-sm font-medium">Secure Stripe checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            RentWorx account
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
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
