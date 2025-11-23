import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

const app = express();
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

app.post('/api/conversation', upload.single('pdf'), (req, res) => {
    const summary = req.body.summary || '';
    const id = nanoid(8);
    const fileName = req.file?.filename;
    const entry = { summary, filePath: `/uploads/${fileName}` };
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    db[id] = entry;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    const shortUrl = `${req.protocol}://${req.get('host')}/c/${id}`;
    res.json({ shortUrl });
});

app.get('/c/:id', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const entry = db[req.params.id];
    if (!entry) return res.status(404).send('Not found');
    res.redirect(entry.filePath);
});

// Serve static files (including uploaded PDFs)
app.use(express.static('public'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
