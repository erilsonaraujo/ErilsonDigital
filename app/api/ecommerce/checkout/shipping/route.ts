import { NextRequest, NextResponse } from 'next/server';
import { computeShipping, selectShipping, computeTaxes } from '@/src/ecommerce/services/checkoutService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { sessionId, regionCode, selection } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  if (selection) {
    const session = await selectShipping(sessionId, selection);
    if (regionCode) {
      await computeTaxes(sessionId, regionCode);
    }
    return NextResponse.json({ session });
  }

  if (!regionCode) {
    return NextResponse.json({ error: 'regionCode required' }, { status: 400 });
  }

  const options = await computeShipping(sessionId, regionCode);
  return NextResponse.json({ options });
}
