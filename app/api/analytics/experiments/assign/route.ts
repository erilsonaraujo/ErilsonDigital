import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, experimentId, variantId } = body || {};

    if (!experimentId || !variantId) {
      return NextResponse.json({ error: 'experimentId and variantId required' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO analytics_experiment_assignments (experiment_id, variant_id, visitor_id, session_id)
       VALUES ($1, $2, $3, $4)`,
      [experimentId, variantId, visitorId || null, sessionId || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experiment assign error:', error);
    return NextResponse.json({ error: 'Failed to assign experiment' }, { status: 500 });
  }
}
