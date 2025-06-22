import { BaseCollection } from "../base-collection/baseCollection";
import { MongoClient } from './mongo-client';
class Mongo extends BaseCollection {
    client
    constructor() {
        super();
        this.client = MongoClient.getInstance();
    }
    get(): Promise<unknown> {
        return  this.client.db().collection('users').find().toArray();
    }
    post(body: any): Promise<unknown> {
        const b = {
            ...body,
        }
        return this.client.db().collection('users').insertOne(b);
    }
    delete(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    put(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
}
export { Mongo }