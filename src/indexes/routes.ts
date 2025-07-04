import { Router } from 'express';
import { indexesController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const indexesWrapper = (dataCollection: BaseCollection) => {
  const { get, getById, post, put, deleteIndex } = indexesController(dataCollection);
  const router = Router();

  router.get('/', get);                
  router.get('/:id', getById);      
  router.post('/', post);              
  router.put('/:id', put);             
  router.delete('/:id', deleteIndex);    

  return router;
};

export { indexesWrapper };

