# Ecommerce Setup

## Environment variables
- ECOMMERCE_ENABLED=true
- ECOMMERCE_ADMIN_ENABLED=true

Payments
- MP_ACCESS_TOKEN
- MP_WEBHOOK_SECRET (optional but recommended)
- MP_API_BASE (optional, default https://api.mercadopago.com)
- STRIPE_SECRET_KEY
- STRIPE_PUBLIC_KEY (for frontend when needed)
- STRIPE_WEBHOOK_SECRET
- PAYPAL_CLIENT_ID
- PAYPAL_SECRET
- PAYPAL_WEBHOOK_ID
- PAYPAL_API_BASE (optional, default https://api-m.paypal.com)
- PIX (no external provider required)

Site URLs
- NEXT_PUBLIC_SITE_URL (used for return/cancel URLs)

## Run migrations
The ecommerce migration runner is in `scripts/migrate-ecommerce.ts`.

If you have ts-node installed:
```
node --loader ts-node/esm scripts/migrate-ecommerce.ts
```

Or run with your preferred TS runner (tsx/ts-node).

## Webhooks
Configure the following endpoints in your payment providers:
- Mercado Pago: `https://<your-domain>/api/ecommerce/webhooks/mercadopago`
- Stripe: `https://<your-domain>/api/ecommerce/webhooks/stripe`
- PayPal: `https://<your-domain>/api/ecommerce/webhooks/paypal`

## Jobs
Reservation cleanup:
```
POST /api/admin/ecommerce/jobs/release-reservations
```

Schedule it via external cron every 5 minutes.

## Minimal test plan
- Create a product and variant in Admin > E-commerce.
- Set inventory levels in Admin > Estoque.
- Add product to cart via Storefront (`/store`).
- Run checkout and select a provider.
- For PIX, complete the payment manually via admin:
  - `POST /api/admin/ecommerce/payments/{paymentId}/mark-paid`
- Confirm webhook updates order status to paid.

## Automated tests
Run the DB sanity tests (requires POSTGRES_URL):
```
node --test tests/ecommerce.test.js
```

## Notes
- This module never stores card data. Only provider IDs/tokens are stored.
- Ensure `shipping_rates` and `tax_rates` are configured for real totals.
