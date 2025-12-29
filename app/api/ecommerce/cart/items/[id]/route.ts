import { NextRequest, NextResponse } from 'next/server';
import { updateItemQty, removeItem } from '@/src/ecommerce/services/cartService';
import { isEcommerceEnabled } from '@/src/ecommerce/services/flags';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  const { qty } = await request.json();
  if (qty === undefined) {
    return NextResponse.json({ error: 'qty required' }, { status: 400 });
  }

  try {
    const cart = await updateItemQty(params.id, Number(qty));
    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!isEcommerceEnabled()) {
    return NextResponse.json({ error: 'Ecommerce disabled' }, { status: 404 });
  }

  try {
    const cart = await removeItem(params.id);
    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
