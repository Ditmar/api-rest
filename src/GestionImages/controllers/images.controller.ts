import { Request, Response } from 'express';
import {
  saveImage,
  getImageById,
  deleteImageById,
} from '../services/images.service';

export const uploadImage = (req: Request, res: Response): void => {
  const file = req.file as Express.Multer.File;

  if (!file) {
    res.status(400).json({ message: 'No se envió archivo' });
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    res.status(400).json({ message: 'Tipo de archivo inválido' });
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    res.status(400).json({ message: 'Archivo demasiado grande (max 5MB)' });
    return;
  }

  const image = saveImage(file);
  res.status(201).json(image);
};

export const getImage = (req: Request, res: Response): void => {
  const image = getImageById(req.params.id);
  if (!image) {
    res.status(404).json({ message: 'Imagen no encontrada' });
    return;
  }

  res.sendFile(image.path);
};

export const deleteImage = (req: Request, res: Response): void => {
  const deleted = deleteImageById(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Imagen no encontrada' });
    return;
  }

  res.json({ message: 'Imagen eliminada' });
};

