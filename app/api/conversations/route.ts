import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureAdminSession } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
    try {
        const session = await ensureAdminSession(request);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const result = await query('SELECT * FROM conversations ORDER BY created_at DESC');
        return NextResponse.json({ conversations: result.rows });
    } catch (error) {
        console.error('Conversations fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            visitorId,
            visitorName,
            visitorEmail,
            visitorPhone,
            transcript,
            summary,
            isBooking, // Flag if this conversation led to a booking
            bookingData // name, email, phone, service, date, time, message
        } = body;

        // 1. Save conversation
        await query(
            `INSERT INTO conversations (visitor_id, visitor_name, visitor_email, visitor_phone, transcript, summary)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [visitorId, visitorName, visitorEmail, visitorPhone, JSON.stringify(transcript), summary]
        );

        const leadName = bookingData?.name || visitorName || 'Interessado (IA)';
        const leadEmail = bookingData?.email || visitorEmail;
        const leadPhone = bookingData?.phone || visitorPhone;

        // 2. Save lead when we have contact info from the AI chat
        if (leadEmail) {
            const existingLead = await query(
                'SELECT id FROM leads WHERE email = $1 LIMIT 1',
                [leadEmail]
            );

            if (existingLead.rows.length === 0) {
                await query(
                    `INSERT INTO leads (name, email, phone, company, project_type, budget, timeline, message, source)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        leadName,
                        leadEmail,
                        leadPhone || null,
                        bookingData?.company || null,
                        bookingData?.service || null,
                        bookingData?.budget || null,
                        bookingData?.timeline || null,
                        bookingData?.message || summary || null,
                        'ai_chat'
                    ]
                );
            }
        }

        // 3. If it's a booking, save to appointments table
        if (isBooking && bookingData && (bookingData.email || leadEmail)) {
            const appointmentName = bookingData.name || leadName;
            const appointmentEmail = bookingData.email || leadEmail;
            const preferredDate = bookingData.date || null;
            const preferredTime = bookingData.time || null;
            const service = bookingData.service || null;

            if (appointmentName && appointmentEmail) {
                const existingAppointment = await query(
                    `SELECT id FROM appointments
                     WHERE email = $1
                       AND preferred_date IS NOT DISTINCT FROM $2
                       AND preferred_time IS NOT DISTINCT FROM $3
                       AND service IS NOT DISTINCT FROM $4
                     LIMIT 1`,
                    [appointmentEmail, preferredDate, preferredTime, service]
                );

                if (existingAppointment.rows.length === 0) {
                    await query(
                        `INSERT INTO appointments (name, email, phone, company, budget, service, preferred_date, preferred_time, message, status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [
                            appointmentName,
                            appointmentEmail,
                            bookingData.phone || leadPhone || null,
                            bookingData.company || null,
                            bookingData.budget || null,
                            service,
                            preferredDate,
                            preferredTime,
                            `Agendado via IA: ${bookingData.message || ''}`.trim(),
                            'pending'
                        ]
                    );
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Conversation save error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
