import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCart, resolveCart } from '@/src/ecommerce/services/cartService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

const CART_COOKIE = 'cart_session_id';

export async function GET() {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value || null;
  if (!sessionId) return NextResponse.json({ cart: null });

  const cart = await resolveCart(sessionId, null);
  const fullCart = cart ? await getCart(cart.id) : null;
  return NextResponse.json({ cart: fullCart });
}

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { customerId } = await request.json().catch(() => ({ customerId: null }));
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value || null;

  const cart = await resolveCart(sessionId, customerId || null);
  const response = NextResponse.json({ cart });
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
