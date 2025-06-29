import { Request, Response } from 'express';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';

const userController = (dataCollection: BaseCollection) => {
  const get = async (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({
      message: 'Hello from user controller',
      data: await dataCollection.get()
    });
  };

  const post = (req: Request, res: Response) => {
    const body = req.body;
    res.send(body);
  };

  const deleteUser = (req: Request, res: Response) => {
    const body = req.body;
    res.send(body);
  };

  const put = (req: Request, res: Response) => {
    const body = req.body;
    res.send(body);
  };

  return { get, post, deleteUser, put };
};

export { userController };
