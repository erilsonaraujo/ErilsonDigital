import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, experimentId, variantId, goal, value } = body || {};

    if (!experimentId || !variantId || !goal) {
      return NextResponse.json({ error: 'experimentId, variantId and goal required' }, { status: 400 });
    }

    await query(
      `INSERT INTO analytics_experiment_conversions (experiment_id, variant_id, visitor_id, session_id, goal, value)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [experimentId, variantId, visitorId || null, sessionId || null, goal, value || 0]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experiment conversion error:', error);
    return NextResponse.json({ error: 'Failed to convert experiment' }, { status: 500 });
  }
}
