const secureKey = process.env.SECURE_KEY || 'securityKeyDevMode';
const localConfig = {
  serverPort: process.env.SERVER_PORT,
  mongo: {
    host: process.env.MONGO_HOST,
    database: process.env.MONGO_DATABASE,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    config: process.env.MONGO_CONFIG,
  },
  secureKey,
};

module.exports = localConfig;
