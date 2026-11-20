export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm sm:p-14">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">
          RentWorx
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Equipment rental, built for work.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          The foundation is ready. Next we will add authentication, the public
          marketplace, Stripe checkout, and role-based dashboards.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Client scaffold ready
          </span>
          <span className="rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground">
            TypeScript + Shadcn UI
          </span>
        </div>
      </section>
    </main>
  );
}
