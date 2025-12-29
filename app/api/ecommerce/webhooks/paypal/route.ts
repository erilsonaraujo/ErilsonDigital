import { NextRequest, NextResponse } from 'next/server';
import { getPaymentGateway } from '@/src/ecommerce/providers';
import { handleProviderEvent } from '@/src/ecommerce/services/paymentService';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const gateway = getPaymentGateway('paypal');
  const isValid = await gateway.verifyWebhookSignature(request.headers, rawBody);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = await gateway.parseWebhookEvent(rawBody);
  if (!event) return NextResponse.json({ ok: true });

  await handleProviderEvent(event);
  return NextResponse.json({ ok: true });
}
