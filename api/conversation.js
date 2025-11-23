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
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm({ keepExtensions: true });
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        const pdfFile = data.files.pdf;
        const fileObj = Array.isArray(pdfFile) ? pdfFile[0] : pdfFile;

        if (!fileObj) {
            return res.status(400).json({ error: 'PDF file missing' });
        }

        // Read file buffer
        const fileBuffer = fs.readFileSync(fileObj.filepath);

        // Upload to file.io using simple POST (not multipart) if possible, 
        // OR construct multipart manually with boundary if node-fetch/form-data is flaky.
        // file.io supports raw body upload if you just want to store text, but for PDF we need multipart.
        // Let's try a different approach: use 'FormData' from 'node-fetch' (if available) or 'form-data' package.
        // We will use the 'form-data' package which is robust.

        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('file', fileBuffer, {
            filename: 'conversation.pdf',
            contentType: 'application/pdf',
        });

        const uploadResp = await fetch('https://file.io', {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });

        if (!uploadResp.ok) {
            const txt = await uploadResp.text();
            console.error('file.io error:', txt);
            return res.status(502).json({ error: 'Upstream upload failed' });
        }

        const json = await uploadResp.json();
        return res.status(200).json({ shortUrl: json.link });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
