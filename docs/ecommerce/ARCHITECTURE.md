# Erilson Digital - Ecommerce Architecture (Phase 0)

## System Diagnosis (current)
- Framework: Next.js 15 (App Router) with React 18 + TypeScript.
- API: `app/api/*` route handlers returning `NextResponse.json`.
- Auth: Admin session cookie `admin_session` with server-side lookup in `admin_sessions` table. Helper: `lib/adminAuth.ts`.
- DB Access: `pg` pool via `lib/db.ts` (single pool, direct SQL).
- Admin UI: single-page `app/admin/page.tsx` with view switching and components in `components/admin/*`.
- UI/Styles: Tailwind in `app/globals.css` and component classnames.
- Existing patterns: JSON parsing with explicit `try/catch`, rate-limit for login, reCAPTCHA v3 verification on key endpoints.

## Ecommerce Domain (text diagram)
- Catalog
  - products -> product_variants -> product_media
  - categories -> product_categories (many-to-many)
- Inventory
  - inventory_items -> inventory_levels (per location)
  - inventory_movements (audit trail)
- Cart / Checkout
  - carts -> cart_items
  - checkout_sessions (expires, shipping, tax)
- Orders (OMS)
  - orders -> order_items -> order_addresses
  - order_status_history
  - fulfillments, refunds, returns
- Payments
  - payments -> payment_events (idempotent via unique provider_event_id)
- Promotions
  - coupons, coupon_redemptions
  - promotions (rules JSON)
- Admin Audit
  - audit_logs

## Checkout + Payment Sequence (high level)
1. Cart created (guest or user), server recalculates totals.
2. Checkout session created with email + addresses + shipping + tax snapshot.
3. Stock reservation (TTL) created during checkout start.
4. Payment provider checkout created with idempotency key.
5. Webhook confirms payment -> order marked paid + reservation consumed.
6. If payment fails/timeout -> reservation released by job.

## Migration + Feature Flags
- Feature flags:
  - `ECOMMERCE_ENABLED=true` (storefront + API)
  - `ECOMMERCE_ADMIN_ENABLED=true` (admin screens + admin APIs)
- Strategy:
  - New ecommerce tables (isolated).
  - No breaking changes to existing routes.
  - Storefront routes mounted under `app/(store)` and admin tabs in `app/admin/page.tsx`.
  - Use flags to gate new routes/views.

## Endpoints (planned)
- Storefront API
  - `/api/ecommerce/products`, `/api/ecommerce/products/[slug]`
  - `/api/ecommerce/cart`, `/api/ecommerce/cart/items`
  - `/api/ecommerce/checkout/*`
  - `/api/ecommerce/orders/*`
- Admin API
  - `/api/admin/ecommerce/products`, `/api/admin/ecommerce/inventory`
  - `/api/admin/ecommerce/orders`, `/api/admin/ecommerce/coupons`
  - `/api/admin/ecommerce/promotions`, `/api/admin/ecommerce/reports`
- Webhooks
  - `/api/ecommerce/webhooks/mercadopago`
  - `/api/ecommerce/webhooks/stripe`
  - `/api/ecommerce/webhooks/paypal`

## Tables (planned)
- Catalog: products, product_variants, product_media, categories, product_categories
- Inventory: inventory_items, inventory_locations, inventory_levels, inventory_movements
- Cart/Checkout: carts, cart_items, checkout_sessions
- Orders: orders, order_items, order_addresses, order_status_history, fulfillments, refunds, returns
- Payments: payments, payment_events, payment_retries
- Promotions: coupons, coupon_redemptions, promotions
- Audit: audit_logs

## Risks + Mitigations
- Payment webhooks out-of-order: use idempotency via `payment_events` unique constraint.
- Stock contention: use `SELECT ... FOR UPDATE` + transactional reservation updates.
- Checkout abandoned: cron job to release reservations by TTL.
- Provider failures: store raw payloads in `payment_events` for replay/reconciliation.
