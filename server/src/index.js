const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const incidentsRouter = require('./incidents.routes');
const { ensureDirs, loadStore } = require('./incidents.store');

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Ensure upload and data dirs exist
ensureDirs(['uploads', 'data']);

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: false
}));
app.use(express.json());

// Serving static from /uploads (thumbnails)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  etag: true,
  lastModified: true,
  maxAge: '1h'
}));

// Load store (memory + JSON)
const store = loadStore({
  filePath: path.join(process.cwd(), 'data', 'incidents.json')
});

// Routes
app.use('/api/incidents', incidentsRouter({ store }));

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
});
