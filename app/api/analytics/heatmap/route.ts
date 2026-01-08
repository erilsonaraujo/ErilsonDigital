import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorId,
      sessionId,
      path,
      eventType,
      xPercent,
      yPercent,
      viewportW,
      viewportH,
      elementTag,
      elementLabel
    } = body || {};

    if (!path || !eventType) {
      return NextResponse.json({ error: 'Path and eventType required' }, { status: 400 });
    }

    await query(
      `INSERT INTO analytics_heatmap_points
        (visitor_id, session_id, path, event_type, x_percent, y_percent, viewport_w, viewport_h, element_tag, element_label)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        visitorId || null,
        sessionId || null,
        path,
        eventType,
        xPercent ?? null,
        yPercent ?? null,
        viewportW ?? null,
        viewportH ?? null,
        elementTag || null,
        elementLabel || null
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Heatmap track error:', error);
    return NextResponse.json({ error: 'Failed to track heatmap' }, { status: 500 });
  }
}
