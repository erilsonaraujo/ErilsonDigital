import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        // Only allow with secret key
        const { secret, email, password } = await request.json();

        if (secret !== process.env.INIT_DB_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await client.query(
            'INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = $2',
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
