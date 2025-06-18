export abstract class BaseCollection {
    abstract get(): Promise<unknown>;
    abstract getById(id?:string): Promise<unknown>;
    abstract post(body: unknown): Promise<unknown>;
    abstract delete(id: string): Promise<unknown>;
    abstract put(id:string, body: any): Promise<unknown>;
}
