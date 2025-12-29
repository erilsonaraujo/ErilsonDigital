import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

type GaRow = {
  date: string;
  source?: string;
  medium?: string;
  campaign?: string;
  page?: string;
  sessions?: number;
  users?: number;
  pageviews?: number;
};

const parseCsv = (csv: string) => {
  const lines = csv.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
};

const insertRows = async (rows: GaRow[]) => {
  for (const row of rows) {
    await query(
      `INSERT INTO analytics_ga_imports (date, source, medium, campaign, page, sessions, users, pageviews)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        row.date,
        row.source || null,
        row.medium || null,
        row.campaign || null,
        row.page || null,
        row.sessions || 0,
        row.users || 0,
        row.pageviews || 0
      ]
    );
  }
};

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { rows, csv } = body || {};

  try {
    if (Array.isArray(rows)) {
      await insertRows(rows);
      return NextResponse.json({ success: true, imported: rows.length });
    }

    if (typeof csv === 'string') {
      const parsed = parseCsv(csv);
      const normalized: GaRow[] = parsed.map((row) => ({
        date: row.date || row.Date,
        source: row.source || row.Source,
        medium: row.medium || row.Medium,
        campaign: row.campaign || row.Campaign,
        page: row.page || row.Page,
        sessions: Number(row.sessions || row.Sessions || 0),
        users: Number(row.users || row.Users || 0),
        pageviews: Number(row.pageviews || row.Pageviews || 0)
      })).filter((row) => row.date);
      await insertRows(normalized);
      return NextResponse.json({ success: true, imported: normalized.length });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    console.error('GA import error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
