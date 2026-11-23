# RentDock — Equipment Rental Platform

Rent the equipment you need for the time you need it. RentDock connects customers and equipment owners across Bangladesh, with date-based bookings, Stripe test payments and separate Customer, Owner and Admin workspaces.

**[Live website](https://rentdock-client.vercel.app)** · **[Server repository](https://github.com/rafidhasansydney/rentdock-server)** · **[API health](https://rentdock-server.vercel.app/api/health)**

## What you can do

| Area | Features |
| --- | --- |
| Discover | Six equipment categories, six database-backed featured listings, recently added equipment, project collections, rental guides and four illustrative customer stories with ratings |
| Search | Server-side name/location search, category and rental-period filters, price range, availability, price sorting, newest-first sorting and pagination |
| Account | Email/password registration and login, Google login, success/error feedback, editable profile and gallery image uploads through imgbb |
| Customer | Private equipment details, persistent favorites, rental quotes, hosted Stripe Checkout, payment confirmation, rental history and recovery of unfinished checkouts |
| Owner | Submit equipment with images, prices, quantity and terms; update, preview and delete owned listings; track equipment rentals and monthly earnings |
| Admin | Manage user roles and suspension, approve/reject/edit/archive equipment, monitor rentals, record handovers and internal notes, and view platform analytics |

The interface uses a blue/navy palette, local Geist font files, responsive layouts and Framer Motion interactions in the banner, categories and featured equipment. Loading, retry, error and not-found states are included. Monthly charts also have readable data tables.

## Technology and packages

| Package | Use |
| --- | --- |
| Next.js 16.4.5 | App Router, layouts, routing, production builds and same-origin API rewrites |
| React / React DOM 19.3.0 | Components, forms and account state |
| TypeScript 5.9.3 | Typed components, forms and API results |
| Better Auth 1.7.27 | Session client, Google/email authentication and JWT client plugin |
| Framer Motion 14.9.0 | Equipment transitions, hover feedback and reduced-motion-aware animation |
| `@radix-ui/react-slot` | Composable `asChild` controls in the shadcn/ui-style source components |
| `class-variance-authority` | Shared button variants |
| `clsx`, `tailwind-merge` | Component class-name utilities |
| ESLint, `eslint-config-next` | Source checks |
| `@types/node`, `@types/react`, `@types/react-dom` | Development types |

Shared UI components live in `src/components/ui`. Their styling is customized in `src/app/globals.css`.

## Run locally

Use **Node.js 22.x** and npm. Run the [Express server](https://github.com/rafidhasansydney/rentdock-server) alongside this client.

```bash
git clone https://github.com/rafidhasansydney/rentdock-client.git
cd rentdock-client
npm ci
```

Create `.env.local` from `.env.example` and set the local API origin:

```dotenv
API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

```bash
npm run dev
```

Open **http://127.0.0.1:3000**. Use the same hostname consistently during authentication. In Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Application routes

| Route | Access |
| --- | --- |
| `/`, `/equipment`, `/owners` | Public homepage, equipment catalog and owner guide |
| `/login`, `/register` | Authentication |
| `/equipment/[id]` | Signed-in equipment details |
| `/dashboard`, `/dashboard/profile` | Signed-in account overview and profile |
| `/dashboard/rentals`, `/dashboard/favorites`, `/dashboard/payment` | Customer rentals, saved equipment and checkout status |
| `/dashboard/owner` | Owner listing and earnings analytics |
| `/dashboard/owner/equipment`, `/dashboard/owner/equipment/new` | Owner equipment management and submission |
| `/dashboard/owner/equipment/[id]`, `/dashboard/owner/equipment/[id]/edit` | Owned listing preview and editor |
| `/dashboard/owner/rentals` | Rentals of the current Owner's equipment |
| `/dashboard/admin` | Platform analytics |
| `/dashboard/admin/users`, `/dashboard/admin/equipment`, `/dashboard/admin/rentals` | Admin management |

New registrations, including Google registrations, receive the **Customer** role. Admins grant Owner/Admin access. Private screens wait for the session check before redirecting, and the server independently verifies the session, JWT and current role.

## Rental and payment rules

- Currency is **BDT**. Start and end dates are inclusive; the same day is one rental day.
- Daily billing uses the number of days. Weekly and Monthly billing round up to complete 7-day and 30-day blocks respectively.
- The server calculates prices and checks date-overlapping quantities. Browser totals cannot override the charged amount.
- Stripe Checkout runs in **test mode**. Use `4242 4242 4242 4242`, a future expiry and any three-digit CVC. Do not enter a real card.
- A verified successful payment creates the booking and transaction records. Returning from Checkout alone is not proof of payment.
- Interrupted checkouts can be resumed or cancelled from My rentals. Cancellation verifies the provider state before releasing stock.

Illustrative sample listings and clearly labelled demonstration equipment are provided for exploring the assignment. Demo rentals do not supply physical equipment. The four homepage stories are illustrative rather than collected customer testimonials.

## Production configuration

Set `API_URL` in the client Vercel project to the deployed server origin:

```dotenv
API_URL=https://rentdock-server.vercel.app
NEXT_PUBLIC_APP_URL=https://rentdock-client.vercel.app
```

The client forwards `/api/*` requests to Express. Authentication cookies and browser API calls therefore use the website origin. MongoDB credentials, the Better Auth secret, the Google client secret, imgbb key and Stripe secrets belong only in the **server** environment.

Production builds reject a missing/localhost API origin on Vercel. The `main` branch is connected to Vercel for automatic deployment.

## Checks

```bash
npm run check
npm run build
npm run start
```

`check` runs TypeScript and ESLint. `build` creates the production application; `start` serves that build locally.

For an end-to-end review, sign in as each role, refresh private routes, check favorites and profiles, submit/review equipment, and finish a Stripe test rental. Backend verification scripts and webhook setup are documented in the server repository.

Admin submission credentials should be provided privately in the submission form, not committed to either repository.
