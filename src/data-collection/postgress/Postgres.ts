import { BaseCollection } from "../base-collection/baseCollection";
import { Pool, QueryResult } from 'pg';

let pgPool: Pool | null = null;
let isPostgresConnected = false;

const connectPostgres = async () => {
  if (isPostgresConnected && pgPool) return;
  pgPool = new Pool({
    user: process.env.PG_USER || 'testuser',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'test_db',
    password: process.env.PG_PASSWORD || 'password',
    port: parseInt(process.env.PG_PORT || '5432')
  });
  await pgPool.query('SELECT 1');
  isPostgresConnected = true;
};

const disconnectPostgres = async () => {
  if (!pgPool) return;
  await pgPool.end();
  pgPool = null;
  isPostgresConnected = false;
};

const clearPostgresDatabase = async () => {
  if (!pgPool) return;
  await pgPool.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);
};


class Postgres extends BaseCollection {
    get(): Promise<unknown> {
        return new Promise((resolve) => {
            resolve([{data: "postgress"}, {data: "postgress"}])
        });
    }
    post(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    delete(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    put(body: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }


  async getById(id: string): Promise<unknown> {
    throw new Error("getById not implemented in PokeApi");
  }

  async postArticle(body: unknown): Promise<unknown> {
    throw new Error("postArticle not implemented in PokeApi");
  }

}
export {
  connectPostgres,
  disconnectPostgres,
  clearPostgresDatabase,
};
export { Postgres }
