// /api/conversation.js
// Vercel Serverless Function (Node.js) that receives a PDF via multipart/form-data,
// forwards it to https://file.io (temporary storage) and returns the short link.

import { IncomingForm } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // let formidable handle parsing
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const form = new IncomingForm({ keepExtensions: true, maxFileSize: 5 * 1024 * 1024 });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parse error:', err);
            return res.status(400).json({ error: 'Invalid form data' });
        }
        const pdfFile = files.pdf;
        if (!pdfFile) {
            return res.status(400).json({ error: 'PDF file missing' });
        }

        try {
            // Prepare multipart/form-data for file.io
            const formData = new FormData();
            formData.append('file', fs.createReadStream(pdfFile.filepath), {
                filename: pdfFile.originalFilename,
                contentType: pdfFile.mimetype,
            });
            // Optional: you can set an expiration (default 2 weeks). Here we keep default.

            const uploadResp = await fetch('https://file.io', {
                method: 'POST',
                body: formData,
            });
            const uploadJson = await uploadResp.json();
            if (!uploadResp.ok || uploadJson.success === false) {
                console.error('file.io error:', uploadJson);
                return res.status(500).json({ error: 'Failed to upload PDF to storage' });
            }
            // file.io returns a short link in the field "link"
            const shortUrl = uploadJson.link;
            return res.status(200).json({ shortUrl });
        } catch (e) {
            console.error('Upload error:', e);
            return res.status(500).json({ error: 'Upload failed' });
        }
    });
}
