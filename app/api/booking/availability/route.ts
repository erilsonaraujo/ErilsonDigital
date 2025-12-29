import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { calculateBookingTotal, isAvailable } from '@/lib/bookingAvailability';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startAt = searchParams.get('start');
  const endAt = searchParams.get('end');

  if (!startAt || !endAt) {
    return NextResponse.json({ error: 'Missing dates' }, { status: 400 });
  }

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  const resourcesRes = await query('SELECT * FROM booking_resources_v2 WHERE status = $1', ['active']);
  const resources = [];

  for (const resource of resourcesRes.rows) {
    const available = await isAvailable(resource.id, startDate, endDate);
    if (!available) continue;
    const pricing = await calculateBookingTotal(resource.id, startDate, endDate);
    resources.push({
      id: resource.id,
      name: resource.name,
      slug: resource.slug,
      capacity: resource.capacity,
      total: pricing.total,
      totalDays: pricing.totalDays
    });
  }

  return NextResponse.json({ resources });
}
