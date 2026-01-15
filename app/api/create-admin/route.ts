import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const setupToken = process.env.ADMIN_SETUP_TOKEN;
        if (!setupToken) {
            return NextResponse.json(
                { error: 'Admin setup disabled' },
                { status: 403 }
            );
        }

        const providedToken =
            request.headers.get('x-admin-setup-token') ||
            request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

        if (!providedToken || providedToken !== setupToken) {
            return NextResponse.json(
                { error: 'Not authorized' },
                { status: 401 }
            );
        }

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const identifier = String(email).toLowerCase().trim();
        const passwordHash = await bcrypt.hash(String(password), 12);

        await query(
            `INSERT INTO admins (email, password_hash)
             VALUES ($1, $2)
             ON CONFLICT (email)
             DO UPDATE SET password_hash = EXCLUDED.password_hash`,
            [identifier, passwordHash]
        );

        return NextResponse.json(
            { success: true, message: 'Admin user created/updated successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Create admin error:', error);
        return NextResponse.json(
            { error: 'Failed to create admin', details: error.message },
            { status: 500 }
        );
    }
}
