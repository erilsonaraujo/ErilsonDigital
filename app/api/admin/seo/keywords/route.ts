import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

type KeywordRow = {
  date: string;
  query: string;
  page?: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

const insertKeywords = async (rows: KeywordRow[]) => {
  for (const row of rows) {
    await query(
      `INSERT INTO seo_keywords (date, query, page, clicks, impressions, ctr, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        row.date,
        row.query,
        row.page || null,
        row.clicks || 0,
        row.impressions || 0,
        row.ctr || 0,
        row.position || 0
      ]
    );
  }
};

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const now = new Date();
  const days = range.endsWith('d') ? Number(range.replace('d', '')) : 30;
  const start = new Date(now.getTime() - (Number.isFinite(days) ? days : 30) * 24 * 60 * 60 * 1000);

  try {
    const keywordsRes = await query(
      `SELECT query, SUM(clicks) AS clicks, SUM(impressions) AS impressions, AVG(ctr) AS ctr, AVG(position) AS position
       FROM seo_keywords
       WHERE date BETWEEN $1 AND $2
       GROUP BY query
       ORDER BY clicks DESC
       LIMIT 50`,
      [start, now]
    );
    const pagesRes = await query(
      `SELECT page, SUM(clicks) AS clicks, SUM(impressions) AS impressions
       FROM seo_keywords
       WHERE date BETWEEN $1 AND $2 AND page IS NOT NULL
       GROUP BY page
       ORDER BY clicks DESC
       LIMIT 50`,
      [start, now]
    );
    return NextResponse.json({ keywords: keywordsRes.rows, pages: pagesRes.rows });
  } catch (error) {
    console.error('SEO keywords fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { keywords, accessToken, property, startDate, endDate } = body || {};

  try {
    if (Array.isArray(keywords) && keywords.length > 0) {
      await insertKeywords(keywords);
      return NextResponse.json({ success: true, imported: keywords.length });
    }

    if (!accessToken || !property || !startDate || !endDate) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query', 'page'],
          rowLimit: 250
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: 'Search Console request failed', details: text }, { status: 400 });
    }

    const data = await response.json();
    const rows = (data.rows || []).map((row: any) => ({
      date: endDate,
      query: row.keys?.[0] || '',
      page: row.keys?.[1] || null,
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0
    }));

    await insertKeywords(rows);
    return NextResponse.json({ success: true, imported: rows.length });
  } catch (error) {
    console.error('SEO keywords import error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
