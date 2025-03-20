const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config()
const { Pool } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const database = process.env.DATABASE_URL
const databaseConfig = {
      connectionString: database
}
const connection = new Pool(databaseConfig);

module.exports = connection