import { NextResponse } from 'next/server';

const UMAMI_API_URL = 'https://api.umami.is/v1';
const WEBSITE_ID = '458b37ce-b9e9-4105-aa3b-0f15f0f54d1f';
const API_KEY = 'api_EtFfi8D5pFnDYMkKDhaY1SgsgjT0rdsM';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats'; // stats, active, metrics

    // Auth check (simplified, usually you'd check session/cookies)
    // For now, let's assume if they reach this they are authorized via the admin session

    try {
        let endpoint = '';
        const now = Date.now();
        const start = now - 24 * 60 * 60 * 1000; // Last 24h by default

        switch (type) {
            case 'active':
                endpoint = `/websites/${WEBSITE_ID}/active`;
                break;
            case 'metrics':
                const metricName = searchParams.get('metric') || 'url';
                endpoint = `/websites/${WEBSITE_ID}/metrics?startAt=${start}&endAt=${now}&type=${metricName}`;
                break;
            case 'stats':
            default:
                endpoint = `/websites/${WEBSITE_ID}/stats?startAt=${start}&endAt=${now}`;
                break;
        }

        const response = await fetch(`${UMAMI_API_URL}${endpoint}`, {
            headers: {
                'x-umami-api-key': API_KEY,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ error: `Umami API Error: ${error}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch from Umami' }, { status: 500 });
    }
}
