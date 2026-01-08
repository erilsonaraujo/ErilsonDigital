import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await query(
            'INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
            [email, passwordHash]
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
