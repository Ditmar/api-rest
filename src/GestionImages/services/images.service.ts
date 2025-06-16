import { Image, images } from '../models/images.model';
import fs from 'fs';
import path from 'path';

const imageFolder = path.resolve(__dirname, '../../../../uploads');
if (!fs.existsSync(imageFolder)) fs.mkdirSync(imageFolder);

export const saveImage = (file: Express.Multer.File): Image => {
  const image: Image = {
    id: Date.now().toString(),
    filename: file.originalname,
    path: path.join(imageFolder, file.originalname),
    mimetype: file.mimetype,
    size: file.size,
  };

  fs.writeFileSync(image.path, file.buffer);
  images.push(image);
  return image;
};

export const getImageById = (id: string): Image | undefined =>
  images.find((img) => img.id === id);

export const deleteImageById = (id: string): boolean => {
  const index = images.findIndex((img) => img.id === id);
  if (index !== -1) {
    const [image] = images.splice(index, 1);
    fs.unlinkSync(image.path);
    return true;
  }
  return false;
};


