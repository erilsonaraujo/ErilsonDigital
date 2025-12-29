import crypto from 'crypto';
import type { PaymentGateway, CreateCheckoutPayload, PaymentEvent } from '@/src/ecommerce/providers/paymentGateway';
import fetch from 'node-fetch';

const MP_API_BASE = process.env.MP_API_BASE || 'https://api.mercadopago.com';

function ensureAccessToken() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error('MP_ACCESS_TOKEN is not set');
  return token;
}

async function fetchPaymentDetails(paymentId: string) {
  const token = ensureAccessToken();
  const res = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Mercado Pago payment lookup failed');
  return (await res.json()) as Record<string, any>;
}

export function createMercadoPagoGateway(): PaymentGateway {
  return {
    async createCheckout(payload: CreateCheckoutPayload) {
      const token = ensureAccessToken();
      const res = await fetch(`${MP_API_BASE}/checkout/preferences`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: `Order ${payload.orderId}`,
              quantity: 1,
              unit_price: payload.amountCents / 100,
              currency_id: payload.currency,
            },
          ],
          back_urls: {
            success: payload.returnUrl,
            failure: payload.cancelUrl,
            pending: payload.cancelUrl,
          },
          auto_return: 'approved',
          external_reference: payload.orderId,
          metadata: payload.metadata || {},
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Mercado Pago checkout error: ${text}`);
      }

      const data = (await res.json()) as Record<string, any>;
      return {
        providerPaymentId: data.id,
        checkoutUrl: data.init_point,
      };
    },

    async verifyWebhookSignature(headers: Headers, rawBody: string) {
      const secret = process.env.MP_WEBHOOK_SECRET;
      if (!secret) return true;
      const signature = headers.get('x-signature');
      if (!signature) return false;
      const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      return signature === digest;
    },

    async parseWebhookEvent(rawBody: string): Promise<PaymentEvent | null> {
      const payload = JSON.parse(rawBody) as Record<string, any>;
      const providerEventId = payload.id || payload.data?.id || crypto.randomUUID();

      if (payload.type !== 'payment' && payload.action !== 'payment.created') {
        return {
          provider: 'mercadopago',
          providerEventId,
          status: 'ignored',
          raw: payload,
        };
      }

      const paymentId = payload.data?.id || payload.id;
      if (!paymentId) {
        return {
          provider: 'mercadopago',
          providerEventId,
          status: 'unknown',
          raw: payload,
        };
      }

      const details = await fetchPaymentDetails(String(paymentId));
      const status = details.status === 'approved' ? 'paid' : details.status || 'pending';

      return {
        provider: 'mercadopago',
        providerEventId,
        status,
        orderId: details.external_reference || null,
        paymentId: details.id ? String(details.id) : null,
        amountCents: details.transaction_amount ? Math.round(details.transaction_amount * 100) : null,
        raw: details,
      };
    },

    async refund(paymentId: string, amountCents: number) {
      const token = ensureAccessToken();
      const res = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}/refunds`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountCents / 100 }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Mercado Pago refund error: ${text}`);
      }
    },
  };
}
