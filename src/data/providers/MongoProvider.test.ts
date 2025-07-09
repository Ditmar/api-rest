import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model, Document, Schema } from 'mongoose';
import { MongoProvider } from './MongoProvider';
import { BaseCollection } from '../../data-collection/base-collection/baseCollection';


const testSchema = new Schema<Document<unknown>>(
    {},
    { strict: false, versionKey: false, collection: 'generic_items' }
);
let TestModel: Model<Document<unknown>>;


describe('MongoProvider Integration Tests', () => {
    let mongod: MongoMemoryServer;
    let provider: MongoProvider;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        process.env.MONGO_URL = uri;

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        await mongoose.connect(uri);

        TestModel = mongoose.model<Document<unknown>>('GenericItemProviderTest', testSchema);

        provider = new MongoProvider();
    }, 30000);

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    beforeEach(async () => {
        if (TestModel) {
            await TestModel.deleteMany({});
        }
    });

    it('should be an instance of BaseCollection', () => {
        expect(provider).toBeInstanceOf(BaseCollection);
    });

    it('post() should insert a document and return it', async () => {
        const dataToInsert = { name: 'Test Item', value: 123, nested: { flag: true } };
        const result = await provider.post(dataToInsert) as any;

        expect(result).toBeDefined();
        expect(result._id).toBeDefined();
        expect(result.name).toBe(dataToInsert.name);
        expect(result.value).toBe(dataToInsert.value);
        expect(result.nested.flag).toBe(dataToInsert.nested.flag);

        const dbItem = await TestModel.findById(result._id).lean();
        expect(dbItem).toMatchObject(dataToInsert);
    });

    it('get() should retrieve all documents', async () => {
        const item1 = { name: 'Item Alpha', count: 1 };
        const item2 = { name: 'Item Beta', count: 2 };
        await provider.post(item1);
        await provider.post(item2);

        const results = await provider.get() as any[];
        expect(results).toHaveLength(2);

        expect(results).toEqual(
            expect.arrayContaining([
                expect.objectContaining(item1),
                expect.objectContaining(item2)
            ])
        );
    });

    it('put() should update an existing document', async () => {
        const initialData = { name: 'Original', version: 1 };
        const insertedDoc = await provider.post(initialData) as any;

        const updatePayload = { _id: insertedDoc._id, name: 'Updated Name', version: 2, newField: 'added' };
        const updatedDoc = await provider.put(updatePayload) as any;

        expect(updatedDoc).toBeDefined();
        expect(updatedDoc._id.toString()).toBe(insertedDoc._id.toString());
        expect(updatedDoc.name).toBe('Updated Name');
        expect(updatedDoc.version).toBe(2);
        expect(updatedDoc.newField).toBe('added');

        expect(updatedDoc.name).not.toBe(initialData.name);
    });

    it('put() should return null if document to update is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const updatePayload = { _id: nonExistentId, name: 'Non Existent Update' };
        const result = await provider.put(updatePayload);
        expect(result).toBeNull();
    });

    it('delete() should remove a document and return deletion info', async () => {
        const dataToDelete = { name: 'Delete Me', temporary: true };
        const insertedDoc = await provider.post(dataToDelete) as any;

        const deleteCriteria = { _id: insertedDoc._id };
        const deleteResult = await provider.delete(deleteCriteria) as any;

        expect(deleteResult).toBeDefined();
        expect(deleteResult.acknowledged).toBe(true);
        expect(deleteResult.deletedCount).toBe(1);
        expect(deleteResult.document._id.toString()).toBe(insertedDoc._id.toString());

        const foundAfterDelete = await TestModel.findById(insertedDoc._id).lean();
        expect(foundAfterDelete).toBeNull();
    });

    it('delete() should return info if document to delete is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const deleteCriteria = { _id: nonExistentId };
        const deleteResult = await provider.delete(deleteCriteria) as any;

        expect(deleteResult).toBeDefined();
        expect(deleteResult.acknowledged).toBe(true);
        expect(deleteResult.deletedCount).toBe(0);
        expect(deleteResult.message).toContain("Document not found");
    });

    it('put() should throw error if _id is missing', async () => {
        const updatePayload = { name: 'Missing ID Update' };
        await expect(provider.put(updatePayload)).rejects.toThrow("MongoProvider PUT: Missing _id in the body for update operation.");
    });

    it('delete() should throw error if criteria is not an object with _id', async () => {
        await expect(provider.delete("some_id_string" as any)).rejects.toThrow("MongoProvider DELETE: criteria must be an object with an _id property.");
        await expect(provider.delete({ name: "no_id_field" } as any)).rejects.toThrow("MongoProvider DELETE: criteria must be an object with an _id property.");
    });
});