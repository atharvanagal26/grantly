import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scholarships } from '../src/data/scholarships.js';
import { notices } from '../src/data/notices.js';
import { resources } from '../src/data/resources.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);
const devOrigins = new Set(['http://localhost:3000', 'http://127.0.0.1:3000']);

app.disable('x-powered-by');
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin) {
    const isAllowed = allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && devOrigins.has(origin));
    if (!isAllowed) return res.status(403).json({ error: 'Origin is not allowed.' });
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'grantly-api', mode: process.env.NODE_ENV === 'production' ? 'production' : 'demo' }));
app.get('/api/scholarships', (_req, res) => res.json(scholarships));
app.get('/api/scholarships/:id', (req, res) => {
  const item = scholarships.find((scholarship) => scholarship.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Scholarship not found.' });
  return res.json(item);
});
app.get('/api/notices', (_req, res) => res.json(notices));
app.get('/api/resources', (_req, res) => res.json(resources));
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(root, 'dist');
  app.use(express.static(dist, { index: false, maxAge: '1h' }));
  app.get('/{*path}', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(dist, 'index.html'), (error) => {
      if (error) next(error);
    });
  });
}

app.use((error, _req, res, _next) => {
  console.error('Request error:', error.message);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`GRANTLY API listening on 0.0.0.0:${port}`);
});
