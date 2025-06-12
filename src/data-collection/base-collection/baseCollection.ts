export abstract class BaseCollection {
    abstract get(id?:string): Promise<unknown>;
    abstract post(body: unknown): Promise<unknown>;
    abstract delete(id: string): Promise<unknown>;
    abstract put(id: string, body: unknown): Promise<unknown>;
}
