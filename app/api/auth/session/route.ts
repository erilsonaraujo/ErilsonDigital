import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
    try {
        const session = await ensureAdminSession(request);
        if (!session) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        // Verify admin exists
        const result = await pool.query(
            'SELECT id, email FROM admins WHERE id = $1 LIMIT 1',
            [session.admin_id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                authenticated: true,
                admin: result.rows[0]
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        );
    }
}
