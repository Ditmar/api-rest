import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface IAuthPayload extends JwtPayload {
    userId: string;
    email: string;
}

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthService<T> {
    validateCredentials(credentials: T): Promise<IAuthPayload | null>;
    getMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
}

export interface ITokenService extends IAuthService<string> {
    generateAccessToken(payload: IAuthPayload): string;
    generateRefreshToken(payload: Omit<IAuthPayload, 'iat' | 'exp'>): string;
    verifyAccessToken(token: string): IAuthPayload;
    verifyRefreshToken(token: string): Omit<IAuthPayload, 'iat' | 'exp'>;
    refreshTokens(oldRefreshToken: string): ITokenPair;
    revokeToken(token: string): Promise<void>;
    isTokenRevoked(token: string): Promise<boolean>;
}