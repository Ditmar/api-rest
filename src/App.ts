import express from 'express';
import { ConfigSingleton } from './config/config';
import { userWrapper } from './user/userRoutes'; 
import { authorRoute } from './routes/author';
import { DataCollectionFactory } from './data-collection/factory';
import { BaseCollection, BaseCollectionPdf } from './data-collection/base-collection/baseCollection';
import { MongoClient as MongoConnection } from './data-collection/mongo/mongo-client';
import { YearCollection } from './year/model';
import { yearWrapper } from './year/yearRoutes';
import { usersWrapper } from './users/usersRoutes';
import { indexesWrapper } from './indexes/routes'
import { articlesWrapper } from './articles/routes'; 
import { ArticleModel } from './articles/models';
import { bibliographyRoute } from './routes/bibliography';

console.log('Development mode');

const server = express();

class App {
  private dataCollection: BaseCollection | null = null;
  private articleCollection: BaseCollection | null = null;
  private yearCollection: YearCollection | null = null;

  constructor() {
    this.initializeMiddlewares();
    this.initCollections();
    this.initializeRoutes();
  }

  private initCollections() {
    this.dataPdfCollection =  new MongoPdf();
    this.dataCollection = DataCollectionFactory.createDataCollection('index');
    this.articleCollection = new ArticleModel(); 
    this.yearCollection = new YearCollection(); 
  }

  private initializeMiddlewares() {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    if (!this.dataCollection) {
      throw new Error('Data collection (index) no está inicializada');
    }
    if (!this.articleCollection) {
      throw new Error('La colección de artículos no está inicializada');
    }
    if (!this.yearCollection) {
      throw new Error('La colección de años no está inicializada');
    }

    server.use('/user', userWrapper(this.dataCollection));
    server.use('/year', yearWrapper(new YearCollection()));
    server.use('/users', usersWrapper(this.dataCollection));
    server.use('/indexes', indexesWrapper(this.dataCollection));
    server.use('/articles', articlesWrapper(this.articleCollection));
    server.use('/authors', authorRoute());
    server.use('/bibliography', bibliographyRoute());
  }
}

async function startServer() {
  try {
    const config = ConfigSingleton.getInstance();
    
    MongoConnection.getInstance(); 

    console.log('Conectado a MongoDB'); 
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    new App();
    server.listen(ConfigSingleton.getInstance().PORT, () => {
      console.log(
        `Server is running on port ${ConfigSingleton.getInstance().PORT}`
      );
    });
  } catch (error) {
    console.error('Fallo al iniciar el servidor:', error);
    process.exit(1); 
  }
}

startServer();