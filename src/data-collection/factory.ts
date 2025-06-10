import { Mongo } from './mongo/Mongo';
import { Postgres } from './postgres/Postgres';
import { PokeApi  } from './api/PokeApi';
import { BaseCollection } from './base-collection/baseCollection';
class DataCollectionFactory {
  static createDataCollection(type: string): BaseCollection {
    switch (type) {
        case 'mongo':
            return new Mongo();
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