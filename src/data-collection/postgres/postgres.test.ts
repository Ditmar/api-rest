vi.mock('@sequelize/core');

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sequelize } from '@sequelize/core';
import { Postgres } from './Postgres';
import { __mocked } from '../../_mocks_/@sequelize/core';

describe('Postgres Connection Provider', () => {
  let postgres: Postgres;

  beforeEach(() => {
    postgres = new Postgres();
    vi.clearAllMocks();
    __mocked.SequelizeMock.mockClear();
    __mocked.mockAuthenticate.mockClear();
    __mocked.mockClose.mockClear();
  });

  it('should connect and set the client', async () => {
    await expect(postgres.connect()).resolves.toBeUndefined();
    expect(postgres['client']).toBeDefined();
    expect(Sequelize).toHaveBeenCalled();
  });

  it('should disconnect and unset the client', async () => {
    await postgres.connect();
    const client = postgres['client'];
    await expect(postgres.disconnect()).resolves.toBeUndefined();
    expect(client?.close).toHaveBeenCalled();
    expect(postgres['client']).toBeNull();
  });

  it('should set up a client that can authenticate and close without errors', async () => {
  await postgres.connect();
  await expect(postgres['client']?.authenticate()).resolves.toBeUndefined();
  await expect(postgres['client']?.close()).resolves.toBeUndefined();
  });
});