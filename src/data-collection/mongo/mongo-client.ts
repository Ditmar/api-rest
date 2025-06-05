import { MongoClient as Mongo } from 'mongodb';
import { ConfigSingleton } from '../../config/config';

export class MongoClient{
    private static instance: Mongo | null = null;

    public static getInstance(): Mongo {
        if (MongoClient.instance === null) {
            MongoClient.connection();
        }
        if (MongoClient.instance === null) {
            throw new Error('Instance not found');
        }
        return MongoClient.instance;
    }
    private static  async connection() {
        const host = ConfigSingleton.getInstance().MONGO_HOST;
        const port = ConfigSingleton.getInstance().MONGO_PORT;
        const username = ConfigSingleton.getInstance().MONGO_INITDB_ROOT_USERNAME;
        const password = ConfigSingleton.getInstance().MONGO_INITDB_ROOT_PASSWORD;
        const database = ConfigSingleton.getInstance().MONGO_DATABASE;

        
        const uri = `MongoClient://${username}:${password}@${host}:${port}/${database}`;
        MongoClient.instance = new Mongo(uri);
        try {
            await MongoClient.instance.connect();
        } catch (error) {
            // todo: handle error
            console.error('Error on connection', error);
        }
    }
    public static async disconnection() {
        try {
            await MongoClient.instance?.close();
        } catch (error) {
            console.error('Error on disconnection', error);
        }
    }
}