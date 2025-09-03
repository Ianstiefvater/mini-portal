const path = require('path');
const multer = require('multer');
const { nanoid } = require('nanoid');

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => {
    // usar ext de mimetype u original
    let ext = path.extname(file.originalname || '').toLowerCase();
    if (!ext) {
      // fallback simple por mimetype
      if (file.mimetype === 'image/jpeg') ext = '.jpg';
      else if (file.mimetype === 'image/png') ext = '.png';
      else if (file.mimetype === 'image/webp') ext = '.webp';
      else ext = '';
    }
    const name = `${Date.now()}-${nanoid()}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED.has(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_BYTES }
});

module.exports = { upload };
