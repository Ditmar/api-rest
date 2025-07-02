import { describe, it, expect } from 'vitest';
import { connectPostgres } from '../data-collection/postgress/Postgres';
import { connectMongo } from '../data-collection/mongo/Mongo';

describe('Test base', () => {
  it('1 + 1 = 2', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('Database connections', () => {
  it('should connect to both Postgres and MongoDB without throwing', async () => {
    await expect(connectPostgres()).resolves.not.toThrow();
    await expect(connectMongo()).resolves.not.toThrow();
  });
});
