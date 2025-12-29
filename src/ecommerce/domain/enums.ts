export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const ORDER_STATUSES = [
  'created',
  'awaiting_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'canceled',
  'refunded',
  'partially_refunded',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_PROVIDERS = ['mercadopago', 'stripe', 'paypal', 'pix'] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const COUPON_TYPES = ['percent', 'fixed', 'free_shipping'] as const;
export type CouponType = (typeof COUPON_TYPES)[number];
