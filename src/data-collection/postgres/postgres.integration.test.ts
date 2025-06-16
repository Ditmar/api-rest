import { Postgres } from './Postgres';
import { describe, beforeEach, afterEach, it, expect } from 'vitest'; // Changed import

 let postgres: Postgres;

describe('Postgres Connection Provider (Integration)', () => {

  beforeEach(async () => {
    postgres = new Postgres();
    await postgres.connect();
  });

  afterEach(async () => {
    await postgres.disconnect();
  });

  it('should connect to the real database', async () => {
    expect(postgres['client']).toBeDefined();
  });

  it('should disconnect from the real database', async () => {
    await postgres.disconnect();
    await expect(postgres.connect()).resolves.toBeUndefined();
    await expect(postgres.disconnect()).resolves.toBeUndefined();
    expect(postgres['client']).toBeNull();
  });
});