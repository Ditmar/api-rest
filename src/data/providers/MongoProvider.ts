import mongoose, { Model, Document, Schema } from 'mongoose';
import { BaseCollection } from '../../data-collection/base-collection/baseCollection';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL_ENV = process.env.MONGO_URL;

if (MONGO_URL_ENV) {
    mongoose.connect(MONGO_URL_ENV)
        .then(() => console.log('MongoDB connected successfully (MongoProvider).'))
        .catch(err => console.error('MongoDB connection error (MongoProvider):', err));
} else {
    console.error("FATAL ERROR: MONGO_URL is not defined. MongoProvider will not function correctly.");
}

const genericDataSchema = new Schema<Document<unknown>>(
    {},
    {
        strict: false,
        versionKey: false,
        collection: 'generic_items'
    }
);

const GenericModel: Model<Document<unknown>> = mongoose.model<Document<unknown>>('GenericItemProvider', genericDataSchema);

export class MongoProvider extends BaseCollection {
    private model: Model<Document<unknown>>;

    constructor() {
        super();
        this.model = GenericModel;

        if (!MONGO_URL_ENV || mongoose.connection.readyState !== 1) {
            console.warn("MongoProvider instance created, but MongoDB connection might not be immediately ready or MONGO_URL is missing.");
        }
    }

    private _checkConnection(): void {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB not connected. Please ensure MONGO_URL is set and the database is running.");
        }
    }

    async get(): Promise<unknown> {
        this._checkConnection();
        return this.model.find({}).lean().exec();
    }

    async post(body: unknown): Promise<unknown> {
        this._checkConnection();
        const newItem = await this.model.create(body);
        return newItem.toObject();
    }

    async put(body: unknown): Promise<unknown> {
        this._checkConnection();
        const { _id, ...updateData } = body as any;
        if (!_id) {
            throw new Error("MongoProvider PUT: Missing _id in the body for update operation.");
        }
        return this.model.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true }).lean().exec();
    }

    async delete(criteria: unknown): Promise<unknown> {
        this._checkConnection();
        if (typeof criteria !== 'object' || criteria === null || !('_id' in criteria)) {
            throw new Error("MongoProvider DELETE: criteria must be an object with an _id property.");
        }
        const result = await this.model.findOneAndDelete(criteria as { _id: any }).lean().exec();
        if (!result) {
            return { acknowledged: true, deletedCount: 0, message: "Document not found with the given criteria." };
        }
        return { acknowledged: true, deletedCount: 1, document: result };
    }

    async getById(id: string): Promise<unknown> {
        this._checkConnection();
        return this.model.findById(id).lean().exec();
    }

    async postArticle(body: unknown): Promise<unknown> {
        return this.post(body);
    }
}