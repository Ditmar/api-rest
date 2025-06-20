import { Request, Response, NextFunction } from 'express';
import { IAuthPayload, IAuthService } from '../../types/jwt';
import { HttpStatus } from '../../utils/httpStatus';

export abstract class BaseAuthService<T> implements IAuthService<T> {
    abstract validateCredentials(credentials: T): Promise<IAuthPayload | null>
    getMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
        return async(req: Request, res: Response, next: NextFunction) => {
            try {
                const authPayload = await this.extractAndValidate(req);
                if (authPayload) {
                    req.user = authPayload;
                    next();
                } else {
                    res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
                }
            } catch (error) {
                if (error instanceof Error) {
                    res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
                }
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }

        }
    }

    protected abstract extractAndValidate(req: Request): Promise<IAuthPayload | null>;
}