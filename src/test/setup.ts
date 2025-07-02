import { beforeAll, afterAll, beforeEach } from 'vitest';
import { connectMongo, disconnectMongo, clearMongoCollections } from '../data-collection/mongo/Mongo';
import { connectPostgres, disconnectPostgres, clearPostgresDatabase } from '../data-collection/postgress/Postgres';

beforeAll(async () => {
  await connectMongo();
  await connectPostgres();
});

afterAll(async () => {
  await disconnectMongo();
  await disconnectPostgres();
});

beforeEach(async () => {
  await clearMongoCollections();
  await clearPostgresDatabase();
});
