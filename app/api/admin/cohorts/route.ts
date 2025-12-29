import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

const parseRange = (range: string) => {
  const now = new Date();
  let days = 84;
  if (range.endsWith('d')) {
    days = Number(range.replace('d', ''));
  } else if (range.endsWith('w')) {
    days = Number(range.replace('w', '')) * 7;
  } else if (range.endsWith('m')) {
    days = Number(range.replace('m', '')) * 30;
  }
  if (!Number.isFinite(days) || days <= 0) days = 84;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end: now };
};

const truncateDate = (date: Date, interval: string) => {
  const d = new Date(date);
  if (interval === 'day') {
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const diffIntervals = (start: Date, end: Date, interval: string) => {
  const ms = end.getTime() - start.getTime();
  if (interval === 'day') return Math.floor(ms / (24 * 60 * 60 * 1000));
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
};

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '12w';
  const interval = searchParams.get('interval') || 'week';
  const { start, end } = parseRange(range);

  try {
    const cohortVisitorsRes = await query(
      `SELECT visitor_id, MIN(first_seen) AS first_seen
       FROM analytics_sessions
       WHERE first_seen BETWEEN $1 AND $2
       GROUP BY visitor_id`,
      [start, end]
    );

    const cohortMap = new Map<string, { label: string; size: number; active: Map<number, Set<string>> }>();
    const visitorCohort = new Map<string, Date>();

    cohortVisitorsRes.rows.forEach((row) => {
      if (!row.visitor_id) return;
      const cohortDate = truncateDate(new Date(row.first_seen), interval);
      visitorCohort.set(row.visitor_id, cohortDate);
      const key = cohortDate.toISOString().slice(0, 10);
      if (!cohortMap.has(key)) {
        cohortMap.set(key, { label: key, size: 0, active: new Map() });
      }
      cohortMap.get(key)!.size += 1;
    });

    const visitorIds = Array.from(visitorCohort.keys());
    if (visitorIds.length === 0) {
      return NextResponse.json({ cohorts: [] });
    }

    const sessionsRes = await query(
      `SELECT visitor_id, last_seen
       FROM analytics_sessions
       WHERE visitor_id = ANY($1)
         AND last_seen BETWEEN $2 AND $3`,
      [visitorIds, start, end]
    );

    sessionsRes.rows.forEach((row) => {
      const cohortDate = visitorCohort.get(row.visitor_id);
      if (!cohortDate) return;
      const sessionDate = truncateDate(new Date(row.last_seen), interval);
      const offset = diffIntervals(cohortDate, sessionDate, interval);
      if (offset < 0) return;
      const cohortKey = cohortDate.toISOString().slice(0, 10);
      const cohort = cohortMap.get(cohortKey);
      if (!cohort) return;
      if (!cohort.active.has(offset)) {
        cohort.active.set(offset, new Set());
      }
      cohort.active.get(offset)!.add(row.visitor_id);
    });

    const cohorts = Array.from(cohortMap.values())
      .sort((a, b) => (a.label > b.label ? 1 : -1))
      .map((cohort) => {
        const maxOffset = Math.max(0, ...Array.from(cohort.active.keys()));
        const retention = Array.from({ length: maxOffset + 1 }, (_, index) => {
          const count = cohort.active.get(index)?.size || 0;
          const percent = cohort.size > 0 ? Math.round((count / cohort.size) * 100) : 0;
          return { offset: index, count, percent };
        });
        return { label: cohort.label, size: cohort.size, retention };
      });

    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error('Cohorts error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
