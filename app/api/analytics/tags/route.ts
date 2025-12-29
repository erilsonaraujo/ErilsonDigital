import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT id, name, trigger_type, trigger_match, match_type, tag_type, tag_config
       FROM analytics_tags
       WHERE status = 'active'
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ tags: result.rows });
  } catch (error) {
    console.error('Tags public error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
