import { Router } from 'express';
import { AuthorsController } from '../controllers/authors.controller';

export const authorRoute = () => {
    const router = Router();
    const authorsController = new AuthorsController();

    router.get('/', authorsController.get.bind(authorsController));
    router.post('/', authorsController.post.bind(authorsController));
    router.delete('/:id', authorsController.delete.bind(authorsController));
    router.put('/:id', authorsController.put.bind(authorsController));
    router.get('/:id', authorsController.getById.bind(authorsController));

    return router;
}