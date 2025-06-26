import { Router } from 'express';
import { userController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const userWrapper = (dataCollection: BaseCollection) => {
  const { get, getById, post, put, deleteUser, postArticle } = userController(dataCollection);
  const router = Router();

  router.get('/', get);
  router.get('/:id', getById);
  router.post('/', post);
  router.put('/', put);
  router.delete('/', deleteUser);
  router.post('/article', postArticle);

  return router;
};

export { userWrapper };
