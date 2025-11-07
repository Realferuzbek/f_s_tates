# F-S Tates Marketplace

A full-stack fashion marketplace inspired by elevated online destinations. The experience combines a modern React frontend with an Express + Prisma backend to deliver immersive lookbooks, rich product storytelling, size/colour aware carts, and a curated shopping flow that feels at home beside premium platforms such as Uzum Market, Alibaba, and Temu.

## Tech stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS with custom gradients and editorial UI patterns
- **Backend:** Node.js, Express, Prisma ORM, JSON Web Tokens
- **Database:** PostgreSQL (development seed + fashion-focused schema)

## Feature highlights

- Editorial home with featured hero drop, capsule edits, and horizontal product spotlights.
- Dynamic catalogue filtering across category, audience, brand, colour palettes, size sets, highlights, and price.
- Detailed product pages with rich galleries, material breakouts, care notes, and required size/colour selection.
- Cart, checkout, and order history now track selected variants so fulfilment always reflects guest choices.
- Admin dashboard surfaces audience targeting and highlight badges alongside key revenue metrics.
- Custom lightning badge (`frontend/public/brand-icon.svg`) keeps the storefront and browser chrome on-brand across navigation, hero moments, and metadata.

## Project structure

```
frontend/   # React single-page application powered by Vite and Tailwind
backend/    # Express API with Prisma models, authentication, and business logic
```

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 13+ (or a compatible managed instance)

### 1. Clone and install dependencies

```bash
npm install --prefix frontend
npm install --prefix backend
```

### 2. Configure environment variables

1. Copy the sample backend environment file and update the values:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Ensure the `DATABASE_URL` points to a reachable PostgreSQL instance and the `JWT_SECRET` is a strong random value.

### 3. Apply migrations and seed sample data

This release expands the Prisma schema with fashion-specific fields (audience, colour and size options, hero imagery, product badges, and cart/order variant tracking). Apply the migration before seeding:

```bash
npm run prisma:migrate --prefix backend
npm run prisma:seed --prefix backend
```

The seed script provisions:
- An administrator account `admin@fstates.dev` / `password123`
- A sample customer `customer@fstates.dev` / `password123`
- Womenswear, menswear, kids, footwear, and accessories categories stocked with limited-run garments
- Rich product metadata including colour palettes, size ladders, materials, and editorial badges used across the UI

### 4. Start the development servers

Run the API and frontend in separate terminals:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

The Vite dev server proxies `/api` requests to the Express API on port `4000` by default.

### 5. Build for production

```bash
npm run build --prefix frontend
```

Package the backend for deployment by installing dependencies with `npm install --production --prefix backend` and starting with `npm start --prefix backend`.

## API overview

| Endpoint | Description |
| --- | --- |
| `POST /api/auth/register` | Create a new customer account |
| `POST /api/auth/login` | Authenticate and receive a JWT |
| `GET /api/products` | Browse products with full-text, category, audience, brand, colour (`colors`), size (`sizes`), badge, price, and sort filters |
| `GET /api/products/curated` | Fetch hero, new arrivals, capsule edit, and statement piece groupings for the home experience |
| `GET /api/products/:id` | Fetch detailed product information including gallery, materials, care, and variant options |
| `GET/PUT /api/cart` | Retrieve or replace the authenticated user’s cart (now variant-aware) |
| `POST /api/orders/checkout` | Place an order from the current cart, persisting selected size/colour variants |
| `GET /api/orders` | View authenticated order history with variant details |
| `GET /api/admin/metrics` | Admin-only dashboard metrics and catalog snapshot |

All authenticated routes require an `Authorization: Bearer <token>` header using the JWT returned from the login endpoint.

## SEO & Indexing

- `frontend/public/robots.txt` and `frontend/public/sitemap.xml` are generated at build time by `node frontend/scripts/build-seo.mjs`. Run `npm run sitemap --prefix frontend` locally whenever routes change, or rely on the `postbuild` hook that Vercel executes automatically.
- Set `VITE_SITE_URL` (and optionally `VITE_API_BASE_URL` so product detail URLs are fetched from your backend) in the Vercel environment. The script uses these values to form absolute `<loc>` URLs and to link to `Sitemap: https://your-domain/sitemap.xml`.
- The reusable `<Seo />` component at `frontend/src/components/Seo.jsx` centralizes default `<title>`, description, robots, canonical, Open Graph, and Twitter tags. It consumes `VITE_SITE_URL` for canonical links and social preview URLs.
- Each page already inherits `<Seo />` via `Layout`. To override metadata per route, import `Seo` directly in that page and render it with custom props (e.g., `<Seo title="New Drop" description="..." image="/social/new-drop.jpg" />`).

## Accessibility and UX notes

- Semantic HTML landmarks, focus-visible styles, and aria labels ensure the UI is screen reader friendly.
- The Tailwind-based design system provides consistent spacing, typography, and responsive breakpoints down to small screens.
- Form elements leverage `@tailwindcss/forms` for improved keyboard and assistive technology support.

## Deployment notes

- Configure environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`) on the target platform.
- Run `npm run prisma:generate --prefix backend` during your build step to ensure Prisma client is compiled.
- Serve the frontend static build (`frontend/dist`) via your preferred CDN or static host and proxy API requests to the Express server.
- When deploying to Vercel, include the provided `vercel.json` and root `package.json`. They instruct Vercel to install from `frontend/`, emit the Vite build into `frontend/dist`, and serve it as a single-page app by first checking for static assets (via `{"handle":"filesystem"}`) and then falling back to `index.html`. Set `VITE_API_BASE_URL` in your Vercel environment variables so the client knows where to reach the running backend (e.g., `https://your-backend-host.com/api`).
- For Render (or any Node host running the backend directly), just point the service root to `backend/`, keep the build command as `npm install`, and leave the start command as `npm start`. The backend `postinstall` hook now calls `npm run prisma:generate` and the Prisma CLI ships in production dependencies, so the generated client exists before the server boots.

## Further improvements

- Layer in live inventory feeds and atelier availability to keep quantities up to the minute.
- Integrate payment gateways and transactional communications for production readiness.
- Expand the admin studio with product creation, curation tools, and editorial scheduling.
