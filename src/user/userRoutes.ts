import { Router, Request, Response, NextFunction } from 'express';
import { userController } from './controller';

const router = Router();

// Wrapper para manejar async/await y errores con logs
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  console.log(`🚦 Incoming ${req.method} request to ${req.originalUrl}`);
  Promise.resolve(fn(req, res, next))
    .then(() => {
      console.log(`✅ Handled ${req.method} request to ${req.originalUrl}`);
    })
    .catch((error) => {
      console.error(`❌ Error handling ${req.method} request to ${req.originalUrl}:`, error);
      next(error);
    });
};

router.post('/articles', asyncHandler(userController.createArticle));

router.get('/', asyncHandler(userController.get));
router.get('/:id', asyncHandler(userController.getById));
router.post('/', asyncHandler(userController.post));
router.put('/:id', asyncHandler(userController.put));
router.delete('/:id', asyncHandler(userController.deleteUser));

export default router;
