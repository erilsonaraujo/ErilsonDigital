import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        // Only allow in development or with secret key
        const secret = request.nextUrl.searchParams.get('secret');

        if (process.env.NODE_ENV === 'production' && secret !== process.env.INIT_DB_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await initDatabase();

        return NextResponse.json(
            { success: true, message: 'Database initialized successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Database init error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize database', details: error.message },
            { status: 500 }
        );
    }
}
