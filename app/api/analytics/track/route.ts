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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      sessionId,
      path,
      referrer
    } = body || {};

    if (!path) {
      return NextResponse.json({ error: 'Path required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const { device, browser, os } = parseUserAgent(userAgent);

    const country = request.headers.get('x-vercel-ip-country') || request.headers.get('x-country') || null;
    const region = request.headers.get('x-vercel-ip-country-region') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;

    await pool.query(
      `INSERT INTO analytics (visitor_id, session_id, path, referrer, ip, user_agent, country, region, city, device, browser, os)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        visitorId || null,
        sessionId || null,
        path,
        referrer || null,
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
