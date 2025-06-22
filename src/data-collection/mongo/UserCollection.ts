import { ErrorHandler } from "../../utils/errorHandler";
import { HttpStatus } from "../../utils/httpStatus";
import { BaseCollectionUser } from "../base-collection/baseCollection";
import { MongoClient } from './mongo-client';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

class UserCollection extends BaseCollectionUser {
    client;
    db;

    constructor() {
        super();
        this.client = MongoClient.getInstance();
        this.db = this.client.db();
    }
  
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
  }

  async post(body: any): Promise<unknown> {
    try {
      const { nombre, email, password } = body;
      if (!nombre || !email || !password) {
        throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'Missing required fields');
      }

      const existingUser = await this.db.collection('users').findOne({ email });
      if (existingUser) {
        throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        nombre,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.db.collection('users').insertOne(newUser);
      return {
        message: 'User created successfully',
        user: {
          id: result.insertedId,
          nombre,
          email,
        },
      };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Error creating user');
    }
  }

  async delete(id: string): Promise<unknown> {
    const result = await this.db.collection('users').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async put(id: string, body: any): Promise<unknown> {
    try {
      const { nombre, email, password } = body;

      const user = await this.db.collection('users').findOne({ _id: new ObjectId(id) });
      
      if (!user) {
        throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }

      if (email && email !== user.email) {
        const existingUser = await this.db.collection('users').findOne({ email });
        if (existingUser) {
          throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'Email already in use');
        }
      }

      const updatedData: any = {
        nombre,
        email,
        updatedAt: new Date(),
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      const result = await this.db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData },
        { returnDocument: 'after', projection: { password: 0 } }
      );

      if (!result) {
        throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
      }
      return result;
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Error updating user');
    }
  }
}
export { UserCollection }