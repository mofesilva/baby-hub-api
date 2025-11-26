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
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'baby-hub-dev-secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    admin: {
      name: process.env.ADMIN_NAME || 'Administrador',
      email: process.env.ADMIN_EMAIL || 'admin@babyhub.local',
      password: process.env.ADMIN_PASSWORD || 'changeme',
    },
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 's3',
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      publicBaseUrl: process.env.S3_PUBLIC_BASE_URL,
    },
  },
};

export default config;
