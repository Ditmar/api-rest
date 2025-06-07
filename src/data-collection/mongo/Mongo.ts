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

    async delete(id: string): Promise<unknown> {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
        }
        return { message: 'User deleted successfully' };
    }
    async put(id: string, body: unknown): Promise<unknown> {
        try {
            const { nombre, email, password } = body as { nombre: string; email: string; password: string };
            const user = await UserModel.findById(id);
            if (!user) {
                throw new ErrorHandler(HttpStatus.NOT_FOUND, 'User not found');
            }

            if (email && email !== user.email) {
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) {
                    throw new ErrorHandler(HttpStatus.BAD_REQUEST, 'Email already in use');
                }
            }

            return UserModel.findByIdAndUpdate(id, { nombre, email, password }, { new: true }).select('-password');
        } catch (error) {
            if (error instanceof ErrorHandler) {
                throw error;
            }
            throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, 'Error updating user');
        }
    }

  async getById(id: string): Promise<unknown> {
    throw new Error("getById not implemented ");
  }

  async postArticle(body: unknown): Promise<unknown> {
    throw new Error("postArticle not implemented in PokeApi");
  }
}
export { Mongo }