import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await query('SELECT * FROM analytics_reports ORDER BY created_at DESC');
    return NextResponse.json({ reports: result.rows });
  } catch (error) {
    console.error('Reports list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, description, dimensions, metrics, filters } = body || {};
    if (!name || !Array.isArray(dimensions) || !Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO analytics_reports (name, description, dimensions, metrics, filters)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description || null, JSON.stringify(dimensions), JSON.stringify(metrics), filters ? JSON.stringify(filters) : null]
    );
    return NextResponse.json({ report: result.rows[0] });
  } catch (error) {
    console.error('Reports create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
