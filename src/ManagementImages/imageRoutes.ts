import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadImage,
  getImage,
  deleteImage,
} from './controllers/images.controller';

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_, file, cb) => {
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetypeOK = file.mimetype.startsWith('image/');

    if (!allowedExt.includes(ext) || !mimetypeOK) {
      return cb(null, false);
    }
    cb(null, true);
  },
});

export function imageWrapper() {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    upload.single('image')(req, res, err => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({
          message: 'Solo se permiten imágenes JPG, JPEG, PNG o GIF, y tamaño máximo 5 MB.',
        });
      }

      next(); 
    });
  }, uploadImage);

  router.get('/:id', getImage);
  router.delete('/:id', deleteImage);

  return router;
}


