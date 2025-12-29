import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { createCalendarEvent } from '@/lib/googleCalendar';
import { createFormEntry, ensureDefaultContactForm } from '@/lib/formsV2';
import { createBooking, ensureDefaultResource } from '@/lib/bookingV2';
import { ensureAdminSession } from '@/lib/adminAuth';

// GET all appointments
export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await ensureAdminSession(request);
        if (!session) {
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
        const { name, email, phone, company, budget, service, preferred_date, preferred_time, message } = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Nome e email são obrigatórios' },
                { status: 400 }
            );
        }

        let calendarEventId: string | null = null;
        if (preferred_date && preferred_time) {
            const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || 'America/Sao_Paulo';
            const start = new Date(`${preferred_date}T${preferred_time}:00`);
            const end = new Date(start.getTime() + 30 * 60 * 1000);

            calendarEventId = await createCalendarEvent({
                summary: `Diagnostico - ${name}`,
                description: `Lead: ${name}\nEmail: ${email}\nTelefone: ${phone || '-'}\nEmpresa: ${company || '-'}\nServico: ${service || '-'}\nBudget: ${budget || '-'}\nMensagem: ${message || '-'}`,
                startIso: start.toISOString(),
                endIso: end.toISOString(),
                timeZone: timezone,
            });
        }

        const result = await pool.query(
            `INSERT INTO appointments (name, email, phone, company, budget, service, preferred_date, preferred_time, message, calendar_event_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                name,
                email,
                phone || null,
                company || null,
                budget || null,
                service || null,
                preferred_date || null,
                preferred_time || null,
                message || null,
                calendarEventId
            ]
        );

        if (process.env.BOOKING_V2_ENABLED === 'true') {
            const resourceId = await ensureDefaultResource();
            const formId = await ensureDefaultContactForm();
            const formEntryId = await createFormEntry(
                formId,
                { name, email, phone, company, budget, service, preferred_date, preferred_time, message },
                {
                    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
                    userAgent: request.headers.get('user-agent') || undefined
                }
            );

            if (preferred_date && preferred_time) {
                const startAt = new Date(`${preferred_date}T${preferred_time}:00`);
                const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);
                try {
                    await createBooking({
                        resourceId,
                        formEntryId,
                        startAt,
                        endAt,
                        customerName: name,
                        customerEmail: email,
                        customerPhone: phone || undefined,
                        notes: message || undefined
                    });
                } catch (error: any) {
                    if (error?.message === 'Conflict') {
                        return NextResponse.json({ error: 'Horario indisponivel' }, { status: 409 });
                    }
                    throw error;
                }
            }
        }

        return NextResponse.json({ appointment: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Create appointment error:', error);
        return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 });
    }
}
