import express from 'express';
import dotenv from 'dotenv';
import { userWrapper } from './user/userRoutes';
import { DataCollectionFactory } from './data-collection/factory';
import type { BaseCollection } from './data-collection/base-collection/baseCollection';
console.log('Development mode');
dotenv.config();


const server =  express();

class App {
    private dataCollection: BaseCollection | null = null;
    constructor() {
        this.initializeMiddlewares();
        this.initCollections();
        this.initializeRoutes();
    }

    private initCollections() {
       this.dataCollection =  DataCollectionFactory.createDataCollection('api');
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
new App();
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});