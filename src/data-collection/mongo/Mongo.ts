import { BaseCollection } from "../base-collection/baseCollection";

class Mongo extends BaseCollection {
  get(): Promise<unknown> {
    throw new Error("get not implemented in Mongo");
  }

  getById(id: string): Promise<unknown> {
    throw new Error("getById not implemented in Mongo");
  }

  post(body: unknown): Promise<unknown> {
    throw new Error("post not implemented in Mongo");
  }

  put(body: unknown): Promise<unknown> {
    throw new Error("put not implemented in Mongo");
  }

  delete(body: unknown): Promise<unknown> {
    throw new Error("delete not implemented in Mongo");
  }
}

export { Mongo };
