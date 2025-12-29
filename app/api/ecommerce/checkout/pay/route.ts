import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutPayment } from '@/src/ecommerce/services/paymentService';
import { getCheckout } from '@/src/ecommerce/services/checkoutService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { sessionId, provider, returnUrl, cancelUrl } = await request.json();
  if (!sessionId || !provider) {
    return NextResponse.json({ error: 'sessionId and provider required' }, { status: 400 });
  }

  const session = await getCheckout(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Checkout not found' }, { status: 404 });
  }

  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const successUrl = returnUrl || `${origin}/checkout/success`;
  const cancel = cancelUrl || `${origin}/checkout/cancel`;

  try {
    const result = await createCheckoutPayment({
      session,
      provider,
      returnUrl: successUrl,
      cancelUrl: cancel,
    });
    return NextResponse.json({ order: result.order, checkoutUrl: result.checkoutUrl, pix: result.pix });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
