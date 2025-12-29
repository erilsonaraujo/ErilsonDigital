import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

const parseRange = (range: string) => {
  const now = new Date();
  let days = 30;
  if (range.endsWith('h')) {
    const hours = Number(range.replace('h', ''));
    days = hours / 24;
  } else if (range.endsWith('d')) {
    days = Number(range.replace('d', ''));
  } else if (range.endsWith('w')) {
    days = Number(range.replace('w', '')) * 7;
  } else if (range.endsWith('m')) {
    days = Number(range.replace('m', '')) * 30;
  }
  if (!Number.isFinite(days) || days <= 0) days = 30;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end: now };
};

const SOCIAL_HOSTS = ['facebook.com', 'instagram.com', 'linkedin.com', 't.co', 'twitter.com', 'x.com', 'youtube.com', 'tiktok.com'];
const SEARCH_HOSTS = ['google.', 'bing.', 'yahoo.', 'duckduckgo.', 'yandex.', 'baidu.'];

const classifyChannel = (session: { utm_source?: string | null; utm_medium?: string | null; referrer?: string | null }) => {
  const source = (session.utm_source || '').toLowerCase();
  const medium = (session.utm_medium || '').toLowerCase();
  const referrer = (session.referrer || '').toLowerCase();

  const isPaid = ['cpc', 'ppc', 'paid', 'paidsearch', 'display', 'affiliate', 'sponsored'].includes(medium);
  if (isPaid) return 'Paid';

  if (['social', 'social-media', 'social_network', 'socialnetwork', 'paid_social'].includes(medium)) return 'Social';
  if (SOCIAL_HOSTS.some((host) => referrer.includes(host))) return 'Social';

  if (SEARCH_HOSTS.some((host) => referrer.includes(host))) return 'Organic';

  if (referrer) return 'Referral';
  if (source || medium) return 'Campaign';
  return 'Direct';
};

const normalizeWeights = (weights: number[]) => {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return weights.map(() => 0);
  return weights.map((w) => w / total);
};

const computeAttribution = (touchpoints: { channel: string; last_seen: Date }[], model: string, conversionTime: Date) => {
  const channels = touchpoints.map((t) => t.channel);
  const count = channels.length;
  if (count === 0) return [];

  if (model === 'first') return [{ channel: channels[0], weight: 1 }];
  if (model === 'last') return [{ channel: channels[count - 1], weight: 1 }];

  if (model === 'linear') {
    const weight = 1 / count;
    return channels.map((channel) => ({ channel, weight }));
  }

  if (model === 'time_decay') {
    const halfLifeDays = 7;
    const weights = touchpoints.map((t) => {
      const deltaDays = Math.max(0, (conversionTime.getTime() - t.last_seen.getTime()) / (1000 * 60 * 60 * 24));
      return Math.pow(0.5, deltaDays / halfLifeDays);
    });
    const normalized = normalizeWeights(weights);
    return channels.map((channel, index) => ({ channel, weight: normalized[index] }));
  }

  if (model === 'position') {
    if (count === 1) return [{ channel: channels[0], weight: 1 }];
    if (count === 2) return [{ channel: channels[0], weight: 0.5 }, { channel: channels[1], weight: 0.5 }];
    const middleWeight = 0.2 / (count - 2);
    return channels.map((channel, index) => {
      if (index === 0) return { channel, weight: 0.4 };
      if (index === count - 1) return { channel, weight: 0.4 };
      return { channel, weight: middleWeight };
    });
  }

  return [{ channel: channels[count - 1], weight: 1 }];
};

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const model = searchParams.get('model') || 'last';
  const goalIdParam = searchParams.get('goalId');
  const goalId = goalIdParam ? Number(goalIdParam) : null;

  const { start, end } = parseRange(range);
  const lookbackStart = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    const params: any[] = [start, end];
    let goalClause = '';
    if (goalId) {
      params.push(goalId);
      goalClause = ` AND c.goal_id = $3`;
    }

    const conversionsRes = await query(
      `SELECT c.id, c.goal_id, c.visitor_id, c.session_id, c.created_at, g.name AS goal_name
       FROM analytics_goal_conversions c
       LEFT JOIN analytics_goals g ON g.id = c.goal_id
       WHERE c.created_at BETWEEN $1 AND $2${goalClause}
       ORDER BY c.created_at ASC`,
      params
    );

    if (conversionsRes.rows.length === 0) {
      return NextResponse.json({ model, totals: [], byGoal: {}, totalConversions: 0 });
    }

    const visitorIds = Array.from(new Set(conversionsRes.rows.map((row) => row.visitor_id).filter(Boolean)));
    if (visitorIds.length === 0) {
      return NextResponse.json({ model, totals: [], byGoal: {}, totalConversions: conversionsRes.rows.length });
    }

    const sessionsRes = await query(
      `SELECT session_id, visitor_id, last_seen, utm_source, utm_medium, referrer
       FROM analytics_sessions
       WHERE visitor_id = ANY($1)
         AND last_seen BETWEEN $2 AND $3
       ORDER BY last_seen ASC`,
      [visitorIds, lookbackStart, end]
    );

    const sessionsByVisitor = new Map<string, { session_id: string; last_seen: Date; channel: string }[]>();
    sessionsRes.rows.forEach((row) => {
      const channel = classifyChannel(row);
      const list = sessionsByVisitor.get(row.visitor_id) || [];
      list.push({ session_id: row.session_id, last_seen: row.last_seen, channel });
      sessionsByVisitor.set(row.visitor_id, list);
    });

    const totals = new Map<string, number>();
    const byGoal = new Map<number, { goalName: string; totals: Map<string, number> }>();

    conversionsRes.rows.forEach((conversion) => {
      const visitorSessions = sessionsByVisitor.get(conversion.visitor_id) || [];
      const relevant = visitorSessions.filter((s) => s.last_seen <= conversion.created_at);
      if (relevant.length === 0) return;

      const touchpoints = computeAttribution(relevant, model, conversion.created_at);
      touchpoints.forEach((touch) => {
        totals.set(touch.channel, (totals.get(touch.channel) || 0) + touch.weight);
      });

      const goalKey = conversion.goal_id || 0;
      if (!byGoal.has(goalKey)) {
        byGoal.set(goalKey, { goalName: conversion.goal_name || 'Conversao', totals: new Map() });
      }
      const goalTotals = byGoal.get(goalKey)?.totals;
      if (goalTotals) {
        touchpoints.forEach((touch) => {
          goalTotals.set(touch.channel, (goalTotals.get(touch.channel) || 0) + touch.weight);
        });
      }
    });

    const formatTotals = (map: Map<string, number>) =>
      Array.from(map.entries())
        .map(([channel, value]) => ({ channel, value: Number(value.toFixed(2)) }))
        .sort((a, b) => b.value - a.value);

    const byGoalFormatted = Array.from(byGoal.entries()).reduce((acc, [goalIdKey, data]) => {
      acc[goalIdKey] = {
        goalName: data.goalName,
        totals: formatTotals(data.totals)
      };
      return acc;
    }, {} as Record<string, { goalName: string; totals: { channel: string; value: number }[] }>);

    return NextResponse.json({
      model,
      totals: formatTotals(totals),
      byGoal: byGoalFormatted,
      totalConversions: conversionsRes.rows.length
    });
  } catch (error) {
    console.error('Attribution error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
