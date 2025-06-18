import { ErrorHandler } from "../../utils/errorHandler";
import { HttpStatus } from "../../utils/httpStatus";
import { BaseCollection } from "../base-collection/baseCollection";
import { MongoClient } from './mongo-client';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

class Mongo extends BaseCollection {
    client;
    db;

    constructor() {
        super();
        this.client = MongoClient.getInstance();
        this.db = this.client.db();
    }
    // get(): Promise<unknown> {
    //     return  this.client.db().collection('users').find().toArray();
    // }
    // post(body: any): Promise<unknown> {
    //     const b = {
    //         ...body,
    //     }
    //     return this.client.db().collection('users').insertOne(b);
    // }

    async get(): Promise<unknown> {
    try {
      const users = await this.db.collection('users').find({}, { projection: { password: 0 } }).toArray();
      return users;
    } catch (error) {
      throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Error fetching users');
    }
  }

  async getById(id: string): Promise<unknown> {
    try {
      const user = await this.db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
      if (!user) {
        throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }
      return user;
    } catch (error) {
      throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Error fetching user by ID');
    }

  async getById(id: string): Promise<unknown> {
    throw new Error("getById not implemented ");
  }

  async postArticle(body: unknown): Promise<unknown> {
    throw new Error("postArticle not implemented in PokeApi");
  }
}
export { Mongo }