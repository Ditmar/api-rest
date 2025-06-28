import { Request, Response } from 'express';
import { HttpStatus } from '../utils/httpStatus';
import { ErrorHandler } from '../utils/errorHandler';
import { UserRepository } from './usersRepository';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';

const usersController = (dataCollection: BaseCollection) => {

    const userRepo = new UserRepository();

    const getUsers = async (request: Request, response: Response) => {
        try {
            const users = await userRepo.getUsers();
            response.status(HttpStatus.OK).json(users);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const getUserById = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await userRepo.getUserById(id);

            if (!user) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found'
                });
            }

            response.status(HttpStatus.OK).json(user);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const createUser = async (request: Request, response: Response) => {
        try {
            const { email } = request.body;

            if (await userRepo.emailExists(email)) {
                return response.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Email already exists'
                });
            }

            const newUser = await userRepo.createUser(request.body);
            response.status(HttpStatus.CREATED).json(newUser);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const updateUser = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const updatedUser = await userRepo.updateUser(id, request.body);

            if (!updatedUser) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found'
                });
            }

            response.status(HttpStatus.OK).json(updatedUser);
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    const deleteUser = async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const result = await userRepo.deleteUser(id);

            if (result && (result as any).deletedCount === 0) {
                return response.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found'
                });
            }

            response.status(HttpStatus.OK).json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            ErrorHandler.handler(error, response);
        }
    }

    return { getUsers, getUserById, createUser, updateUser, deleteUser };
}
export { usersController };