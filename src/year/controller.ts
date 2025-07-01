import { Request, Response } from 'express';
import { HttpStatus } from '../utils/httpStatus';
import { YearCollection } from './model';

const yearController = (yearCollection: YearCollection) => {
  const getAll = async (request: Request, response: Response) => {
    try {
      const years = await yearCollection.get();
      const sortedYears = years.sort((a, b) => a.year - b.year);
      response.status(HttpStatus.OK).json(sortedYears);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error instanceof Error ? error.message : 'Failed to fetch years' });
    }
  };

  const create = async (request: Request, response: Response) => {
    try {
      const { year } = request.body;
      
      if (!year || typeof year !== 'number' || year.toString().length !== 4) {
        response.status(HttpStatus.BAD_REQUEST).json({ error: 'Year must be a 4-digit number' });
        return;
      }
      
      const result = await yearCollection.createYear({ year });
      response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error instanceof Error ? error.message : 'Failed to create years' });
    }
  };

  const remove = async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const year = parseInt(id, 10);
      
      if (isNaN(year)) {
        response.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid year format' });
        return;
      }
      
      const result = await yearCollection.deleteYear(year);
      
      if (result) {
        response.status(HttpStatus.NO_CONTENT).send();
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete year' });
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('associated articles')) {
        response.status(HttpStatus.FORBIDDEN).json({ error: error.message });
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete year' });
      }
    }
  };

  return { getAll, create, remove };
};

export { yearController };