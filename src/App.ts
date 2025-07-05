import express from 'express';
import { ConfigSingleton } from './config/config';
import { userWrapper } from './user/userRoutes';
import { DataCollectionFactory } from './data-collection/factory';
import { BaseCollection } from './data-collection/base-collection/baseCollection';
import { MongoClient as MongoConnection } from './data-collection/mongo/mongo-client';
import { YearCollection } from './year/model';
import { yearWrapper } from './year/yearRoutes';
import { usersWrapper } from './users/usersRoutes';
import { indexesWrapper } from './indexes/routes'

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
    this.dataCollection = DataCollectionFactory.createDataCollection('index');
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
    server.use('/year', yearWrapper(new YearCollection()));
    server.use('/users', usersWrapper(this.dataCollection));
    server.use('/indexes', indexesWrapper(this.dataCollection));

  }
}

async function startServer() {
  try {
    MongoConnection.getInstance();

    await new Promise(resolve => setTimeout(resolve, 2000));

    new App();
    server.listen(ConfigSingleton.getInstance().PORT, () => {
      console.log(
        `Server is running on port ${ConfigSingleton.getInstance().PORT}`
      );
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();
