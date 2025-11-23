import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads directory exists BEFORE multer config
const UPLOADS_DIR = path.resolve('public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({ dest: 'public/uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

const DB_PATH = path.resolve('data/conversations.json');
// Ensure data folder exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
// Initialise DB file if missing
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}), 'utf8');
}

// CSP Middleware
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com; " +
        "connect-src 'self' https://calendly.com; " +
        "frame-src 'self' https://calendly.com; " +
        "img-src 'self' data: blob:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com;"
    );
    next();
});

app.post('/api/conversation', (req, res, next) => {
    console.log('Received POST request to /api/conversation');
    upload.single('pdf')(req, res, (err) => {
        if (err) {
            console.error('Multer Middleware Error:', err);
            fs.appendFileSync('server_error.log', `Multer Error: ${err.message}\n`);
            return res.status(500).json({ error: 'Upload failed', details: err.message });
        }
        next();
    });
}, (req, res) => {
    try {
        console.log('File uploaded successfully, processing...');
        if (!req.file) {
            console.error('No file in req.file');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const summary = req.body.summary || '';
        const id = nanoid(8);
        const fileName = req.file.filename;
        const entry = { summary, filePath: `/uploads/${fileName}` };

        const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        db[id] = entry;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

        const shortUrl = `${req.protocol}://${req.get('host')}/c/${id}`;
        console.log('Generated short URL:', shortUrl);
        res.json({ shortUrl });
    } catch (error) {
        const errorMsg = `Error in /api/conversation handler: ${error.message}\nStack: ${error.stack}\n`;
        console.error(errorMsg);
        fs.appendFileSync('server_error.log', errorMsg); // Log to file
        res.status(500).json({ error: error.message, details: 'Check server_error.log for more info' });
    }
});

app.get('/c/:id', (req, res) => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return res.status(404).send('Not found');
        }
        const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        const entry = db[req.params.id];
        if (!entry) return res.status(404).send('Not found');
        res.redirect(entry.filePath);
    } catch (error) {
        console.error('Error in /c/:id:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve static files (including uploaded PDFs)
app.use(express.static('public'));
// Serve built front‑end (Vite output)
app.use(express.static('dist'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    fs.appendFileSync('server_error.log', `Global Error: ${err.message}\nStack: ${err.stack}\n`);
    res.status(500).json({ error: err.message, type: 'GlobalError' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
