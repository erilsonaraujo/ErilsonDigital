import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

const VALID_STATUS = ['pending', 'confirmed', 'completed', 'cancelled'];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body?.status;

  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
  }

  const result = await pool.query(
    'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ appointment: result.rows[0] }, { status: 200 });
}
