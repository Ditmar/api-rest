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

        
        const uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;

        MongoClient.instance = new Mongo(uri);
        try {
            await MongoClient.instance.connect();
        } catch (error) {
            console.error('Error on connection', error);
        }
    }
    public static async disconnection() {
  if (!MongoClient.instance) {
    console.warn('⚠️ No Mongo instance to disconnect.');
    return;
  }
try {
    await MongoClient.instance.close();
    console.log('✅ Mongo disconnected successfully');
  } catch (error) {
    const err = error as Error;
    if (err.name === 'MongoTopologyClosedError') {
      console.warn('⚠️ Mongo connection already closed.');
    } else {
      console.error('❌ Error on disconnection:', err.message);
    }
  }
}
}