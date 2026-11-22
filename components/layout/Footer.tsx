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

const footerLink =
  "text-sm text-slate-400 transition-colors hover:text-amber-400";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-midnight text-white">
      <div className="hero-grid absolute inset-0 opacity-30" />
      <div className="absolute -right-24 top-0 size-72 rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              A transparent marketplace for renting verified equipment from
              trusted owners, with secure payments and flexible rental periods.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="RentWorx on X"
                className="grid size-10 place-items-center rounded-xl border border-white/15 text-slate-300 transition-colors hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400"
              >
                <XLogo />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Platform
            </h3>
            <ul className="mt-5 space-y-3">
              <li><Link className={footerLink} href="/">Home</Link></li>
              <li><Link className={footerLink} href="/all-equipment">All Equipment</Link></li>
              <li><Link className={footerLink} href="/#how-it-works">How It Works</Link></li>
              <li><Link className={footerLink} href="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Categories
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    className={footerLink}
                    href={`/all-equipment?category=${encodeURIComponent(category)}`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Stay connected
            </h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Questions about a listing? Reach the RentWorx team any time.
            </p>
            <a
              href="mailto:hello@rentworx.test"
              className="mt-3 inline-block text-sm font-semibold text-amber-400 hover:underline"
            >
              hello@rentworx.test
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RentWorx. All rights reserved.</p>
          <p>Built for owners, renters, and better workdays.</p>
        </div>
      </div>
    </footer>
  );
}
