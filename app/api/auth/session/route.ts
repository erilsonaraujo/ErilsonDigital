import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

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
        const result = await sql`
      SELECT id, email FROM admins WHERE id = ${adminId} LIMIT 1
    `;

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
