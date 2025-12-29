import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

// GET all leads
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await ensureAdminSession(request);
        if (!session) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const result = await pool.query(
            'SELECT * FROM leads ORDER BY created_at DESC'
        );

        return NextResponse.json({ leads: result.rows }, { status: 200 });
    } catch (error) {
        console.error('Get leads error:', error);
        return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
    }
}

// POST new lead
export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, company, projectType, budget, timeline, message, source } = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `INSERT INTO leads (name, email, phone, company, project_type, budget, timeline, message, source)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                name,
                email,
                phone || null,
                company || null,
                projectType || null,
                budget || null,
                timeline || null,
                message || null,
                source || 'website'
            ]
        );

        return NextResponse.json({ lead: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create lead error:', error);
        return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
    }
}
