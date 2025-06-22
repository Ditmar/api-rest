export abstract class BaseCollection {
    abstract get(): Promise<unknown>;
    abstract post(body: unknown): Promise<unknown>;
    abstract delete(body: unknown): Promise<unknown>;
    abstract put(body: any): Promise<unknown>;
}
