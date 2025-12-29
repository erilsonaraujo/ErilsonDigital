import crypto from 'crypto';
import type { PaymentGateway, CreateCheckoutPayload, PaymentEvent } from '@/src/ecommerce/providers/paymentGateway';
import fetch from 'node-fetch';

const STRIPE_API_BASE = 'https://api.stripe.com';

function ensureStripeKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return key;
}

function buildFormData(payload: Record<string, string>) {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, value);
  });
  return params.toString();
}

export function createStripeGateway(): PaymentGateway {
  return {
    async createCheckout(payload: CreateCheckoutPayload) {
      const key = ensureStripeKey();
      const form = buildFormData({
        'success_url': payload.returnUrl,
        'cancel_url': payload.cancelUrl,
        'mode': 'payment',
        'line_items[0][price_data][currency]': payload.currency.toLowerCase(),
        'line_items[0][price_data][product_data][name]': `Order ${payload.orderId}`,
        'line_items[0][price_data][unit_amount]': String(payload.amountCents),
        'line_items[0][quantity]': '1',
        'client_reference_id': payload.orderId,
        'metadata[order_id]': payload.orderId,
      });

      const res = await fetch(`${STRIPE_API_BASE}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Stripe checkout error: ${text}`);
      }

      const data = (await res.json()) as Record<string, any>;
      return {
        providerPaymentId: data.id,
        checkoutUrl: data.url,
      };
    },

    async verifyWebhookSignature(headers: Headers, rawBody: string) {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!secret) return false;
      const signatureHeader = headers.get('stripe-signature');
      if (!signatureHeader) return false;

      const parts = signatureHeader.split(',');
      const timestampPart = parts.find((part) => part.startsWith('t='));
      const signaturePart = parts.find((part) => part.startsWith('v1='));
      if (!timestampPart || !signaturePart) return false;

      const timestamp = timestampPart.split('=')[1];
      const signature = signaturePart.split('=')[1];
      const signedPayload = `${timestamp}.${rawBody}`;
      const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

      const sigBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expected, 'hex');
      if (sigBuffer.length !== expectedBuffer.length) return false;
      return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
    },

    async parseWebhookEvent(rawBody: string): Promise<PaymentEvent | null> {
      const payload = JSON.parse(rawBody) as Record<string, any>;
      const eventType = payload.type;
      const eventId = payload.id;
      const dataObject = payload.data?.object || {};

      let status = 'pending';
      if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
        status = 'paid';
      } else if (eventType === 'payment_intent.payment_failed') {
        status = 'failed';
      }

      return {
        provider: 'stripe',
        providerEventId: eventId || crypto.randomUUID(),
        status,
        orderId: dataObject.metadata?.order_id || dataObject.client_reference_id || null,
        paymentId: dataObject.payment_intent || dataObject.id || null,
        amountCents: dataObject.amount_total || dataObject.amount || null,
        raw: payload,
      };
    },

    async refund(paymentId: string, amountCents: number) {
      const key = ensureStripeKey();
      const form = buildFormData({
        payment_intent: paymentId,
        amount: String(amountCents),
      });

      const res = await fetch(`${STRIPE_API_BASE}/v1/refunds`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Stripe refund error: ${text}`);
      }
    },
  };
}
