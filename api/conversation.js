// /api/conversation.js
// Vercel Serverless Function (Node.js) that receives a PDF via multipart/form-data,
// forwards it to https://file.io (temporary storage) and returns the short link.

import formidable from 'formidable';
import fs from 'fs/promises';
import FormData from 'form-data';

export const config = {
    api: {
        bodyParser: false,
        maxDuration: 60, // Increase timeout for file upload
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
        // Parse the multipart form data
        const form = formidable({
            maxFileSize: 10 * 1024 * 1024, // 10MB max
            keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);
        console.log('[API] Form parsed successfully');

        // Get the PDF file
        const pdfFile = files.pdf;
        const fileObj = Array.isArray(pdfFile) ? pdfFile[0] : pdfFile;

        if (!fileObj) {
            console.error('[API] No PDF file found in request');
            return res.status(400).json({ error: 'PDF file missing' });
        }

        console.log('[API] PDF file received:', fileObj.originalFilename, 'Size:', fileObj.size);

        // Read file buffer from the temporary path
        const fileBuffer = await fs.readFile(fileObj.filepath);
        console.log('[API] File buffer read, size:', fileBuffer.length);

        // Clean up the temporary file
        try {
            await fs.unlink(fileObj.filepath);
        } catch (unlinkError) {
            console.warn('[API] Could not delete temp file:', unlinkError.message);
        }

        // Upload to file.io using form-data
        const uploadForm = new FormData();
        uploadForm.append('file', fileBuffer, {
            filename: fileObj.originalFilename || 'conversation.pdf',
            contentType: 'application/pdf',
        });

        console.log('[API] Uploading to file.io...');

        const uploadResp = await fetch('https://file.io', {
            method: 'POST',
            body: uploadForm,
            headers: uploadForm.getHeaders(),
        });

        console.log('[API] file.io response status:', uploadResp.status);

        // Check content type before parsing
        const contentType = uploadResp.headers.get('content-type');
        console.log('[API] file.io content-type:', contentType);

        if (!uploadResp.ok) {
            const txt = await uploadResp.text();
            console.error('[API] file.io error response:', txt);
            return res.status(502).json({
                error: 'Upstream upload failed',
                details: txt,
                status: uploadResp.status
            });
        }

        // Check if response is JSON
        if (!contentType || !contentType.includes('application/json')) {
            const txt = await uploadResp.text();
            console.error('[API] file.io returned non-JSON response:', txt.substring(0, 500));
            return res.status(502).json({
                error: 'Upload service returned invalid response',
                details: 'Expected JSON but got: ' + contentType,
                preview: txt.substring(0, 200)
            });
        }

        const json = await uploadResp.json();
        console.log('[API] file.io success:', json);

        if (!json.success || !json.link) {
            console.error('[API] file.io returned unsuccessful response:', json);
            return res.status(502).json({
                error: 'Upload service returned error',
                details: json
            });
        }

        console.log('[API] Returning short URL:', json.link);
        return res.status(200).json({ shortUrl: json.link });

    } catch (error) {
        console.error('[API] Unhandled error:', error);
        console.error('[API] Error stack:', error.stack);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            type: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
