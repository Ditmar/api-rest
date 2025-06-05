import express from 'express';
import { ConfigSingleton } from './config/config';
import { userWrapper } from './user/userRoutes';
import { DataCollectionFactory } from './data-collection/factory';
import { BaseCollection } from './data-collection/base-collection/baseCollection';
console.log('Development mode');


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
server.listen(ConfigSingleton.getInstance().PORT, () => {
    console.log(`Server is running on port ${ConfigSingleton.getInstance().PORT}`);
});