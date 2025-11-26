import 'dotenv/config';

const config = {
  port: process.env.PORT || 4000,
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.MONGODB_DB_NAME,
  },
  pix: {
    key: process.env.PIX_KEY || '00000000-0000-0000-0000-000000000000',
    recipient: process.env.PIX_RECIPIENT_NAME || 'Pais do bebê',
    description: process.env.PIX_DESCRIPTION || 'Doação Chá de Bebê',
  },
};

export default config;
