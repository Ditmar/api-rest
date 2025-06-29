import { Request, Response } from 'express';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';

const indexesController = (dataCollection: BaseCollection) => {
  const get = async (req: Request, res: Response) => {
    try {
      const data = await dataCollection.get();
      res.status(HttpStatus.OK).json({ message: "Hello from indexes controller", data });
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const data = await dataCollection.getById(id);
      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Not found" });
        return;
      }
      res.status(HttpStatus.OK).json({ data });
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const post = async (req: Request, res: Response) => {
    const body = req.body;
    try {
      const result = await dataCollection.post(body);
      res.status(HttpStatus.CREATED).json({ message: "Created", result });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const put = async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    try {
      const result = await dataCollection.put({ id, ...body });
      res.status(HttpStatus.OK).json({ message: "Updated", result });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const deleteIndex = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const result = await dataCollection.delete({ id });
      res.status(HttpStatus.OK).json({ message: "Deleted", result });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  

  return { get, getById, post, put, deleteIndex };
};

export { indexesController };
