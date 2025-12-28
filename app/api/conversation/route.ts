import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log('[API] Received POST request to /api/conversation');

    try {
        const formData = await req.formData();
        const file = formData.get('pdf') as File | null;

        if (!file) {
            console.error('[API] No PDF file found in request');
            return NextResponse.json({ error: 'PDF file missing' }, { status: 400 });
        }

        console.log('[API] PDF file received:', file.name, 'Size:', file.size);

        // Convert File to Buffer/Blob for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to 0x0.st
        const uploadForm = new FormData();
        uploadForm.append('file', new Blob([buffer]), file.name || 'conversation.pdf');

        console.log('[API] Uploading to 0x0.st...');

        const uploadResp = await fetch('https://0x0.st', {
            method: 'POST',
            body: uploadForm,
            // Header 'Content-Type' is set automatically by fetch when body is FormData
        });

        console.log('[API] 0x0.st response status:', uploadResp.status);

        if (!uploadResp.ok) {
            const txt = await uploadResp.text();
            console.error('[API] 0x0.st error response:', txt);
            // 0x0.st sometimes returns 502 or 413
            return NextResponse.json({
                error: 'Upstream upload failed',
                details: txt,
                status: uploadResp.status
            }, { status: 502 });
        }

        const shortUrl = (await uploadResp.text()).trim();
        console.log('[API] 0x0.st returned URL:', shortUrl);

        if (!shortUrl || !shortUrl.startsWith('http')) {
            console.error('[API] 0x0.st returned invalid URL:', shortUrl);
            return NextResponse.json({
                error: 'Upload service returned invalid URL',
                details: shortUrl
            }, { status: 502 });
        }

        return NextResponse.json({ shortUrl }, { status: 200 });

    } catch (error: any) {
        console.error('[API] Unhandled error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message
        }, { status: 500 });
    }
}
