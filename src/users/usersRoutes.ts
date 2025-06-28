import { Router } from 'express';
import { usersController } from './controller';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';
import { MongoProvider } from '../data/providers/MongoProvider';

const usersWrapper = (dataCollection: BaseCollection) => {
    const mongoProvider = new MongoProvider(); 
    const controller = usersController(mongoProvider); 

    const userRouter = Router();
    userRouter.get('/:id', controller.getUserById);
    userRouter.post('/', controller.createUser);
    userRouter.delete('/', controller.deleteUser);   
    userRouter.put('/', controller.updateUser);
    userRouter.get('/', controller.getUsers);
    return userRouter
}

export  { usersWrapper };