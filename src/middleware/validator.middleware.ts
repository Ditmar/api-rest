import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateMiddleware = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                errors: result.error.errors.map(err => ({
                    message: err.message,
                    path: err.path
                }))
            });
        }
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                errors: error.errors.map(err => ({
                    message: err.message,
                    path: err.path
                }))
            });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}