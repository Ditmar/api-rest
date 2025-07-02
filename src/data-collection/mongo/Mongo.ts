import { BaseCollection } from "../base-collection/baseCollection";
import { MongoClient } from './mongo-client';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

const connectMongo = async () => {
  if (mongoose.connection.readyState !== 0) return;
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
  if (process.env.NODE_ENV === 'test') {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  } else {
    await mongoose.connect(uri);
  }
};

const disconnectMongo = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};

const clearMongoCollections = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

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

  async getById(id: string): Promise<unknown> {
    throw new Error("getById not implemented ");
  }

  async postArticle(body: unknown): Promise<unknown> {
    throw new Error("postArticle not implemented in PokeApi");
  }
}
export {
  connectMongo,
  disconnectMongo,
  clearMongoCollections
};
export { Mongo }