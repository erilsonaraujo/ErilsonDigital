import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const SETTINGS_KEY = 'analytics_config';

const authorize = async (request: NextRequest) => {
  const headerKey = request.headers.get('x-erilson-analytics-key');
  const urlKey = new URL(request.url).searchParams.get('key');
  const result = await query('SELECT value FROM site_settings WHERE key = $1', [SETTINGS_KEY]);
  const value = result.rows[0]?.value;
  const settings = value ? JSON.parse(value) : {};
  const apiKey = settings.publicApiKey;
  return apiKey && (headerKey === apiKey || urlKey === apiKey);
};

export async function GET(request: NextRequest) {
  const authorized = await authorize(request);
  if (!authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const now = new Date();
  const days = range.endsWith('d') ? Number(range.replace('d', '')) : 30;
  const start = new Date(now.getTime() - (Number.isFinite(days) ? days : 30) * 24 * 60 * 60 * 1000);

  try {
    const [pageviewsRes, visitorsRes, sessionsRes] = await Promise.all([
      query('SELECT COUNT(*) FROM analytics WHERE created_at BETWEEN $1 AND $2', [start, now]),
      query('SELECT COUNT(DISTINCT visitor_id) FROM analytics_sessions WHERE last_seen BETWEEN $1 AND $2', [start, now]),
      query('SELECT COUNT(*) FROM analytics_sessions WHERE last_seen BETWEEN $1 AND $2', [start, now])
    ]);
    return NextResponse.json({
      pageviews: Number(pageviewsRes.rows[0]?.count || 0),
      visitors: Number(visitorsRes.rows[0]?.count || 0),
      sessions: Number(sessionsRes.rows[0]?.count || 0)
    });
  } catch (error) {
    console.error('Public summary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
