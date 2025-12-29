import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

const parseUserAgent = (ua: string) => {
  const uaLower = ua.toLowerCase();
  const isMobile = /mobile|iphone|android/.test(uaLower);
  const device = isMobile ? 'mobile' : 'desktop';

  const browser = uaLower.includes('chrome')
    ? 'Chrome'
    : uaLower.includes('safari')
      ? 'Safari'
      : uaLower.includes('firefox')
        ? 'Firefox'
        : uaLower.includes('edg')
          ? 'Edge'
          : 'Other';

  const os = uaLower.includes('windows')
    ? 'Windows'
    : uaLower.includes('mac')
      ? 'MacOS'
      : uaLower.includes('linux')
        ? 'Linux'
        : uaLower.includes('android')
          ? 'Android'
          : uaLower.includes('ios') || uaLower.includes('iphone')
            ? 'iOS'
            : 'Other';

  return { device, browser, os };
};

const anonymizeIp = (rawIp: string) => {
  if (!rawIp || rawIp === 'unknown') return 'unknown';
  if (rawIp.includes('.')) {
    const parts = rawIp.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  if (rawIp.includes(':')) {
    const parts = rawIp.split(':');
    return `${parts.slice(0, 3).join(':')}:0000`;
  }
  return rawIp;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      sessionId,
      path,
      referrer,
      title,
      utm
    } = body || {};

    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 });
    }

    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const ip = anonymizeIp(rawIp);
    const userAgent = request.headers.get('user-agent') || '';
    const { device, browser, os } = parseUserAgent(userAgent);

    const country = request.headers.get('x-vercel-ip-country') || request.headers.get('x-country') || null;
    const region = request.headers.get('x-vercel-ip-country-region') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;

    await pool.query(
      `INSERT INTO analytics (visitor_id, session_id, path, title, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip, user_agent, country, region, city, device, browser, os)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        visitorId || null,
        sessionId || null,
        path,
        title || null,
        referrer || null,
        utm?.source || null,
        utm?.medium || null,
        utm?.campaign || null,
        utm?.term || null,
        utm?.content || null,
        ip,
        userAgent,
        country,
        region,
        city,
        device,
        browser,
        os
      ]
    );

    if (sessionId) {
      await pool.query(
        `INSERT INTO analytics_sessions
          (session_id, visitor_id, first_seen, last_seen, pageviews, landing_path, exit_path, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, country, region, city, device, browser, os, user_agent)
         VALUES ($1, $2, NOW(), NOW(), 1, $3, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (session_id)
         DO UPDATE SET
           last_seen = NOW(),
           pageviews = analytics_sessions.pageviews + 1,
           exit_path = EXCLUDED.exit_path`,
        [
          sessionId,
          visitorId || null,
          path,
          referrer || null,
          utm?.source || null,
          utm?.medium || null,
          utm?.campaign || null,
          utm?.term || null,
          utm?.content || null,
          country,
          region,
          city,
          device,
          browser,
          os,
          userAgent
        ]
      );
    }

    if (sessionId && path) {
      const goals = await pool.query(
        'SELECT id, value FROM analytics_goals WHERE type = $1 AND match_value = $2',
        ['url', path]
      );

      for (const goal of goals.rows) {
        await pool.query(
          `INSERT INTO analytics_goal_conversions (goal_id, visitor_id, session_id, path, value)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (goal_id, session_id) DO NOTHING`,
          [goal.id, visitorId || null, sessionId, path, goal.value || 0]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
