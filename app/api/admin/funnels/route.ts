import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const funnels = await query('SELECT * FROM analytics_funnels ORDER BY created_at DESC');
  const steps = await query('SELECT * FROM analytics_funnel_steps ORDER BY funnel_id, step_order');

  const data = funnels.rows.map((funnel) => ({
    ...funnel,
    steps: steps.rows.filter((step) => step.funnel_id === funnel.id),
  }));

  return NextResponse.json({ funnels: data });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, steps } = body || {};

  if (!name || !Array.isArray(steps) || steps.length === 0) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const funnelRes = await query(
    'INSERT INTO analytics_funnels (name) VALUES ($1) RETURNING *',
    [name]
  );

  const funnel = funnelRes.rows[0];
  for (const [index, step] of steps.entries()) {
    await query(
      'INSERT INTO analytics_funnel_steps (funnel_id, step_order, type, match_value) VALUES ($1, $2, $3, $4)',
      [funnel.id, index + 1, step.type, step.matchValue]
    );
  }

  return NextResponse.json({ funnel }, { status: 201 });
}
