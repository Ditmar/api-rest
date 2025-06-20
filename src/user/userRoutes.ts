import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { userController } from './controller';

const router = Router();


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

router.post('/articles', asyncHandler(userController.createArticle));
router.get('/', asyncHandler(userController.get));
router.get('/:id', asyncHandler(userController.getById));
router.post('/', asyncHandler(userController.post));
router.put('/:id', asyncHandler(userController.put));
router.delete('/:id', asyncHandler(userController.deleteUser));

export default router;
