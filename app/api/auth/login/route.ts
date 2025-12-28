import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/db';
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

        // Find admin by email
        const result = await client.query(
            'SELECT * FROM admins WHERE email = $1 LIMIT 1',
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        const admin = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Create session (simplified - in production use JWT or proper session management)
        const response = NextResponse.json(
            {
                success: true,
                admin: {
                    id: admin.id,
                    email: admin.email
                }
            },
            { status: 200 }
        );

        // Set session cookie
        response.cookies.set('admin_session', admin.id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer login' },
            { status: 500 }
        );
    }
}
