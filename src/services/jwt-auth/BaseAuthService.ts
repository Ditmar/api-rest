import { Request, Response, NextFunction } from 'express';
import { IAuthPayload, IAuthService } from '../../types/jwt';

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
                    res.status(401).json({ error: 'Unauthorized' });
                }
            } catch (error) {
                if (error instanceof Error) {
                    res.status(401).json({ error: error.message });
                }
                res.status(500).json({ error: 'Internal Server Error' });
            }

        }
    }

    protected abstract extractAndValidate(req: Request): Promise<IAuthPayload | null>;
}