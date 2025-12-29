import { NextRequest, NextResponse } from 'next/server';
import { startCheckout } from '@/src/ecommerce/services/checkoutService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { cartId, email } = await request.json();
  if (!cartId || !email) {
    return NextResponse.json({ error: 'cartId and email required' }, { status: 400 });
  }

  const session = await startCheckout(cartId, email);
  return NextResponse.json({ session });
}
