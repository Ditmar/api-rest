export abstract class BaseCollection {
    abstract get(id?:string): Promise<unknown>;
    abstract post(body: unknown): Promise<unknown>;
    abstract delete(body: unknown): Promise<unknown>;
    abstract put(body: any): Promise<unknown>;
}
