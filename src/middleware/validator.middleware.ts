import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpStatus } from '../utils/httpStatus';

export const validateMiddleware = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(HttpStatus.BAD_REQUEST).json({
                errors: result.error.errors.map(err => ({
                    message: err.message,
                    path: err.path
                }))
            });
        }
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(HttpStatus.BAD_REQUEST).json({
                errors: error.errors.map(err => ({
                    message: err.message,
                    path: err.path
                }))
            });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}