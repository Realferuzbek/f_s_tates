# F-S Tates Marketplace

A full-stack **fashion marketplace prototype** built as:
- a **Vite + React** storefront (client),
- a **Node.js + Express + Prisma** API (server),
- and a **Postgres** database.

Live demo: https://fstates.vercel.app

> Transparency: this repo is a **prototype**. It includes seeded demo data for local development, but demo credentials are intentionally not documented here.

---

## What this repo contains (code-backed)

### Customer storefront (React)
- Product discovery (list + search + filters)
- Category landing pages (`/category/:slug`)
- Product details (`/products/:productId`)
- Cart + checkout flow
- Account pages + orders history (authenticated)
- Multi-language UI (translations present for **EN / RU / UZ**)

### Admin surface (React)
- Admin dashboard route: `/admin` (guarded by role: `ADMIN`)
- Admin metrics + low-inventory visibility (driven by backend `/api/admin/metrics`)
- Admin support messaging (backend admin chat endpoints)

### Backend API (Express + Prisma)
- JWT auth (Bearer token)
- Products + categories + curated products endpoints
- Cart persistence + checkout creating orders
- Account management:
  - addresses
  - payment methods (stored records; no gateway integration in code)
  - preferences
  - password change
- Chat system:
  - user support threads
  - admin thread list + admin replies
  - order-linked conversations bootstrapped during checkout
- Analytics/event tracking endpoint (`/api/track`) storing events in DB

---

## Tech stack

**Frontend**
- React 18, Vite, React Router
- axios API client
- react-helmet-async for SEO/meta
- TailwindCSS + Headless UI + Heroicons
- react-hook-form

**Backend**
- Node.js (ESM), Express
- Prisma ORM + Postgres
- JWT auth (`Authorization: Bearer <token>`)
- zod validation
- bcrypt password hashing

---

## Local development

### 0) Prerequisites
- Postgres running locally (or a hosted Postgres URL)
- Node.js + npm

---

### 1) Backend (API) — runs on port **4000**
```bash
cd backend
npm install

# Configure env
cp .env.example .env
# Edit DATABASE_URL + JWT_SECRET (and optionally PORT)

# Generate Prisma client
npm run prisma:generate

# Sync schema to database (no migrations folder included in this repo)
npm run db:push

# Seed demo data (creates demo users/products/categories)
npm run seed

# Start dev server
npm run dev
```

Backend base URL:
- `http://localhost:4000`
- API prefix: `http://localhost:4000/api`

---

### 2) Frontend (Web) — runs on port **5173**
```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

Dev proxy (code-backed):
- Frontend proxies `/api/*` → `http://localhost:4000/api/*` via `vite.config.js`

---

## Configuration

### Backend environment variables (exactly from `backend/.env.example`)
- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET` (used to sign/verify JWTs)
- `PORT` (defaults to 4000)

### Frontend build/runtime variables (used in code)
These are optional and environment-specific:

- `VITE_API_BASE_URL`
  - Used as the API base URL in `src/utils/apiClient.js`
  - If not set, frontend defaults to `/api` (works with the dev proxy)

- `VITE_SITE_URL`
  - Used for canonical URLs/SEO generation
  - Falls back to `https://fstates.vercel.app` if not set

Runtime override option:
- `window.__APP_API_BASE_URL` (if injected before app init, it overrides API base URL)

---

## API overview (routes present in code)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/curated`
- `GET /api/products/categories`
- `GET /api/products/:productId`

### Cart + Orders
- `GET  /api/cart`
- `PUT  /api/cart`
- `GET  /api/orders`
- `POST /api/orders/checkout`

### Account
- `GET    /api/account/me`
- `PUT    /api/account/me`
- `GET    /api/account/orders`
- `GET    /api/account/orders/:id`
- `GET    /api/account/addresses`
- `POST   /api/account/addresses`
- `PUT    /api/account/addresses/:id`
- `DELETE /api/account/addresses/:id`
- `GET    /api/account/payment-methods`
- `POST   /api/account/payment-methods`
- `DELETE /api/account/payment-methods/:id`
- `GET    /api/account/preferences`
- `PUT    /api/account/preferences`
- `POST   /api/account/change-password`

### Chat (customer + admin)
Customer:
- `GET  /api/chat/threads`
- `GET  /api/chat/threads/:id`
- `POST /api/chat/threads/:id/messages`
- `POST /api/chat/threads/:id/read`

Admin:
- `GET  /api/admin/chat/threads`
- `POST /api/admin/chat/threads/:id/messages`
- `POST /api/admin/chat/threads/:id/read`

### Admin metrics
- `GET /api/admin/metrics`

### Analytics
- `POST /api/track`

---

## Database schema (Prisma models present in code)

Core commerce:
- `User`, `Category`, `Product`, `Inventory`
- `Cart`, `CartItem`
- `Order`, `OrderItem`
- `Address`, `PaymentInstrument`

Experience:
- `NotificationPreference`, `ProfileSetting`
- `Conversation`, `Message` (support + order-linked messages)
- `Event` (analytics tracking)

Enums present in schema:
- Roles (`CUSTOMER`, `ADMIN`)
- Order statuses, payment method types, chat sender types, message kinds, audience

---

## SEO + sitemap generation (frontend build step)

Frontend build runs a SEO generator:
- `npm run build` triggers `postbuild` → `node ./scripts/build-seo.mjs`
- Generates:
  - `public/sitemap.xml` and `public/robots.txt`
  - also writes to `dist/` when present

Dynamic product routes in the sitemap:
- If `VITE_API_BASE_URL` is set during build, the script attempts to fetch products from `${VITE_API_BASE_URL}/products` and adds `/products/:id` routes.
- If not reachable, it safely skips dynamic product routes.

Robots rules (code-backed):
- Disallows indexing `/admin`, `/account`, `/account/orders`, `/checkout`

---

## My role & contributions

I owned the product direction and system integration:
- defined the marketplace scope and UX flows (storefront → cart → checkout → account)
- connected a React storefront to a Prisma-backed API design (auth, cart, orders, admin)
- added admin operations (metrics + support messaging) and event tracking
- handled environment/deployment setup and iterative debugging

Implementation was accelerated with AI-assisted development tools; I owned the architecture decisions, integration work, and shipping.

---

## License

No explicit license file is included in this repo. Add one if you want reuse permissions to be explicit.
