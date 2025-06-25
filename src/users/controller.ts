import { Request, Response } from 'express';
import { BaseCollectionUser } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';
import { ErrorHandler } from '../utils/errorHandler';

const usersController = (dataCollection: BaseCollectionUser) => {
    

    const getUsers = async (request: Request, response: Response) => {
        try {
            const users = await dataCollection.get();
            response.status(HttpStatus.OK).json(users);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const getUserById = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await dataCollection.getById(id);
            response.status(HttpStatus.OK).json(user);
        } catch (error) {
            ErrorHandler.handler(error, response);

        }
    }

    const createUser = async (request: Request, response: Response) => {
        try {
            const newUser = await dataCollection.post(request.body);
            response.status(HttpStatus.CREATED).json(newUser);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const deleteUser = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const result = await dataCollection.delete(id);
            response.status(HttpStatus.OK).json(result);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const updateUser = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const updatedUser = await dataCollection.put(id, request.body);
            response.status(HttpStatus.OK).json(updatedUser);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }
    return { getUserById, createUser, deleteUser, updateUser, getUsers }
}
export { usersController };