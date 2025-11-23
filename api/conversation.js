// /api/conversation.js
// Vercel Serverless Function (Node.js) that receives a PDF via multipart/form-data,
// forwards it to https://file.io (temporary storage) and returns the short link.

import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    console.log('[API] Received POST request to /api/conversation');

    try {
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm({ keepExtensions: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('[API] Formidable parse error:', err);
                    return reject(err);
                }
                console.log('[API] Form parsed successfully');
                resolve({ fields, files });
            });
        });

        const pdfFile = data.files.pdf;
        const fileObj = Array.isArray(pdfFile) ? pdfFile[0] : pdfFile;

        if (!fileObj) {
            console.error('[API] No PDF file found in request');
            return res.status(400).json({ error: 'PDF file missing' });
        }

        console.log('[API] PDF file received:', fileObj.originalFilename, 'Size:', fileObj.size);

        // Read file buffer
        const fileBuffer = fs.readFileSync(fileObj.filepath);
        console.log('[API] File buffer read, size:', fileBuffer.length);

        // Upload to file.io using form-data
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('file', fileBuffer, {
            filename: 'conversation.pdf',
            contentType: 'application/pdf',
        });

        console.log('[API] Uploading to file.io...');
        const uploadResp = await fetch('https://file.io', {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });

        console.log('[API] file.io response status:', uploadResp.status);

        if (!uploadResp.ok) {
            const txt = await uploadResp.text();
            console.error('[API] file.io error response:', txt);
            return res.status(502).json({
                error: 'Upstream upload failed',
                details: txt,
                status: uploadResp.status
            });
        }

        const json = await uploadResp.json();
        console.log('[API] file.io success:', json);

        if (!json.success || !json.link) {
            console.error('[API] file.io returned unsuccessful response:', json);
            return res.status(502).json({ error: 'Upload service returned error', details: json });
        }

        return res.status(200).json({ shortUrl: json.link });

    } catch (error) {
        console.error('[API] Unhandled error:', error);
        console.error('[API] Error stack:', error.stack);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
