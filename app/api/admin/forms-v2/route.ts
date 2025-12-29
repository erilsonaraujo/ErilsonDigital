import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await query('SELECT * FROM forms_v2 ORDER BY created_at DESC');
  const forms = result.rows.map((row) => ({
    ...row,
    schema: typeof row.schema === 'string' ? JSON.parse(row.schema) : row.schema
  }));
  return NextResponse.json({ forms });
}

export async function POST(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, slug, schema, status } = body || {};
  if (!name || !slug || !schema) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `INSERT INTO forms_v2 (name, slug, status, schema)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, slug, status || 'active', JSON.stringify(schema)]
  );
  return NextResponse.json({ form: result.rows[0] });
}

export async function PUT(request: NextRequest) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, name, slug, schema, status } = body || {};
  if (!id || !name || !slug || !schema) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const result = await query(
    `UPDATE forms_v2
     SET name = $1, slug = $2, status = $3, schema = $4, version = version + 1
     WHERE id = $5
     RETURNING *`,
    [name, slug, status || 'active', JSON.stringify(schema), id]
  );
  return NextResponse.json({ form: result.rows[0] });
}
