import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET all appointments
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const sessionCookie = request.cookies.get('admin_session');
        if (!sessionCookie) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const result = await pool.query(
            'SELECT * FROM appointments ORDER BY created_at DESC'
        );

        return NextResponse.json({ appointments: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Get appointments error:', error);
        return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 });
    }
}

// POST new appointment
export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, service, preferred_date, preferred_time, message } = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            'INSERT INTO appointments (name, email, phone, service, preferred_date, preferred_time, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, email, phone || null, service || null, preferred_date || null, preferred_time || null, message || null]
        );

        return NextResponse.json({ appointment: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create appointment error:', error);
        return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 });
    }
}
