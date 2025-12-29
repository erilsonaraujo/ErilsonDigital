import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

const parseRange = (range: string) => {
  const now = new Date();
  let days = 30;
  if (range.endsWith('d')) {
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

const DIMENSIONS = {
  path: { table: 'analytics', field: 'path' },
  referrer: { table: 'analytics', field: 'referrer' },
  utm_source: { table: 'analytics', field: 'utm_source' },
  utm_medium: { table: 'analytics', field: 'utm_medium' },
  utm_campaign: { table: 'analytics', field: 'utm_campaign' },
  device: { table: 'analytics', field: 'device' },
  browser: { table: 'analytics', field: 'browser' },
  os: { table: 'analytics', field: 'os' },
  country: { table: 'analytics', field: 'country' },
  region: { table: 'analytics', field: 'region' },
  city: { table: 'analytics', field: 'city' },
  event_name: { table: 'analytics_events', field: 'name' }
} as const;

const METRICS: Record<string, Record<string, string>> = {
  analytics: {
    pageviews: 'COUNT(*)',
    visitors: 'COUNT(DISTINCT visitor_id)',
    sessions: 'COUNT(DISTINCT session_id)'
  },
  analytics_events: {
    events: 'COUNT(*)',
    visitors: 'COUNT(DISTINCT visitor_id)',
    sessions: 'COUNT(DISTINCT session_id)'
  }
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const { start, end } = parseRange(range);

  try {
    const reportRes = await query('SELECT * FROM analytics_reports WHERE id = $1', [id]);
    const report = reportRes.rows[0];
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    const dimensions = Array.isArray(report.dimensions) ? report.dimensions : [];
    const metrics = Array.isArray(report.metrics) ? report.metrics : [];
    const filters = Array.isArray(report.filters) ? report.filters : [];

    if (dimensions.length === 0 || metrics.length === 0) {
      return NextResponse.json({ error: 'Report missing dimensions or metrics' }, { status: 400 });
    }

    const dimensionMeta = dimensions
      .map((dim: string) => DIMENSIONS[dim as keyof typeof DIMENSIONS])
      .filter(Boolean);
    const table = dimensionMeta[0]?.table;
    if (!table || !dimensionMeta.every((dim: { table: string }) => dim.table === table)) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 });
    }

    const allowedMetrics = METRICS[table] || {};
    const metricExprs = metrics.map((metric: string) => allowedMetrics[metric]).filter(Boolean);
    if (metricExprs.length === 0 || metricExprs.length !== metrics.length) {
      return NextResponse.json({ error: 'Invalid metrics for selected dimensions' }, { status: 400 });
    }

    const dimensionSelect = dimensionMeta.map((dim, index) => `COALESCE(NULLIF(${dim.field}, ''), '(not set)') AS dim${index}`);
    const metricSelect = metricExprs.map((expr, index) => `${expr} AS m${index}`);

    const conditions: string[] = ['created_at BETWEEN $1 AND $2'];
    const values: any[] = [start, end];
    let paramIndex = values.length + 1;

    filters.forEach((filter: any) => {
      const fieldMeta = DIMENSIONS[filter.field as keyof typeof DIMENSIONS];
      if (!fieldMeta || fieldMeta.table !== table) return;
      if (filter.operator === 'equals') {
        conditions.push(`${fieldMeta.field} = $${paramIndex}`);
        values.push(filter.value);
        paramIndex += 1;
      } else if (filter.operator === 'contains') {
        conditions.push(`${fieldMeta.field} ILIKE $${paramIndex}`);
        values.push(`%${filter.value}%`);
        paramIndex += 1;
      }
    });

    const sql = `
      SELECT ${dimensionSelect.join(', ')}, ${metricSelect.join(', ')}
      FROM ${table}
      WHERE ${conditions.join(' AND ')}
      GROUP BY ${dimensionMeta.map((dim) => dim.field).join(', ')}
      ORDER BY m0 DESC
      LIMIT 100
    `;

    const dataRes = await query(sql, values);

    return NextResponse.json({
      report,
      data: dataRes.rows.map((row) => ({
        dimensions: dimensionMeta.map((_, index) => row[`dim${index}`]),
        metrics: metricExprs.map((_, index) => Number(row[`m${index}`]))
      }))
    });
  } catch (error) {
    console.error('Report run error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await query('DELETE FROM analytics_reports WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
