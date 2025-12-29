import { NextRequest, NextResponse } from 'next/server';
import { listOrdersByEmail } from '@/src/ecommerce/services/orderService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function GET(request: NextRequest) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const orders = await listOrdersByEmail(email);
  return NextResponse.json({ orders });
}
