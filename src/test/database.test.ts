import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import { setup, teardown } from '../../setup';
import { MongoClient } from '../data-collection/mongo/mongo-client';

describe('Mongo Integration', () => {
  beforeAll(async () => {
    await setup();
  }, 30000);

  afterAll(async () => {
    await teardown();
  });

  test('should get a mongo instance', () => {
    const client = MongoClient.getInstance();
    expect(client).toBeDefined();
  });
});
