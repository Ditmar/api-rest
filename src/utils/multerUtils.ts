import path from 'path';

export function generateUniqueFilename(
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void
): void {
  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const filename = `${timestamp}${ext}`;
  cb(null, filename);
}
