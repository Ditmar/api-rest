import { BaseCollection } from "../base-collection/baseCollection";

class Postgres extends BaseCollection {
    get(): Promise<unknown> {
        return new Promise((resolve) => {
            resolve([{data: "postgress"}, {data: "postgress"}])
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
export { Postgres }