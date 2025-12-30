# F·S Tates — Curated clothing marketplace (full-stack MVP prototype)

A product + engineering prototype for a curated fashion marketplace: browse a catalog, filter/search products, manage a cart, and place orders — designed for a cross-border sourcing workflow.

**Status:** In progress. Demo is functional; some production features (payments, fulfillment, content ops) are intentionally not complete.

---

## Demo

- Frontend (Vercel): https://fstates.vercel.app/
- Backend API (Render): https://f-s-tates.onrender.com  
  Note: Render free instances can sleep; first request may be slow.

## Screenshots / Video

> Add screenshots to `docs/screenshots/` and link them here.
- `docs/screenshots/home.png` (TBD)
- `docs/screenshots/category.png` (TBD)
- `docs/screenshots/product.png` (TBD)
- `docs/screenshots/cart-checkout.png` (TBD)

---

## Features

- Curated catalog UI with categories and product detail pages
- Search + filters (query, brand, price range) backed by API
- Authentication flow (register / login) with protected routes
- Cart operations (add/update/remove items)
- Checkout flow that captures shipping details and payment method selection (no real payment processing)
- Orders: create orders and view order history
- Admin routes for product/inventory/user management (foundation for internal ops)
- Analytics endpoints for basic reporting (foundation for dashboards)
- Chat endpoints (foundation for a concierge/agent experience)
- PostgreSQL data model via Prisma (users, products, inventory, cart, orders, messages, events)

---

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Framer Motion
- Font Awesome

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT auth + bcrypt password hashing
- Zod validation
- CORS + cookie parsing

**Hosting**
- Vercel (frontend)
- Render (backend)

---

## How It Works (high level)

1. The React SPA (Vercel) renders catalog, product, cart, and account views.
2. The SPA calls the Express API (Render) for auth, products, cart, and orders.
3. The API uses Prisma to read/write PostgreSQL records (catalog, inventory, carts, orders, messages).
4. Auth uses JWTs (cookie/session style) and protects cart/order/admin routes.
5. Search and filtering are performed server-side and returned as JSON to the UI.

---

## Evidence / Results

- Public demo deployed on Vercel: https://fstates.vercel.app/
- Backend API deployed on Render: https://f-s-tates.onrender.com
- Database schema includes **15 Prisma models** (User, Product, Inventory, Cart, Order, Message, etc.) in `backend/prisma/schema.prisma`.
- API includes real filtering logic for products (query, brand, price range) in backend controllers.

**TBD metrics to collect (recommended before applications)**
- Lighthouse scores (Performance/Accessibility/Best Practices/SEO)
- API response time (p50/p95) for `/products` and `/orders`
- Error rate and cold-start impact (Render sleep/wake)
- Basic test coverage (unit/integration)

---

## My Role & Contributions

**Role:** Product owner + full-stack builder (solo engineering; business workflow informed by cross-border sourcing constraints).

**What I built**
- Defined the product scope: curated marketplace focused on clothing
- Implemented the frontend SPA (routing, pages, UI, API wiring)
- Designed the database schema in Prisma and implemented core API routes:
  - auth, products/categories, cart, orders, inventory, admin, analytics, chat
- Set up deployments (frontend on Vercel; backend on Render)

---

## Roadmap

- Connect “concierge” experience to AI agents for product discovery and customer support
- Add real payment processing (provider TBD) and order state machine (paid → packed → shipped → delivered)
- Add upload/moderation pipeline for product media + content ops tooling
- Harden security: rate limiting, stricter CORS, audit logs, admin RBAC
- Add automated tests (API integration + frontend smoke tests) and CI
- Improve internationalization (currency/locale) and shipping rules

---

## License

License is currently **not specified**. If you plan to open-source or accept external contributions, add a license file (e.g., MIT).

---

## Contact

Feruzbek Qurbonov  
GitHub: https://github.com/Realferuzbek
