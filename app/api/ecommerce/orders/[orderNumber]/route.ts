import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber } from '@/src/ecommerce/services/orderService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function GET(_request: NextRequest, { params }: { params: { orderNumber: string } }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const order = await getOrderByNumber(params.orderNumber);
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}
