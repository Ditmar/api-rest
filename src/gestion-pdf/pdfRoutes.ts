import { Router } from 'express';
import { pdfController } from './controller';
import { BaseCollectionPdf } from '../data-collection/base-collection/baseCollection';

const pdfWrapper = (pdfCollection: BaseCollectionPdf) => {
    const { uploadFile, getFile, deleteFile, getDownloadUrl } = pdfController(pdfCollection);
    const pdfRouter = Router();

    pdfRouter.post('/upload', ...uploadFile); 
    pdfRouter.get('/:id', getFile);           
    pdfRouter.delete('/:id', deleteFile);     
    pdfRouter.get('/:id/download-url', getDownloadUrl); 

    return pdfRouter;
};

export { pdfWrapper };