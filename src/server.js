import app from './app.js';
import config from './config/env.js';
import { connectMongo } from './db/mongoose.js';
import { seedProductsIfNeeded } from './repositories/products.js';

const start = async () => {
  try {
    await connectMongo();
    await seedProductsIfNeeded();

    app.listen(config.port, () => {
      console.log(`API ouvindo na porta ${config.port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor', error);
    process.exit(1);
  }
};

start();
