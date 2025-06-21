export abstract class BaseCollection {
    abstract get(): Promise<unknown>;
    abstract post(body: unknown): Promise<unknown>;
    abstract delete(body: unknown): Promise<unknown>;
    abstract put(body: any): Promise<unknown>;
}

export abstract class BaseCollectionPdf {
    abstract get(id: string): Promise<unknown>;
    abstract post(file: any): Promise<unknown>;
    abstract delete(id: string): Promise<unknown>;
    abstract getDownloadUrl(id: string): Promise<string>;
}
