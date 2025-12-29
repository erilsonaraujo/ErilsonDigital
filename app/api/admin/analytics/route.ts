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
    const [pageviewsRes, visitorsRes, sessionsRes, bouncesRes, avgSessionRes] = await Promise.all([
      query('SELECT COUNT(*) FROM analytics WHERE created_at BETWEEN $1 AND $2', [start, end]),
      query('SELECT COUNT(DISTINCT visitor_id) FROM analytics_sessions WHERE last_seen BETWEEN $1 AND $2', [start, end]),
      query('SELECT COUNT(*) FROM analytics_sessions WHERE last_seen BETWEEN $1 AND $2', [start, end]),
      query('SELECT COUNT(*) FROM analytics_sessions WHERE last_seen BETWEEN $1 AND $2 AND pageviews <= 1', [start, end]),
      query(
        `SELECT AVG(EXTRACT(EPOCH FROM (last_seen - first_seen))) AS avg_duration
         FROM analytics_sessions
         WHERE last_seen BETWEEN $1 AND $2`,
        [start, end]
      ),
    ]);

    const pageviews = parseInt(pageviewsRes.rows[0].count, 10);
    const visitors = parseInt(visitorsRes.rows[0].count, 10);
    const sessions = parseInt(sessionsRes.rows[0].count, 10);
    const bounces = parseInt(bouncesRes.rows[0].count, 10);
    const avgSession = Math.round(avgSessionRes.rows[0].avg_duration || 0);
    const bounceRate = sessions > 0 ? Math.round((bounces / sessions) * 100) : 0;

    const metric = async (field: string, table = 'analytics', alias = 'x', dateField = 'created_at') => {
      const result = await query(
        `SELECT COALESCE(NULLIF(${field}, ''), 'Direct') AS ${alias}, COUNT(*) AS y
         FROM ${table}
         WHERE ${dateField} BETWEEN $1 AND $2
         GROUP BY ${alias}
         ORDER BY y DESC
         LIMIT 20`,
        [start, end]
      );
      return result.rows.map((row) => ({ x: row[alias], y: Number(row.y) }));
    };

    const [urls, referrers, browsers, os, devices, countries, regions, cities, events, utmSources, utmMediums, utmCampaigns, landings, exits] = await Promise.all([
      metric('path'),
      metric('referrer'),
      metric('browser'),
      metric('os'),
      metric('device'),
      metric('country'),
      metric('region'),
      metric('city'),
      metric('name', 'analytics_events'),
      metric('utm_source'),
      metric('utm_medium'),
      metric('utm_campaign'),
      metric('landing_path', 'analytics_sessions', 'x', 'last_seen'),
      metric('exit_path', 'analytics_sessions', 'x', 'last_seen')
    ]);

    const goalsRes = await query(
      `SELECT g.id, g.name, g.type, g.match_value, g.value,
        COUNT(c.id) AS conversions,
        COALESCE(SUM(c.value), 0) AS total_value
       FROM analytics_goals g
       LEFT JOIN analytics_goal_conversions c
         ON c.goal_id = g.id AND c.created_at BETWEEN $1 AND $2
       GROUP BY g.id
       ORDER BY conversions DESC`,
      [start, end]
    );

    const funnelsRes = await query('SELECT id, name FROM analytics_funnels ORDER BY created_at DESC');
    const funnelStepsRes = await query('SELECT * FROM analytics_funnel_steps ORDER BY funnel_id, step_order');

    const funnels = funnelsRes.rows.map((funnel) => {
      const steps = funnelStepsRes.rows.filter((step) => step.funnel_id === funnel.id);
      return { id: funnel.id, name: funnel.name, steps };
    });

    const funnelStats = [] as any[];
    for (const funnel of funnels) {
      const stepStats = [] as any[];
      for (const step of funnel.steps) {
        const table = step.type === 'event' ? 'analytics_events' : 'analytics';
        const field = step.type === 'event' ? 'name' : 'path';
        const result = await query(
          `SELECT COUNT(DISTINCT session_id) AS total
           FROM ${table}
           WHERE ${field} = $1 AND created_at BETWEEN $2 AND $3`,
          [step.match_value, start, end]
        );
        stepStats.push({
          order: step.step_order,
          type: step.type,
          match: step.match_value,
          total: Number(result.rows[0]?.total || 0),
        });
      }
      funnelStats.push({ id: funnel.id, name: funnel.name, steps: stepStats });
    }

    return NextResponse.json({
      stats: {
        pageviews,
        visitors,
        sessions,
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
        utm_source: utmSources,
        utm_medium: utmMediums,
        utm_campaign: utmCampaigns,
        landing: landings,
        exit: exits,
      },
      goals: goalsRes.rows,
      funnels: funnelStats,
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
