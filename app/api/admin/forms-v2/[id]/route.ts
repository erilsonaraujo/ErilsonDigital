import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const result = await query('SELECT * FROM forms_v2 WHERE id = $1', [id]);
  if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const form = result.rows[0];
  return NextResponse.json({
    form: {
      ...form,
      schema: typeof form.schema === 'string' ? JSON.parse(form.schema) : form.schema
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await query('DELETE FROM forms_v2 WHERE id = $1', [id]);
  return NextResponse.json({ success: true });
}
