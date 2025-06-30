import { Router } from 'express';
import { BibliographyController } from '../controllers/bibliography.controller';

export const bibliographyRoute = () => {
    const router = Router();
    const bibliographyController = new BibliographyController();

    router.get('/', bibliographyController.get.bind(bibliographyController));
    router.post('/', bibliographyController.post.bind(bibliographyController));
    router.delete('/:id', bibliographyController.delete.bind(bibliographyController));
    router.put('/:id', bibliographyController.put.bind(bibliographyController));
    router.get('/:id', bibliographyController.getById.bind(bibliographyController));

    return router;
}