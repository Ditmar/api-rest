import { MongoClient } from '../data-collection/mongo/mongo-client';
import { ObjectId } from 'mongodb';

export interface IAuthors {
    _id?: ObjectId;
    fullName: string;
    email: string;
    institution: string;
}

export class AuthorsService {
    private collection() {
        return MongoClient.getInstance().db().collection<IAuthors>('authors');
    }

    get(): Promise<IAuthors[]> {
        return this.collection().find({}).toArray()
    }
    post(body: IAuthors): Promise<unknown> {
        return this.collection().insertOne(body);
    }
    delete(body: { _id: string }): Promise<unknown> {
        return this.collection().deleteOne({ _id: new ObjectId(body._id) });
    }
    put(body: Partial<Omit<IAuthors, '_id'>>, id: string): Promise<unknown> {
        const author = this.getById(id);
        if (!author) {
            throw new Error(`Author with ID ${id} not found`);
        }
        const data = { ...author, ...body };
        return this.collection().findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data } }, { returnDocument: 'after' });
    }
    getById(id: string): Promise<IAuthors | null> {
        return this.collection().findOne({ _id: new ObjectId(id) });
    }
}