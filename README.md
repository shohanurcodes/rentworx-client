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
