import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET all leads
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const sessionCookie = request.cookies.get('admin_session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const result = await sql`
      SELECT * FROM leads ORDER BY created_at DESC
    `;

        return NextResponse.json({ leads: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Get leads error:', error);
        return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
    }
}

// POST new lead
export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, message, source } = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            );
        }

        const result = await sql`
      INSERT INTO leads (name, email, phone, message, source)
      VALUES (${name}, ${email}, ${phone || null}, ${message || null}, ${source || 'website'})
      RETURNING *
    `;

        return NextResponse.json({ lead: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create lead error:', error);
        return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
    }
}
