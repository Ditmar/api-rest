import { Mongo } from './mongo/Mongo';
import { IndexModel } from '../Indexes/model';
import { Postgres } from './postgress/Postgres';
import { PokeApi } from './api/PokeApi';
import { BaseCollection } from './base-collection/baseCollection';

class DataCollectionFactory {
  static createDataCollection(type: string): BaseCollection {
    switch (type) {
      case 'mongo':
        return new Mongo(); 
      case 'indexes':
        return new IndexModel(); 
      case 'postgres':
        return new Postgres();
      case 'api':
        return new PokeApi();
      default:
        throw new Error(`Unknown data collection type: ${type}`);
    }
  }
}

export { DataCollectionFactory };
