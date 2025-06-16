import { connectMongo, disconnectMongo } from './src/test/mongo-public-wrapper';
import './src/test/postgres-public-wrapper';
import './src/test/global-hooks';

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env.test');
if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('❌ Error al cargar .env.test:', result.error);
    process.exit(1);
  } else {
    console.log('✅ Variables cargadas desde .env.test');
  }
} else {
  console.warn('⚠️ Archivo .env.test no encontrado');
}

export async function setup() {
  await connectMongo();
}

export async function teardown() {
  await disconnectMongo();
}
