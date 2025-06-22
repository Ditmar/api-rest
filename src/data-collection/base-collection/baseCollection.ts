export abstract class BaseCollection {
  abstract get(): Promise<unknown>;
  abstract post(body: unknown): Promise<unknown>;
  abstract delete(body: unknown): Promise<unknown>;
  abstract put(body: any): Promise<unknown>;

  // Métodos agregados de forma obligatoria
  abstract getById(id: string): Promise<unknown>;
  abstract postArticle(body: unknown): Promise<unknown>;
}
