import { Router } from 'express';
import { userController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const userWrapper = (dataCollection: BaseCollection) => {
    const { get, post, deleteUser, put } = userController(dataCollection);
    const userRouter = Router();
    userRouter.get('/', get);
    userRouter.post('/', post);
    userRouter.delete('/', deleteUser)
    userRouter.put('/', put);
    return userRouter
}

export  { userWrapper };