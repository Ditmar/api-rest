import { MongoClient } from '../data-collection/mongo/mongo-client';
import { ObjectId } from 'mongodb';

export interface IBibliography {
    _id: ObjectId;
    citation: string;
}

export class BibliographyService {
    private collection() {
        return MongoClient.getInstance().db().collection<IBibliography>('bibliographies');
    }

    get(): Promise<IBibliography[]> {
        return this.collection().find({}).toArray()
    }
    post(body: IBibliography): Promise<unknown> {
        return this.collection().insertOne(body);
    }
    delete(body: { _id: string }): Promise<unknown> {
        return this.collection().deleteOne({ _id: new ObjectId(body._id) });
    }
    put(body: Partial<Omit<IBibliography, '_id'>>, id: string): Promise<unknown> {
        const bibliography = this.getById(id);
        if (!bibliography) {
            throw new Error(`Bibliography with ID ${id} not found`);
        }
        const data = { ...bibliography, ...body };
        return this.collection().findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...data } }, { returnDocument: 'after' });
    }
    getById(id: string): Promise<IBibliography | null> {
        return this.collection().findOne({ _id: new ObjectId(id) });
    }
}