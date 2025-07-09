import { MongoClient as CustomMongoClient } from '../data-collection/mongo/mongo-client';

export async function connectMongo(): Promise<void> {
  try {
    CustomMongoClient.getInstance(); 
    console.log('✅ Mongo connected for test setup');
  } catch (error) {
    console.error('❌ Failed to connect to Mongo:', error);
    throw error;
  }
}

export async function disconnectMongo(): Promise<void> {
  try {
    await CustomMongoClient.disconnection();
    console.log('✅ Mongo disconnected after tests');
  } catch (error) {
    console.error('❌ Failed to disconnect Mongo:', error);
    throw error;
  }
}
