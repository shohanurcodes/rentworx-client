# RentWorx Client

Next.js App Router frontend for the RentWorx Equipment Rental Platform.

## Purpose

RentWorx lets equipment owners list equipment for rent and lets customers browse, reserve, pay for, and manage rentals through a secure marketplace with customer, owner, and admin dashboards.

## Live URL

<https://rentworx-client.vercel.app>

Repository: <https://github.com/shohanurcodes/rentworx-client>

## Key features

- Email/password registration and login with BetterAuth
- Google social login with default `customer` role
- JWT-backed session handling for the Express API
- Public home, all equipment, and equipment details pages
- Server-side search, filtering, sorting, and pagination
- Favorites saved in MongoDB
- Stripe Checkout booking flow
- Customer, owner, and admin dashboards with profile editing and reusable data tables
- 6-month analytics charts for platform revenue, bookings, and owner earnings
- Safe post-login redirects, cold-start API retry, and reload-friendly error pages
- Dark/light theme persisted with localStorage
- Responsive Shadcn UI with Framer Motion animations, four customer reviews, and a Why Choose Us section

## npm packages

- `next`, `react`, `react-dom`
- `better-auth`, `@better-auth/mongo-adapter`, `mongodb`
- `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`
- `framer-motion`, `lucide-react`, `next-themes`, `sonner`
- `react-hook-form`, `zod`, `axios`
- `recharts`
- `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`
- TypeScript and `@types/*`

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

```bash
npm run dev        # start development server
npm run build      # production build
npm run start      # serve production build
npm run typecheck  # TypeScript check
```

## Environment

See [`.env.example`](./.env.example). Only `NEXT_PUBLIC_*` values are exposed to the browser. MongoDB, Google OAuth, and BetterAuth secrets stay server-side.

## Deployment — Vercel

Import the repository into Vercel. `vercel.json` pins the Next.js framework and build command.

Production environment variables:

```text
MONGODB_URI=<Atlas connection string>
BETTER_AUTH_SECRET=<32+ byte random secret>
BETTER_AUTH_URL=https://rentworx-client.vercel.app
NEXT_PUBLIC_CLIENT_URL=https://rentworx-client.vercel.app
NEXT_PUBLIC_API_URL=https://rentworx-server.onrender.com/api
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<optional>
```

`NEXT_PUBLIC_API_URL` must include `/api` and must point to the deployed Render service. The server's `CLIENT_URL` and `AUTH_*` values must point back to this Vercel URL. Do not copy the `localhost` values from `.env.local` into Vercel; those are for local development only and will break JWT issuer/audience validation.

See also [API_CONTRACT.md](../API_CONTRACT.md).

## Design system — "Midnight Slate × Amber"

RentWorx ships with a reusable design system rather than one-off page styling. Every marketing page, catalog surface, and dashboard consumes the same tokens, primitives, and motion rules.

### Visual direction

A cinematic midnight-slate foundation with amber as the single accent color. The hero, auth panels, dashboard workspace header, owner CTA, and footer share the same dark language; body sections stay light and airy for contrast and readability.

### Tokens (`app/globals.css`)

- **Palette:** `--midnight` (`#0b1220`), slate foregrounds, and an amber ramp (`--accent` `#f59e0b`, hover `#fbbf24`). Semantic `--background`, `--card`, `--border`, `--primary`, and `--ring` tokens are defined for both light and dark themes.
- **Radii:** a shared `--radius` scale from `sm` through `3xl` so cards, buttons, and inputs agree.
- **Elevation:** `--ds-shadow-soft` for resting surfaces and `--ds-shadow-lift` for hover/hero states.
- **Rhythm:** 8px spacing grid, 16–24px radii, and reusable `.surface-card`, `.glass-panel`, `.hero-grid`, and `.amber-gradient-text` utility classes.

### Typography

`next/font` self-hosts **Sora** for display headings (`--font-heading`) and **DM Sans** for UI/body (`--font-sans`), with system fallbacks. Headings use tight tracking (`-0.025em`) and large type; body copy uses a 1.6–1.75 line height.

### Component inventory

| Primitive | Purpose |
| --- | --- |
| `Button`, `Input`, `Card`, `Badge` | Themed Shadcn primitives with new variants (`accent`, `success`, `warning`, `info`, `xl` button size) |
| `Skeleton`, `StatusBadge` | Consistent loading and booking/payment status treatment |
| `SectionHeading` | Repeated marketing section header with amber accent bar |
| `EquipmentCard` | Catalog/home listing card with hover zoom, rating chip, and condition badge |
| `DashboardShell` | One shared workspace header with role badge, avatar, greeting, and role-aware quick nav |
| `StatCard`, `AnalyticsChart`, `DataTable`, `ProfilePanel` | Shared dashboard KPI, chart, table, and profile surfaces |
| `Hero`, `TrustStrip`, `Categories`, `Reviews`, `OwnerCta`, `Footer` | Art-directed marketing sections |

### Motion & accessibility

- Framer Motion reveals are staggered, `once: true`, and asymmetrical (fade + lift + scale) so they feel intentional rather than decorative.
- `prefers-reduced-motion` collapses all animation and smooth scrolling to near-zero duration.
- Interactive targets are at least 44px where practical; focus rings use the amber `--ring` token with a background offset; status colors pair icons with text so they do not rely on color alone.

### Screenshot-ready pages

`/` (hero + featured + reviews), `/all-equipment`, `/equipment/[id]`, `/dashboard` (all three roles), `/login`, `/register`, and `/payment/success`.
