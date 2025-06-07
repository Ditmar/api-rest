import { Router } from 'express';
import { userController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const userWrapper = (dataCollection: BaseCollection) => {
    const { getUserById, createUser, deleteUser, updateUser, getUsers } = userController(dataCollection);
    const userRouter = Router();
    userRouter.get('/:id', getUserById);
    userRouter.post('/', createUser);
    userRouter.delete('/:id', deleteUser);
    userRouter.put('/:id', updateUser);
    userRouter.get('/', getUsers);
    return userRouter
}

export  { userWrapper };