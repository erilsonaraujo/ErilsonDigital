import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('admin_session');

        if (!sessionCookie) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        const adminId = sessionCookie.value;

        // Verify admin exists
        const result = await client.query(
            'SELECT id, email FROM admins WHERE id = $1 LIMIT 1',
            [adminId]
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
