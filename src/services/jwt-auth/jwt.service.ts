import { Request } from 'express';
import { IAuthPayload, ITokenPair, ITokenService } from '../../types/jwt'
import { verify, TokenExpiredError, JsonWebTokenError, sign } from 'jsonwebtoken';
import { ConfigSingleton } from '../../config/config';
import { BaseAuthService } from './BaseAuthService';
export class JwtAuthService extends BaseAuthService<string> implements ITokenService {
    private revokedTokens: Set<string>;
    private readonly config;
    constructor() {
        super();
        this.config = ConfigSingleton.getInstance();
        this.revokedTokens = new Set<string>();
    }
    generateAccessToken(payload: IAuthPayload): string {
        try {
            const token = sign(payload, this.config.JWT_SECRET, {
                expiresIn: this.config.JWT_TTL,
                issuer: this.config.JWT_ISSUER,
                audience: this.config.JWT_AUDIENCE,
            });
            return token;
        } catch (error) {
            return `Error generating access token: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    generateRefreshToken(payload: Omit<IAuthPayload, 'iat' | 'exp'>): string {
        try {
            return sign({
                ...payload,
                type: 'refresh',
            }, this.config.JWT_SECRET, {
                expiresIn: this.config.JWT_REFRESH_TTL,
                issuer: this.config.JWT_ISSUER,
                audience: this.config.JWT_AUDIENCE,
            });
        } catch (error) {
            return `Error generating refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    verifyAccessToken(token: string): IAuthPayload {
        try {
            if (this.revokedTokens.has(token)) {
                throw new TokenExpiredError('Access token has been revoked', new Date());
            }
            const decoded = verify(token, this.config.JWT_SECRET, {
                issuer: this.config.JWT_ISSUER,
                audience: this.config.JWT_AUDIENCE,
            }) as IAuthPayload;
            return decoded;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new JsonWebTokenError('Access token has expired');
            }
            else if (error instanceof Error) {
                throw new Error(`Invalid access token: ${error.message}`);
            }
            throw new Error('Invalid access token');
        }
    }
    verifyRefreshToken(token: string): IAuthPayload {
        try {
            if (this.revokedTokens.has(token)) {
                throw new TokenExpiredError('Refresh token has been revoked', new Date());
            }
            const payload = verify(token, this.config.JWT_SECRET, {
                issuer: this.config.JWT_ISSUER,
                audience: this.config.JWT_AUDIENCE,
            }) as IAuthPayload;

            if (payload.type !== 'refresh') {
                throw new JsonWebTokenError('Invalid refresh token type');
            }
            return payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new JsonWebTokenError('Refresh token has expired');
            }
            else if (error instanceof Error) {
                throw new Error(`Invalid refresh token: ${error.message}`);
            }
            throw new Error('Invalid refresh token');
        }
    }
    refreshTokens(oldRefreshToken: string): ITokenPair {
        const payload = this.verifyRefreshToken(oldRefreshToken);

        this.revokeToken(oldRefreshToken);
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        }
    }
    revokeToken(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.revokedTokens.add(token);
                resolve();
            } catch (error) {
                reject(new Error(`Failed to revoke token: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        });
    }
    isTokenRevoked(token: string): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(this.revokedTokens.has(token));
        });
    }
    
    async validateCredentials(credentials: string): Promise<IAuthPayload | null> {
        return this.verifyAccessToken(credentials);
    }

    protected async extractAndValidate(req: Request): Promise<IAuthPayload | null> {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.split(' ')[1];
        return this.validateCredentials(token);
    }

}