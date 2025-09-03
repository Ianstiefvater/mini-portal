const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

function ensureDirs(dirList) {
  for (const d of dirList) {
    const p = path.join(process.cwd(), d);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }
}

function loadStore({ filePath }) {
  let items = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      items = JSON.parse(raw);
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }
  }

  // Simple persistence in JSON
  const saveToDisk = () => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing incidents.json:', e.message);
    }
  };

  return {
    all() {
      // latest first
      return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    create({ title, description, incident_type, location, image_url }) {
      const incident = {
        id: nanoid(),
        title,
        description: description || null,
        incident_type,
        location: location || null,
        image_url: image_url || null,
        created_at: new Date().toISOString()
      };
      items.push(incident);
      saveToDisk(); // guardar en JSON para sobrevivir reinicios
      return incident;
    }
  };
}

module.exports = { ensureDirs, loadStore };
