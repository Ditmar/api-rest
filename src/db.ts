// src/db.ts
import { MongoClient } from 'mongodb';
import { ConfigSingleton } from './config/config';

class MongoConnection {
  private client: MongoClient;

  constructor() {
    const { MONGO_URI } = ConfigSingleton.getInstance();
    this.client = new MongoClient(MONGO_URI);
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      // Verifica conectividad real con ping
      await this.client.db().command({ ping: 1 });
      console.log('✅ MongoDB connected');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('❌ MongoDB connection failed:', message);
    }
  }

  public getClient(): MongoClient {
    return this.client;
  }

  // Ya no usamos .topology
  public async isConnected(): Promise<boolean> {
    try {
      await this.client.db().command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }
}

export default new MongoConnection();
