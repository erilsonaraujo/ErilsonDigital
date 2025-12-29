import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addItem, resolveCart } from '@/src/ecommerce/services/cartService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

const CART_COOKIE = 'cart_session_id';

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { variantId, qty } = await request.json();
  if (!variantId || !qty) {
    return NextResponse.json({ error: 'variantId and qty required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value || null;
  const cart = await resolveCart(sessionId, null);
  const updated = await addItem(cart.id, variantId, Number(qty));

  const response = NextResponse.json({ cart: updated });
  if (!sessionId || sessionId !== cart.session_id) {
    response.cookies.set(CART_COOKIE, cart.session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });
  }

  return response;
}
