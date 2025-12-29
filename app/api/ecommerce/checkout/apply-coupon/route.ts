import { NextRequest, NextResponse } from 'next/server';
import { applyCouponToCart } from '@/src/ecommerce/services/checkoutService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { cartId, code, customerId } = await request.json();
  if (!cartId || !code) {
    return NextResponse.json({ error: 'cartId and code required' }, { status: 400 });
  }

  const result = await applyCouponToCart(cartId, code, customerId || null);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ coupon: result.coupon, discount: result.discount });
}
