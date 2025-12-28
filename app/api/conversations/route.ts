import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

        // 2. If it's a booking, save to appointments table
        if (isBooking && bookingData) {
            await query(
                `INSERT INTO appointments (name, email, phone, service, preferred_date, preferred_time, message, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    bookingData.name,
                    bookingData.email,
                    bookingData.phone,
                    bookingData.service,
                    bookingData.date,
                    bookingData.time,
                    `Agendado via IA: ${bookingData.message || ''}`,
                    'pending'
                ]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Conversation save error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
