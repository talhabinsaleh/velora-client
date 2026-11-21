# Velora — Salon & Spa Appointment Booking (Client)

Velora is a salon appointment booking platform. Customers explore salon services, request an appointment for a date and time slot, follow its status and pay for confirmed appointments with Stripe. The salon admin manages services, reviews and confirms requests, manages customers and monitors payments.

This repository is the **Next.js client**. The REST API lives in [velora-server](https://github.com/talhabinsaleh/velora-server).

- **Live website:** https://velora-talha.vercel.app
- **Client repository:** https://github.com/talhabinsaleh/velora-client
- **Server repository:** https://github.com/talhabinsaleh/velora-server

## Important Features

**Customers**
- Browse active services, search by name, filter by category and sort by price (or newest / duration), all synced to the URL
- Protected service details page (`/services/[id]`) with a 14-day date strip, live time-slot availability and an optional message
- Appointment requests are saved as *Pending / Unpaid*. Double bookings of the same slot are blocked on the server
- Customer dashboard: overview stats (total, pending, confirmed, cancelled), My Appointments, Payment History and My Profile
- Cancel own pending requests; **Pay Now** for confirmed appointments through Stripe Checkout
- Payment success page waits for the verified Stripe webhook before showing the confirmation; a cancel page explains nothing was charged

**Admin**
- Overview: registered customers, active services, total / pending / confirmed requests, successful payments, revenue, a 14-day request chart and requests by category
- Manage Services: search, filter, sort, activate / deactivate switch, edit and delete (with confirmation)
- Add / Update Service form with ImgBB **image upload** (not a URL), price and duration validation, Active by default
- Manage Appointments: filter by status and payment, search by customer or service, view details, confirm pending, cancel pending or confirmed
- Manage Users: view customer details and history, block and unblock (blocked users are signed out immediately)
- Transactions: read-only Stripe payment records with session reference, amount, currency and status

**Website**
- Home: full-screen hero slideshow with a live "Popular right now" card, service search, six featured services, an interactive category accordion, How It Works, the salon promise and visit details
- Browse Services, About (story, values, gallery, booking steps) and Contact (contact cards, map, message form, FAQ) pages
- Clean category links such as `/services?category=haircut-styling`
- Navbar floats as a glass pill over photo banners and turns into a full-width bar on scroll; every new page opens at the top

**Platform**
- Better Auth: email + password (min 6 chars, one uppercase, one lowercase) and Google sign-in, optional profile image (upload or URL)
- Admins can never be created through sign-up (`role` and `isBlocked` are server-only fields)
- A signed JWT in an HTTP-only cookie is verified by Express middleware on every protected API, together with the user's role
- Dashboards are separated by role on the server; opening another role's URL shows a 403 page
- Navbar updates instantly when you sign in or out
- Meaningful loaders and skeletons, toast notifications (no `alert()`), friendly 404 / error pages, confirmation dialogs and status badges
- Fully responsive (mobile menu, mobile appointment cards, scrollable tables)

## Technology Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Better Auth (MongoDB adapter) · jose (JWT) · Sonner (toasts) · Lucide icons · Stripe Checkout (through the API) · ImgBB (through the API) · Vercel

## Installation

```bash
git clone https://github.com/talhabinsaleh/velora-client.git
cd velora-client
npm install
cp .env.example .env.local   # then fill in the values
```

## How to Run the Project Locally

1. Start the API first (see the [server README](https://github.com/talhabinsaleh/velora-server)). It runs on `http://localhost:5000`.
2. Start the website:

```bash
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`.

All browser requests go to this site's own `/api` path. Next.js handles `/api/auth/*` (Better Auth) and `/api/session-token`, and forwards every other `/api/*` request to the Express API. Cookies therefore stay first-party and there are no CORS issues in production.

## Required Environment Variables

Names only, never commit real values:

```
API_URL
MONGODB_URI
DB_NAME
BETTER_AUTH_URL
BETTER_AUTH_SECRET
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

`JWT_SECRET` must be the same value as on the server. The Google OAuth redirect URI is `<BETTER_AUTH_URL>/api/auth/callback/google`.

## Project Structure

```
app/
  (site)/            public website: home, services, about, contact, sign in/up, payment pages
  dashboard/         role-based dashboards (customer/*, admin/*)
  api/auth/          Better Auth handler
  api/session-token/ issues the JWT the API verifies
components/          UI building blocks, home sections, dashboard pieces
lib/                 auth, API client, types, constants, helpers
proxy.ts             redirects signed-out visitors away from private pages
```

## Credits

Photography from [Unsplash](https://unsplash.com) (free license).
