import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createAdminSession, getClientIp, getSessionCookieOptions, isLoginLocked, registerLoginAttempt } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const ip = getClientIp(request);
        const identifier = email.toLowerCase();

        const locked = await isLoginLocked(identifier, ip);
        if (locked) {
            return NextResponse.json(
                { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
                { status: 429 }
            );
        }

        // Find admin by email
        const result = await pool.query(
            'SELECT * FROM admins WHERE email = $1 LIMIT 1',
            [identifier]
        );

        if (result.rows.length === 0) {
            await registerLoginAttempt(identifier, ip, false);
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        const admin = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password_hash);

        if (!isValid) {
            await registerLoginAttempt(identifier, ip, false);
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        await registerLoginAttempt(identifier, ip, true);
        const { token, expiresAt } = await createAdminSession(admin.id, request);

        // Create session response
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

        response.cookies.set('admin_session', token, getSessionCookieOptions(expiresAt));

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer login' },
            { status: 500 }
        );
    }
}
