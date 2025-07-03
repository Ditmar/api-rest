import { Router } from 'express';
import { usersController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const usersWrapper = (dataCollection: BaseCollection) => {
    const { getUserById, createUser, deleteUser, updateUser, getUsers } = usersController(dataCollection);
    const userRouter = Router();

    const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
        Promise.resolve(fn(req, res, next)).catch(next);

    userRouter.get('/:id', asyncHandler(getUserById));
    userRouter.post('/', asyncHandler(createUser));
    userRouter.delete('/:id', asyncHandler(deleteUser));
    userRouter.put('/:id', asyncHandler(updateUser));
    userRouter.get('/', asyncHandler(getUsers));
    return userRouter
}

export  { usersWrapper };