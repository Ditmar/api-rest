import { Request, Response } from 'express';
import { BaseCollection } from '../data-collection/base-collection/baseCollection';
import { HttpStatus } from '../utils/httpStatus';

const userController = (dataCollection: BaseCollection) => {
    const get = async(request: Request, response: Response) => {
        response.status(HttpStatus.OK).json({message: "Hello from user controller", data: await dataCollection.get()});
    }
    const post = (request: Request, response: Response) => {
        const body = request.body;
        response.send(body);
    }
    const deleteUser = (request: Request, response: Response) => {
        const body = request.body;
        response.send(body);
    }
    const put = (request: Request, response: Response) => {
        const body = request.body;
        response.send(body);
    }
    return {get, post, deleteUser, put}
}
export { userController };