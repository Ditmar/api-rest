import { Router } from 'express';
import { articlesController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const articlesWrapper = (dataCollection: BaseCollection) => {
  const { get, getById, post, put, deleteArticle } = articlesController(dataCollection);
  const router = Router();

  router.get('/', get);
  router.get('/:id', getById);
  router.post('/', post);
  router.put('/:id', put);
  router.delete('/:id', deleteArticle);

  return router;
};

export { articlesWrapper };
