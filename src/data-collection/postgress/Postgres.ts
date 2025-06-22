import { BaseCollection } from "../base-collection/baseCollection";

class Postgres extends BaseCollection {
    get(): Promise<unknown> {
        return new Promise((resolve) => {
            resolve([{data: "postgress"}, {data: "postgress"}])
        });
    }
    getById(): Promise<unknown> {
        throw new Error("Method not implemented.");
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



  async postArticle(body: unknown): Promise<unknown> {
    throw new Error("postArticle not implemented in PokeApi");
  }

}
export { Postgres }