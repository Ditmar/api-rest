import { IAuthPayload } from '../types/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: IAuthPayload
        }
    }
}