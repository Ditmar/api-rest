import { BaseCollection } from '../base-collection/baseCollection';
import dotenv from 'dotenv';
import { CreationAttributes, Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { BaseModel } from './model/baseModel';

dotenv.config();

class Postgres extends BaseCollection {
  private client: Sequelize | null = null;

  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        this.client = null;
      } catch (error) {
        throw new Error(
          `Failed to disconnect from Postgres: ${(error as Error).message}`
        );
      }
    }
  }

  async connect(): Promise<void> {
    try {
      const sequelize = new Sequelize({
        dialect: PostgresDialect,
        database: process.env.PGDATABASE || 'postgres',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'password',
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT || '5432', 10),
        ssl: process.env.PGSSL === 'true' ? true : false,
        clientMinMessages: 'notice',
        models: [BaseModel],
      });

      await sequelize.authenticate();
      this.client = sequelize;
    } catch (error) {
      throw new Error(
        `Failed to connect to Postgres: ${(error as Error).message}`
      );
    }
  }

  get(): Promise<unknown> {
    if (!this.client) {
      throw new Error('Postgres client is not connected.');
    }

    return BaseModel.findAll();
  }

  post(body: unknown): Promise<unknown> {
    if (!this.client) {
      throw new Error('Postgres client is not connected.');
    }

    return BaseModel.create(body as CreationAttributes<BaseModel>);
  }

  delete(body: unknown): Promise<unknown> {
    if (!this.client) {
      throw new Error('Postgres client is not connected.');
    }

    return BaseModel.destroy({ where: body as Record<string, unknown> });
  }

  put(body: unknown): Promise<unknown> {
    if (!this.client) {
      throw new Error('Postgres client is not connected.');
    }

    return BaseModel.update(body as CreationAttributes<BaseModel>, {
      where: body as Record<string, unknown>,
    });
  }

  getById(id: string): Promise<unknown> {
    throw new Error(`getById not implemented in PokeApi - ${id}`);
  }

  postArticle(body: unknown): Promise<unknown> {
    throw new Error(`postArticle not implemented in PokeApi - ${body}`);
  }
}

export { Postgres };