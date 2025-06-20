import { MongoClient as Mongo } from 'mongodb';
import { ConfigSingleton } from '../../config/config';

export class MongoClient {
  private static instance: Mongo | null = null;

  // Retorna la instancia conectada o lanza error si falla
  public static async connection(): Promise<Mongo> {
    if (this.instance) return this.instance;

    const config = ConfigSingleton.getInstance();
    const uri = config.MONGO_URI;

    this.instance = new Mongo(uri);
    try {
      await this.instance.connect();
      console.log('✅ Connected to MongoDB');
      return this.instance;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      this.instance = null; // evita usar instancia inválida
      throw error;          // propaga error para manejo externo
    }
  }

  // Retorna la instancia si existe, o lanza error si no conectado
  public static getInstance(): Mongo {
    if (!this.instance) throw new Error('MongoClient not connected');
    return this.instance;
  }

  // Cierra la conexión y limpia la instancia
  public static async disconnect() {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
    }
  }
}
