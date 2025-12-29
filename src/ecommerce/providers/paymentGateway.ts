export interface CreateCheckoutPayload {
  orderId: string;
  amountCents: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResult {
  providerPaymentId: string;
  checkoutUrl: string;
}

export interface PaymentEvent {
  provider: string;
  providerEventId: string;
  status: string;
  orderId?: string | null;
  paymentId?: string | null;
  amountCents?: number | null;
  raw: Record<string, unknown>;
}

export interface PaymentGateway {
  createCheckout(payload: CreateCheckoutPayload): Promise<CheckoutResult>;
  verifyWebhookSignature(headers: Headers, rawBody: string): Promise<boolean>;
  parseWebhookEvent(rawBody: string): Promise<PaymentEvent | null>;
  refund(paymentId: string, amountCents: number): Promise<void>;
}
