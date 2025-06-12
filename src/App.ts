import express from 'express';
import dotenv from 'dotenv';
import { userWrapper } from './user/userRoutes';
import { DataCollectionFactory } from './data-collection/factory';
import { BaseCollection } from './data-collection/base-collection/baseCollection';
import { connectMongoDB } from './db/mongo';

console.log('Development mode');
dotenv.config();


const server =  express();

class App {
    private dataCollection: BaseCollection | null = null;
    constructor() {
        this.initializeMiddlewares();
        this.initDatabase();
        this.initCollections();
        this.initializeRoutes();
    }

    private async initDatabase() {
        await connectMongoDB()
    }

    private initCollections() {
    //    this.dataCollection =  DataCollectionFactory.createDataCollection('api');
    this.dataCollection =  DataCollectionFactory.createDataCollection('mongo');

    }
    private initializeMiddlewares() {
        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes() {
        if (!this.dataCollection) {
            throw new Error('Data collection is not initialized');
        }
        server.use('/usuarios', userWrapper(this.dataCollection));
    }
}
new App();
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});