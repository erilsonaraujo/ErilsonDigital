import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

const getRange = (range: string) => {
  const now = new Date();
  let start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (range === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30d') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { start, end: now };
};

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '24h';
  const { start, end } = getRange(range);

  try {
    const [pageviewsRes, visitorsRes, bounceRes, avgSessionRes] = await Promise.all([
      query('SELECT COUNT(*) FROM analytics WHERE created_at BETWEEN $1 AND $2', [start, end]),
      query('SELECT COUNT(DISTINCT visitor_id) FROM analytics WHERE created_at BETWEEN $1 AND $2', [start, end]),
      query(
        `SELECT COUNT(*) FROM (
           SELECT visitor_id, COUNT(*) AS views
           FROM analytics
           WHERE created_at BETWEEN $1 AND $2 AND visitor_id IS NOT NULL
           GROUP BY visitor_id
           HAVING COUNT(*) = 1
         ) t`,
        [start, end]
      ),
      query(
        `SELECT AVG(duration) AS avg_duration FROM (
           SELECT visitor_id, EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) AS duration
           FROM analytics
           WHERE created_at BETWEEN $1 AND $2 AND visitor_id IS NOT NULL
           GROUP BY visitor_id
         ) t`,
        [start, end]
      )
    ]);

    const pageviews = parseInt(pageviewsRes.rows[0].count, 10);
    const visitors = parseInt(visitorsRes.rows[0].count, 10);
    const bounces = parseInt(bounceRes.rows[0].count, 10);
    const avgSession = Math.round(avgSessionRes.rows[0].avg_duration || 0);
    const bounceRate = visitors > 0 ? Math.round((bounces / visitors) * 100) : 0;

    const metric = async (field: string, table = 'analytics', alias = 'x') => {
      const result = await query(
        `SELECT COALESCE(NULLIF(${field}, ''), 'Direct') AS ${alias}, COUNT(*) AS y
         FROM ${table}
         WHERE created_at BETWEEN $1 AND $2
         GROUP BY ${alias}
         ORDER BY y DESC
         LIMIT 20`,
        [start, end]
      );
      return result.rows.map((row) => ({ x: row[alias], y: Number(row.y) }));
    };

    const [urls, referrers, browsers, os, devices, countries, regions, cities, events] = await Promise.all([
      metric('path'),
      metric('referrer'),
      metric('browser'),
      metric('os'),
      metric('device'),
      metric('country'),
      metric('region'),
      metric('city'),
      metric('name', 'analytics_events')
    ]);

    return NextResponse.json({
      stats: {
        pageviews,
        visitors,
        avgSession,
        bounceRate,
      },
      metrics: {
        url: urls,
        referrer: referrers,
        browser: browsers,
        os,
        device: devices,
        country: countries,
        region: regions,
        city: cities,
        event: events,
      }
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
