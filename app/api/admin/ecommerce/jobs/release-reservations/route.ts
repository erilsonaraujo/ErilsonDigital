import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminSession } from '@/lib/adminAuth';
import { releaseExpiredReservations } from '@/src/ecommerce/services/inventoryService';
import { isEcommerceAdminEnabled } from '@/src/ecommerce/services/flags';

export async function POST(request: NextRequest) {
  if (!isEcommerceAdminEnabled()) {
    return NextResponse.json({ error: 'Ecommerce admin disabled' }, { status: 404 });
  }
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const released = await releaseExpiredReservations();
  return NextResponse.json({ released });
}
