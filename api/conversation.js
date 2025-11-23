// /api/conversation.js
// Vercel Serverless Function (Node.js) that receives a PDF via multipart/form-data,
// forwards it to https://file.io (temporary storage) and returns the short link.

export const config = {
    api: {
        bodyParser: false, // We need raw body for forwarding, but Vercel parsing can be tricky.
        // Actually, let's try letting Vercel parse the body if we can, 
        // but for file uploads, standard practice is often to use a library.
        // HOWEVER, to debug the 500 error, let's switch to a simpler approach:
        // We will use 'formidable' but with better error handling and logging.
    },
};

import { IncomingForm } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

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
        // Formidable v3 might return an array for files
        const fileObj = Array.isArray(pdfFile) ? pdfFile[0] : pdfFile;

        if (!fileObj) {
            console.error('No PDF file found in request');
            return res.status(400).json({ error: 'PDF file missing' });
        }

        // Prepare multipart/form-data for file.io
        const formData = new FormData();
        formData.append('file', fs.createReadStream(fileObj.filepath), {
            filename: fileObj.originalFilename || 'conversation.pdf',
            contentType: fileObj.mimetype || 'application/pdf',
        });

        // Upload to file.io
        const uploadResp = await fetch('https://file.io', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders(), // Important: add multipart headers
        });

        if (!uploadResp.ok) {
            const errorText = await uploadResp.text();
            console.error('file.io upstream error:', uploadResp.status, errorText);
            return res.status(502).json({ error: 'Failed to upload to storage provider' });
        }

        const uploadJson = await uploadResp.json();
        if (!uploadJson.success) {
            console.error('file.io success=false:', uploadJson);
            return res.status(502).json({ error: 'Storage provider rejected upload' });
        }

        return res.status(200).json({ shortUrl: uploadJson.link });

    } catch (error) {
        console.error('Server error in /api/conversation:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
