import { BaseCollection } from "../base-collection/baseCollection";
import { MongoClient } from './mongo-client'
class Mongo extends BaseCollection {
    get(): Promise<unknown> {
        return MongoClient.getInstance().db().collection().find();
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