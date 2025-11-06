# F-S Tates Marketplace

A full-stack ecommerce marketplace demo featuring a modern React frontend and a secure Express + Prisma backend. The project demonstrates catalog browsing with advanced filters, product detail views, cart and checkout workflows, user accounts, and an admin overview backed by a PostgreSQL database.

## Tech stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Headless UI
- **Backend:** Node.js, Express, Prisma ORM, JSON Web Tokens
- **Database:** PostgreSQL (development seed scripts included via Prisma)

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

```bash
npm run prisma:migrate --prefix backend
npm run prisma:seed --prefix backend
```

The seed script provisions:
- An administrator account `admin@fstates.dev` / `password123`
- A sample customer `customer@fstates.dev` / `password123`
- Categories, products, and inventory data used across the UI

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
| `GET /api/products` | Browse products with search, category, price, and sort filters |
| `GET /api/products/:id` | Fetch detailed product information |
| `GET/PUT /api/cart` | Retrieve or replace the authenticated user’s cart |
| `POST /api/orders/checkout` | Place an order from the current cart |
| `GET /api/orders` | View authenticated order history |
| `GET /api/admin/metrics` | Admin-only dashboard metrics and catalog snapshot |

All authenticated routes require an `Authorization: Bearer <token>` header using the JWT returned from the login endpoint.

## Accessibility and UX notes

- Semantic HTML landmarks, focus-visible styles, and aria labels ensure the UI is screen reader friendly.
- The Tailwind-based design system provides consistent spacing, typography, and responsive breakpoints down to small screens.
- Form elements leverage `@tailwindcss/forms` for improved keyboard and assistive technology support.

## Deployment notes

- Configure environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`) on the target platform.
- Run `npm run prisma:generate --prefix backend` during your build step to ensure Prisma client is compiled.
- Serve the frontend static build (`frontend/dist`) via your preferred CDN or static host and proxy API requests to the Express server.

## Further improvements

- Integrate payment providers and transactional email services.
- Add guest checkout and saved payment methods.
- Expand the admin area with product creation/editing flows and analytics.
