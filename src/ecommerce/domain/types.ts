import type { CouponType, OrderStatus, PaymentProvider, ProductStatus } from '@/src/ecommerce/domain/enums';

export interface Product {
  id: string;
  status: ProductStatus;
  title: string;
  slug: string;
  description?: string | null;
  brand?: string | null;
  seo_title?: string | null;
  seo_desc?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  barcode?: string | null;
  attrs: Record<string, string>;
  price_cents: number;
  compare_at_cents?: number | null;
  currency: string;
  weight_grams?: number | null;
  dims?: Record<string, string | number> | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  customer_id?: string | null;
  session_id?: string | null;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  qty: number;
  unit_price_cents: number;
  discounts?: Record<string, unknown> | null;
}

export interface Order {
  id: string;
  order_number: number;
  customer_id?: string | null;
  email?: string | null;
  status: OrderStatus;
  payment_status: string;
  fulfillment_status: string;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: PaymentProvider;
  intent_id?: string | null;
  status: string;
  amount_cents: number;
  currency: string;
  idempotency_key?: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  amount: number;
  min_subtotal_cents?: number | null;
  max_uses?: number | null;
  per_customer_limit?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  active: boolean;
}
