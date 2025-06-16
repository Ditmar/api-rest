import { afterEach } from 'vitest';
import { cleanSequelizeModels } from './postgres-public-wrapper';
import { beforeAll, afterAll } from 'vitest';

import {
  connectPostgres,
  disconnectPostgres,
} from '../test/postgres-public-wrapper';

beforeAll(async () => {
  console.log('✅ Conectando a PostgreSQL en entorno de test...');
  await connectPostgres();
});

afterAll(async () => {
  await disconnectPostgres();
  cleanSequelizeModels();
  console.log('🧹 Conexión y modelos de Sequelize limpiados');
});
