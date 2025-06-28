import { Request, Response } from 'express';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';
import { ErrorHandler } from '../utils/errorHandler';
import bcrypt from 'bcrypt';

const usersController = (dataCollection: BaseCollection) => {
    

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
            const { nombre, email, password } = request.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userData = {
                ...request.body,
                password: hashedPassword
            };

            const newUser = await dataCollection.post(userData);
            
                response.status(HttpStatus.CREATED).json(newUser);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const deleteUser = async (request: Request, response: Response) => {
        try {
            const body = request.body;
            const result = await dataCollection.delete(body);
            response.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error)
            ErrorHandler.handler(error, response);
        }
    }

    const updateUser = async (request: Request, response: Response) => {
        try {
            const body = request.body;
            const updatedUser = await dataCollection.put(body);
            response.status(HttpStatus.OK).json(updatedUser);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }
    return { getUserById, createUser, deleteUser, updateUser, getUsers }
}
export { usersController };