import mongoose from 'mongoose';
import config from '../config/env.js';

mongoose.set('strictQuery', true);

export const connectMongo = async () => {
  const mongoUri = config.database?.uri;
  if (!mongoUri) {
    throw new Error('MONGODB_URI não definido. Configure o arquivo .env antes de iniciar o servidor.');
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(mongoUri, {
    dbName: config.database?.name || undefined,
  });
  console.log('Conectado ao MongoDB');
};

export const disconnectMongo = async () => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
};
