import { NextResponse } from 'next/server';

const UMAMI_API_URL = 'https://api.umami.is/v1';
const WEBSITE_ID = '458b37ce-b9e9-4105-aa3b-0f15f0f54d1f';
const API_KEY = 'api_EtFfi8D5pFnDYMkKDhaY1SgsgjT0rdsM';

// Helper to get time ranges
const getTimeRange = (range: string) => {
    const now = Date.now();
    let start = now - 24 * 60 * 60 * 1000; // default 24h

    switch (range) {
        case '7d': start = now - 7 * 24 * 60 * 60 * 1000; break;
        case '30d': start = now - 30 * 24 * 60 * 60 * 1000; break;
        case '24h': start = now - 24 * 60 * 60 * 1000; break;
    }
    return { start, end: now };
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';
    const range = searchParams.get('range') || '24h';
    const { start, end } = getTimeRange(range);

    try {
        let endpoint = '';

        // Debug note: The user says administration is not showing data.
        // We need to ensure we are calling the correct Umami Cloud endpoints.

        switch (type) {
            case 'active':
                // Real-time active visitors
                endpoint = `/websites/${WEBSITE_ID}/active`;
                break;
            case 'metrics':
                const metricName = searchParams.get('metric') || 'url';
                endpoint = `/websites/${WEBSITE_ID}/metrics?startAt=${start}&endAt=${end}&type=${metricName}`;
                break;
            case 'pageviews':
                // Time-series pageviews
                endpoint = `/websites/${WEBSITE_ID}/pageviews?startAt=${start}&endAt=${end}&unit=hour`;
                break;
            case 'stats':
            default:
                // High level stats (visitors, views, bounce rate, average time)
                endpoint = `/websites/${WEBSITE_ID}/stats?startAt=${start}&endAt=${end}`;
                break;
        }

        console.log(`[Umami Proxy] Fetching: ${UMAMI_API_URL}${endpoint}`);

        const response = await fetch(`${UMAMI_API_URL}${endpoint}`, {
            headers: {
                'x-umami-api-key': API_KEY,
                'Accept': 'application/json',
            },
            cache: 'no-store' // Ensure we don't cache stale analytics
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Umami Proxy] API Error: ${response.status} - ${errorText}`);
            return NextResponse.json({
                error: `Umami API Error: ${response.status}`,
                details: errorText
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error(`[Umami Proxy] Internal Error:`, err);
        return NextResponse.json({ error: 'Failed to fetch from Umami' }, { status: 500 });
    }
}
