import { BaseCollection } from "../base-collection/baseCollection";

class Mongo extends BaseCollection {
    get(): Promise<unknown> {
        return new Promise((resolve) => {
            resolve([{data: "MongoDB"}, {data: "MongoDB"}])
        });
    }
    post(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    delete(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    put(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
}
export { Mongo }