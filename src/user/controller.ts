import { Request, Response } from 'express';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';
import { ErrorHandler } from '../utils/errorHandler';

const userController = (dataCollection: BaseCollection) => {
  const get = async (req: Request, res: Response) => {
    try {
      const data = await dataCollection.get();
      res.status(HttpStatus.OK).json({ message: "Hello from user controller", data });
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
    const body = req.body;
    try {
      const result = await dataCollection.put(body);
      res.status(HttpStatus.OK).json({ message: "Updated", result });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const deleteUser = async (req: Request, res: Response) => {
    const body = req.body;
    try {
      const result = await dataCollection.delete(body);
      res.status(HttpStatus.OK).json({ message: "Deleted", result });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

 
  const postArticle = async (req: Request, res: Response) => {
    const body = req.body;
    try {
      const result = await dataCollection.postArticle(body);
      res.status(HttpStatus.CREATED).json({ message: "Article Created", result });
    } catch (error: unknown) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  return { get, getById, post, put, deleteUser, postArticle };
};

export { userController };
