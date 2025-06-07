import { BaseCollection } from "../base-collection/baseCollection";

class Postgres extends BaseCollection {
    get(): Promise<unknown> {
        return new Promise((resolve) => {
            resolve([{data: "postgress"}, {data: "postgress"}])
        });
    }
    post(): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    put(): Promise<unknown> {
        throw new Error("Method not implemented.");
    }

}
export { Postgres }