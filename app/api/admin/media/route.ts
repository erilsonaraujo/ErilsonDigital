import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const mediaRes = await query(
      `SELECT COALESCE(media_label, '(not set)') AS media,
              COUNT(*) FILTER (WHERE action = 'play') AS plays,
              COUNT(*) FILTER (WHERE action = 'pause') AS pauses,
              COUNT(*) FILTER (WHERE action = 'ended') AS ended,
              COUNT(*) AS events
       FROM analytics_media_events
       GROUP BY media
       ORDER BY events DESC
       LIMIT 50`
    );

    return NextResponse.json({ media: mediaRes.rows });
  } catch (error) {
    console.error('Media analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
