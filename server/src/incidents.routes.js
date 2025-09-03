const express = require('express');
const { upload } = require('./upload');

const VALID_TYPES = new Set(['structure', 'vehicle', 'wildfire']);

module.exports = function incidentsRouter({ store }) {
  const router = express.Router();

  // GET /api/incidents → list (latest first)
  router.get('/', (req, res) => {
    res.json(store.all());
  });

  // POST /api/incidents → create (multipart)
  router.post('/',
    upload.single('image'),
    (req, res) => {
      try {
        const { title, description, incident_type, location } = req.body;

        if (!title || !incident_type) {
          return res.status(400).json({ error: 'title and incident_type are required' });
        }
        const type = String(incident_type).toLowerCase();
        if (!VALID_TYPES.has(type)) {
          return res.status(400).json({ error: 'invalid incident_type' });
        }

        let image_url = null;
        if (req.file && req.file.filename) {
          image_url = `/uploads/${req.file.filename}`;
        }

        const created = store.create({
          title: String(title),
          description: description ? String(description) : null,
          incident_type: type,
          location: location ? String(location) : null,
          image_url
        });

        return res.status(201).json(created);
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'internal_error' });
      }
    }
  );

  return router;
};
