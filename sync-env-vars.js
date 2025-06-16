const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

require('dotenv').config({ path: '.env.test' });

const requiredVars = ['PGUSER', 'PGPASSWORD', 'PGHOST', 'PGPORT', 'PGDATABASE'];

const envVars = {};

for (const v of requiredVars) {
  const val = process.env[v];
  if (!val) {
    console.error(`❌ Falta variable ${v} en .env.test`);
    process.exit(1);
  }
  envVars[v] = val;
}

console.log('✅ Variables sincronizadas:');
console.log(envVars);
