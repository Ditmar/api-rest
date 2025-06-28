import { ObjectId } from 'mongodb';
import { MongoClient } from '../data-collection/mongo/mongo-client'

export class UserRepository {
    private async getCollection() {
        const client = MongoClient.getInstance();
        const db = client.db(); 
        return db.collection('users');
    }

    async getUsers() {
        const collection = await this.getCollection();
        return collection.find().toArray();
    }

    async getUserById(id: string) {
        const collection = await this.getCollection();
        return collection.findOne({ _id: new ObjectId(id) });
    }

    async createUser(userData: any) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(userData);
        return { result };
    }

    async updateUser(id: string, updateData: any) {
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        return result;
    }

    async deleteUser(id: string) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return { deletedCount: result.deletedCount };
    }

    async emailExists(email: string) {
        const collection = await this.getCollection();
        const user = await collection.findOne({ email });
        return !!user;
    }
}
