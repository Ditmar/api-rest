import { Response} from 'express';
import { HttpStatus } from './httpStatus';

export class ErrorHandler extends Error  {
    constructor( public statusCode: number, message:string){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    static handler(error:unknown, response:Response){
        if(error instanceof ErrorHandler){
            return response.status(error.statusCode).json({
                status:'error',
                statusCode: error.statusCode,
                message: error.message,
            })
        }
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
        })
    }
};