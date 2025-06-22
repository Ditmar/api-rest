import express from 'express';
import { ConfigSingleton } from './config/config';
import { userWrapper } from './user/userRoutes';
import { DataCollectionFactory } from './data-collection/factory';
import { BaseCollection } from './data-collection/base-collection/baseCollection';
import { MongoClient as MongoConnection } from './data-collection/mongo/mongo-client'; 


console.log('Development mode');

const server = express();

class App {
  private dataCollection: BaseCollection | null = null;

  constructor() {
    this.initializeMiddlewares();
    this.initCollections();
    this.initializeRoutes();
  }

  private initCollections() {
    this.dataCollection = DataCollectionFactory.createDataCollection('index'); // o 'mongo' o lo que uses
  }

  private initializeMiddlewares() {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    if (!this.dataCollection) {
      throw new Error('Data collection is not initialized');
    }
    server.use('/user', userWrapper(this.dataCollection));
  }
}

async function startServer() {
  try {
    // Forzamos que se inicie la conexión a Mongo
    MongoConnection.getInstance();
    // Esperamos 2 segundos para que la conexión async termine
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Ahora inicializamos la app y levantamos el servidor
    new App();
    server.listen(ConfigSingleton.getInstance().PORT, () => {
      console.log(`Server is running on port ${ConfigSingleton.getInstance().PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
