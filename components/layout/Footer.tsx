import Link from "next/link";

import { Logo } from "@/components/layout/logo";

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L3.998 22.25H.688l7.73-8.836L.188 2.25h6.828l4.713 6.231 6.515-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            A transparent marketplace for renting verified equipment from
            trusted owners, with secure payments and flexible rental periods.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Platform
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" href="/">Home</Link></li>
            <li><Link className="hover:text-primary" href="/all-equipment">All Equipment</Link></li>
            <li><Link className="hover:text-primary" href="/#how-it-works">How It Works</Link></li>
            <li><Link className="hover:text-primary" href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Categories
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  className="hover:text-primary"
                  href={`/all-equipment?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Stay connected
          </h3>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Questions about a listing? Reach the RentWorx team any time.
          </p>
          <a
            href="mailto:hello@rentworx.test"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            hello@rentworx.test
          </a>
          <div className="mt-5 flex gap-2">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="RentWorx on X"
              className="grid size-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <XLogo />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} RentWorx. All rights reserved.</p>
          <p>Built for owners, renters, and better workdays.</p>
        </div>
      </div>
    </footer>
  );
}
