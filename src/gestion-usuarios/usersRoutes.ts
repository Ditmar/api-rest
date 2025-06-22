import { Router } from 'express';
import { usersController } from './controller';
import { BaseCollectionUser } from '../data-collection/base-collection/baseCollection';

const usersWrapper = (dataCollection: BaseCollectionUser) => {
    const { getUserById, createUser, deleteUser, updateUser, getUsers } = usersController(dataCollection);
    const userRouter = Router();
    userRouter.get('/:id', getUserById);
    userRouter.post('/', createUser);
    userRouter.delete('/:id', deleteUser);
    userRouter.put('/:id', updateUser);
    userRouter.get('/', getUsers);
    return userRouter
}

export  { usersWrapper };