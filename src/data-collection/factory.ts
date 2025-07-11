import { MongoProvider } from '../data/providers/MongoProvider';
import { Mongo } from './mongo/Mongo';
import { Postgres } from './postgres/Postgres';
import { PokeApi  } from './api/PokeApi';
import { BaseCollection } from './base-collection/baseCollection';
import { IndexCollection } from './mongo/IndexCollection';

class DataCollectionFactory {
  static createDataCollection(type: string): BaseCollection {
    switch (type) {
      case 'mongo':
        return new MongoProvider();
      case 'postgres':
        return new Postgres();
      case 'api':
        return new PokeApi();
      case 'index':
    return new IndexCollection();
      default:
        throw new Error(`Unknown data collection type: ${type}`);
    }
  }
}
export { DataCollectionFactory };