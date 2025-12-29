import crypto from 'crypto';
import type { PaymentGateway, CreateCheckoutPayload, PaymentEvent } from '@/src/ecommerce/providers/paymentGateway';
import fetch from 'node-fetch';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';

function ensurePayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) throw new Error('PAYPAL_CLIENT_ID or PAYPAL_SECRET is not set');
  return { clientId, secret };
}

async function getAccessToken() {
  const { clientId, secret } = ensurePayPalCredentials();
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${text}`);
  }
  const data = (await res.json()) as Record<string, any>;
  return data.access_token as string;
}

export function createPayPalGateway(): PaymentGateway {
  return {
    async createCheckout(payload: CreateCheckoutPayload) {
      const accessToken = await getAccessToken();
      const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: payload.currency,
                value: (payload.amountCents / 100).toFixed(2),
              },
              custom_id: payload.orderId,
            },
          ],
          application_context: {
            return_url: payload.returnUrl,
            cancel_url: payload.cancelUrl,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PayPal checkout error: ${text}`);
      }

      const data = (await res.json()) as Record<string, any>;
      const approval = data.links?.find((link: any) => link.rel === 'approve');
      return {
        providerPaymentId: data.id,
        checkoutUrl: approval?.href || payload.returnUrl,
      };
    },

    async verifyWebhookSignature(headers: Headers, rawBody: string) {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;
      if (!webhookId) return false;

      const accessToken = await getAccessToken();
      const transmissionId = headers.get('paypal-transmission-id');
      const transmissionTime = headers.get('paypal-transmission-time');
      const certUrl = headers.get('paypal-cert-url');
      const authAlgo = headers.get('paypal-auth-algo');
      const transmissionSig = headers.get('paypal-transmission-sig');

      if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
        return false;
      }

      const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transmission_id: transmissionId,
          transmission_time: transmissionTime,
          cert_url: certUrl,
          auth_algo: authAlgo,
          transmission_sig: transmissionSig,
          webhook_id: webhookId,
          webhook_event: JSON.parse(rawBody),
        }),
      });

      if (!res.ok) return false;
      const data = (await res.json()) as Record<string, any>;
      return data.verification_status === 'SUCCESS';
    },

    async parseWebhookEvent(rawBody: string): Promise<PaymentEvent | null> {
      const payload = JSON.parse(rawBody) as Record<string, any>;
      const eventId = payload.id;
      const eventType = payload.event_type;
      const resource = payload.resource || {};

      let status = 'pending';
      if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
        status = 'paid';
      } else if (eventType === 'PAYMENT.CAPTURE.DENIED') {
        status = 'failed';
      }

      return {
        provider: 'paypal',
        providerEventId: eventId || resource.id || crypto.randomUUID(),
        status,
        orderId: resource.custom_id || resource.purchase_units?.[0]?.custom_id || null,
        paymentId: resource.id || null,
        amountCents: resource.amount?.value ? Math.round(Number(resource.amount.value) * 100) : null,
        raw: payload,
      };
    },

    async refund(paymentId: string, amountCents: number) {
      const accessToken = await getAccessToken();
      const res = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: {
            value: (amountCents / 100).toFixed(2),
            currency_code: 'BRL',
          },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PayPal refund error: ${text}`);
      }
    },
  };
}
