import { Request, Response } from 'express';
import { BaseCollectionPdf } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';
import multer from 'multer';
import { ConfigSingleton } from '../config/config';

const pdfController = (pdfCollection: BaseCollectionPdf) => {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: (ConfigSingleton.getInstance().MAX_FILE_SIZE || 5 * 1024 * 1024) // 5MB por defecto
        }
    });

    const uploadFile = [
    upload.single('pdfFile'),
    async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'No file uploaded' });
                return;
            }

            const file = {
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                buffer: req.file.buffer,
                uploadedAt: new Date()
            };

            const result:any = await pdfCollection.post(file);
            res.status(HttpStatus.CREATED).json({ message: 'File uploaded', id: result.insertedId });
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message || 'Unexpected error'
            });
        }
    }
];


    const getFile = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const file = await pdfCollection.get(id) as any;

            response.setHeader('Content-Type', file.contentType);
            response.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
            response.send(file.buffer);
        } catch (error: any) {
            response.status(HttpStatus.NOT_FOUND).json({
                error: error.message
            });
        }
    };

    const deleteFile = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            await pdfCollection.delete(id);
            response.status(HttpStatus.OK).json({
                message: 'File deleted successfully'
            });
        } catch (error: any) {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message
            });
        }
    };

    const getDownloadUrl = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const downloadUrl = await pdfCollection.getDownloadUrl(id);
            response.status(HttpStatus.OK).json({ downloadUrl });
        } catch (error: any) {
            response.status(HttpStatus.NOT_FOUND).json({
                error: error.message
            });
        }
    };

    return { uploadFile, getFile, deleteFile, getDownloadUrl };
};

export { pdfController };