import { JwtAuthService } from "./jwt.service";

export class AuthSingleton {
    static instance: JwtAuthService | null = null;
    static getInstance(): JwtAuthService {
        if (!AuthSingleton.instance) {
            AuthSingleton.instance = new JwtAuthService();
        }
        return AuthSingleton.instance;
    }
}