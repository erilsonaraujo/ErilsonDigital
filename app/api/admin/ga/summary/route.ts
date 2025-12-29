import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const now = new Date();
  const days = range.endsWith('d') ? Number(range.replace('d', '')) : 30;
  const start = new Date(now.getTime() - (Number.isFinite(days) ? days : 30) * 24 * 60 * 60 * 1000);

  try {
    const summaryRes = await query(
      `SELECT SUM(pageviews) AS pageviews, SUM(users) AS users, SUM(sessions) AS sessions
       FROM analytics_ga_imports
       WHERE date BETWEEN $1 AND $2`,
      [start, now]
    );
    const sourceRes = await query(
      `SELECT COALESCE(source, '(not set)') AS source, SUM(sessions) AS sessions
       FROM analytics_ga_imports
       WHERE date BETWEEN $1 AND $2
       GROUP BY source
       ORDER BY sessions DESC
       LIMIT 20`,
      [start, now]
    );
    const pageRes = await query(
      `SELECT COALESCE(page, '(not set)') AS page, SUM(pageviews) AS pageviews
       FROM analytics_ga_imports
       WHERE date BETWEEN $1 AND $2
       GROUP BY page
       ORDER BY pageviews DESC
       LIMIT 20`,
      [start, now]
    );
    return NextResponse.json({
      summary: summaryRes.rows[0] || { pageviews: 0, users: 0, sessions: 0 },
      sources: sourceRes.rows,
      pages: pageRes.rows
    });
  } catch (error) {
    console.error('GA summary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
