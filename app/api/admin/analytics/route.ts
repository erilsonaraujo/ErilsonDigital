import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // Auth check
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get analytics data ordered by date
        const result = await query(
            'SELECT * FROM analytics ORDER BY created_at DESC LIMIT 500'
        );

        return NextResponse.json({ analytics: result.rows });
    } catch (error) {
        console.error('Admin analytics error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
