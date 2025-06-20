// src/App.ts
import express from 'express';
import userRoutes from './user/userRoutes';
import { ConfigSingleton } from './config/config';
import MongoConnection from './db';

const app = express();

app.use(express.json());
app.use('/indexes', userRoutes);

const PORT = ConfigSingleton.getInstance().PORT;

(async () => {
  await MongoConnection.connect();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
