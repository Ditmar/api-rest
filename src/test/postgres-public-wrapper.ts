/// <reference types="vitest" />
import { Sequelize } from '@sequelize/core';
import { Postgres } from '../data-collection/postgres/Postgres';
import { beforeAll, afterAll } from 'vitest';

const postgres = new Postgres();

export const connectPostgres = async () => {
  await postgres.connect();
};

export const disconnectPostgres = async () => {
  await postgres.disconnect();
};

export const cleanSequelizeModels = () => {
  const { Sequelize } = require('sequelize');

  for (const key in Sequelize.models) {
    delete Sequelize.models[key];
  }

  Sequelize._cls = undefined;
};
export { postgres };
