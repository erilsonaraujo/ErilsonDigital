import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await query(
    `SELECT p.*, r.name AS resource_name, s.name AS season_name
     FROM booking_pricing_v2 p
     LEFT JOIN booking_resources_v2 r ON r.id = p.resource_id
     LEFT JOIN booking_seasons_v2 s ON s.id = p.season_id
     ORDER BY p.created_at DESC`
  );
  return NextResponse.json({ pricing: result.rows });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { resourceId, seasonId, pricePerDay, pricePerHour } = body || {};
  if (!resourceId) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `INSERT INTO booking_pricing_v2 (resource_id, season_id, price_per_day, price_per_hour)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [resourceId, seasonId || null, pricePerDay || 0, pricePerHour || 0]
  );
  return NextResponse.json({ pricing: result.rows[0] });
}
