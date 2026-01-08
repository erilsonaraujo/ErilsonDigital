import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createFormEntry, ensureDefaultContactForm } from '@/lib/formsV2';
import { ensureAdminSession } from '@/lib/adminAuth';
import { verifyRecaptcha } from '@/lib/recaptcha';

// GET all leads
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await ensureAdminSession(request);
        if (!session) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const result = await query(
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
        const { name, email, phone, company, projectType, budget, timeline, message, source, recaptchaToken } = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            );
        }

        const recaptcha = await verifyRecaptcha(recaptchaToken, request);
        if (!recaptcha.ok) {
            return NextResponse.json({ error: 'Recaptcha inválido' }, { status: 403 });
        }

        const result = await query(
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

        if (process.env.FORMS_V2_ENABLED === 'true') {
            const formId = await ensureDefaultContactForm();
            await createFormEntry(
                formId,
                { name, email, phone, company, projectType, budget, timeline, message, source },
                {
                    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
                    userAgent: request.headers.get('user-agent') || undefined
                }
            );
        }

        return NextResponse.json({ lead: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create lead error:', error);
        return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
    }
}
