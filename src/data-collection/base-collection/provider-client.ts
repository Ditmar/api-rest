export interface ParamsConnection {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface ProviderClient {
    connection(): Promise<void>;
    disconnection(): Promise<void>;
}