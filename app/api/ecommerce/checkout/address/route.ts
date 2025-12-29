import { NextRequest, NextResponse } from 'next/server';
import { updateAddresses } from '@/src/ecommerce/services/checkoutService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { sessionId, shipping, billing } = await request.json();
  if (!sessionId || !shipping) {
    return NextResponse.json({ error: 'sessionId and shipping required' }, { status: 400 });
  }

  const session = await updateAddresses(sessionId, { shipping, billing });
  return NextResponse.json({ session });
}
