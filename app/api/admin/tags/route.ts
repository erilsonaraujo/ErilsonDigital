import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await query('SELECT * FROM analytics_tags ORDER BY created_at DESC');
    return NextResponse.json({ tags: result.rows });
  } catch (error) {
    console.error('Tags list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      name,
      status = 'active',
      triggerType,
      triggerMatch,
      matchType = 'contains',
      tagType,
      tagConfig
    } = body || {};

    if (!name || !triggerType || !tagType) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO analytics_tags (name, status, trigger_type, trigger_match, match_type, tag_type, tag_config)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, status, triggerType, triggerMatch || null, matchType, tagType, tagConfig ? JSON.stringify(tagConfig) : null]
    );

    return NextResponse.json({ tag: result.rows[0] });
  } catch (error) {
    console.error('Tags create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await query('DELETE FROM analytics_tags WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tags delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
