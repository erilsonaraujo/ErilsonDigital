import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.cookies.get('admin_session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const result = await query(
            `SELECT a.email
             FROM admin_sessions s
             JOIN admins a ON s.admin_id = a.id
             WHERE s.session_token = $1 AND s.expires_at > NOW()`,
            [sessionToken]
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
