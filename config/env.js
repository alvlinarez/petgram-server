require('dotenv').config();

const { NODE_ENV, DB_MONGO, JWT_SECRET, PORT, CLIENT_URL } = process.env;

module.exports = {
  env: NODE_ENV,
  clientUrl: CLIENT_URL,
  dbMongo: DB_MONGO,
  jwtSecret: JWT_SECRET,
  port: PORT
};
