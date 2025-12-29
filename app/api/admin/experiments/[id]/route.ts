import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await ensureAdminSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await query('DELETE FROM analytics_experiments WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Experiment delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
