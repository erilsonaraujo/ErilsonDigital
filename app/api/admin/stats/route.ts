import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // Auth check
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get stats
        const leadsCount = await query('SELECT COUNT(*) FROM leads');
        const appointmentsCount = await query('SELECT COUNT(*) FROM appointments');
        const visitorsCount = await query('SELECT COUNT(DISTINCT visitor_id) FROM analytics');
        const viewsCount = await query('SELECT COUNT(*) FROM analytics');
        const conversationsCount = await query('SELECT COUNT(*) FROM conversations');

        // Recent activity stats (last 24h)
        const recentLeads = await query('SELECT COUNT(*) FROM leads WHERE created_at > NOW() - INTERVAL \'24 hours\'');

        return NextResponse.json({
            stats: {
                totalLeads: parseInt(leadsCount.rows[0].count),
                totalAppointments: parseInt(appointmentsCount.rows[0].count),
                uniqueVisitors: parseInt(visitorsCount.rows[0].count),
                pageViews: parseInt(viewsCount.rows[0].count),
                totalConversations: parseInt(conversationsCount.rows[0].count),
                recentLeads: parseInt(recentLeads.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
