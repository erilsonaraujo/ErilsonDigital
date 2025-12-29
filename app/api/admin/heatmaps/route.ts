import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  try {
    const result = await query(
      `SELECT event_type,
              ROUND(COALESCE(x_percent, 0)::numeric, 2) AS x,
              ROUND(COALESCE(y_percent, 0)::numeric, 2) AS y,
              COUNT(*) AS total
       FROM analytics_heatmap_points
       WHERE path = $1
       GROUP BY event_type, x, y
       ORDER BY total DESC
       LIMIT 2000`,
      [path]
    );

    return NextResponse.json({ points: result.rows });
  } catch (error) {
    console.error('Heatmap admin error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
