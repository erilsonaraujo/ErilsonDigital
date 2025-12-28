import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { path, referrer, visitorId } = body;

        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Vercel provides geo headers
        const country = headersList.get('x-vercel-ip-country') || 'unknown';
        const city = headersList.get('x-vercel-ip-city') || 'unknown';

        // Basic User Agent Parsing (Simple version)
        let device = 'desktop';
        if (/mobile/i.test(userAgent)) device = 'mobile';
        if (/tablet/i.test(userAgent)) device = 'tablet';

        await query(
            `INSERT INTO analytics (visitor_id, path, referrer, ip, user_agent, country, city, device)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [visitorId, path, referrer, ip, userAgent, country, city, device]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
