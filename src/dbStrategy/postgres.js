const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config()
const { Pool } = pg;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const connection = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT_DB
});

module.exports = connection