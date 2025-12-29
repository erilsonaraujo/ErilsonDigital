import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
    const sessionCookie = request.cookies.get('admin_session');
    if (sessionCookie) {
        await clearAdminSession(sessionCookie.value);
    }
    const response = NextResponse.json(
        { success: true },
        { status: 200 }
    );

    // Clear session cookie
    response.cookies.delete('admin_session');

    return response;
}
