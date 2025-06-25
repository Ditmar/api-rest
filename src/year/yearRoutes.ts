import { Router } from 'express';
import { yearController } from './controller';
import { YearCollection } from './year.model';

const yearWrapper = (yearCollection: YearCollection) => {
  const { getAll, create, remove } = yearController(yearCollection);
  const yearRouter = Router();
  
  yearRouter.get('/years', getAll);
  yearRouter.post('/years', create);
  yearRouter.delete('/years/:id', remove);
  
  return yearRouter;
};

export { yearWrapper };