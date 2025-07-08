import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
class ConfigSingleton {
    private static env: {
        PORT: number;
        NODE_ENV: 'development' | 'production';
        URL_BASE_POKE_API: string;
        VERSION: string;
        MONGO_INITDB_ROOT_USERNAME: string;
        MONGO_INITDB_ROOT_PASSWORD: string;
        POSTGRES_USER: string;
        POSTGRES_PASSWORD: string;
        MONGO_HOST: string;
        MONGO_DATABASE: string;
        MONGO_PORT: number;
        JWT_SECRET: string;
        JWT_TTL: number;
        JWT_REFRESH_TTL: number;
        JWT_ALGORITHM: 'HS256' | 'RS256';
        JWT_ISSUER: string;
        JWT_AUDIENCE: string;
        MAX_IMAGE_SIZE_MB: number; 
        ALLOWED_EXTENSIONS: string; 

    } | null = null;
    private static createSchema() {
        const configSchema = z.object({
            PORT: z.coerce.number().default(3000),
            NODE_ENV: z.enum(['development', 'production']).default('development'),
            URL_BASE_POKE_API: z.string().url(),
            VERSION: z.string(),
            MONGO_INITDB_ROOT_USERNAME: z.string().min(1),
            MONGO_INITDB_ROOT_PASSWORD: z.string().min(1),
            POSTGRES_USER: z.string().min(1),
            POSTGRES_PASSWORD: z.string().min(1),
            MONGO_HOST: z.string(),
            MONGO_DATABASE: z.string(),
            MONGO_PORT: z.coerce.number().default(27017),
            JWT_SECRET: z.string().min(30),
            JWT_TTL: z.coerce.number(),
            JWT_REFRESH_TTL: z.coerce.number(),
            JWT_ALGORITHM: z.enum(['HS256', 'RS256']),
            JWT_ISSUER: z.string().min(1),
            JWT_AUDIENCE: z.string().min(1),
            MAX_IMAGE_SIZE_MB: z.coerce.number().default(5),
            ALLOWED_EXTENSIONS: z.string().default('.jpg,.jpeg,.png,.gif'), 

});
          const parsed = configSchema.safeParse(process.env);
          if (!parsed.success) {
              console.error('Invalid environment variables:', parsed.error.format());
              process.exit(1);
          }
          const env = parsed.data;
        return env;
    };

    public static getInstance() {

        if (ConfigSingleton.env === null) {
            console.log('create instance ');
            ConfigSingleton.env = ConfigSingleton.createSchema();
        }

        return ConfigSingleton.env;
    }
     
    public static get maxImageSizeBytes(): number {
        return this.getInstance().MAX_IMAGE_SIZE_MB * 1024 * 1024;
    }
    
    public static get allowedExtensions(): string[] {
        const raw = this.getInstance().ALLOWED_EXTENSIONS;
        return raw.split(',').map(ext => ext.trim().toLowerCase());
    }
}
export { ConfigSingleton };