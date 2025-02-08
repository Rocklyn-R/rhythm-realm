const { Pool } = require('pg');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

/*const DB_USER = process.env.DB_USER;
const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;*/

const poolConfig = process.env.NODE_ENV === 'production'
  ? {
    connectionString: process.env.INTERNAL_DATABASE_URL, // Use the DATABASE_URL provided by Render
    ssl: {
      rejectUnauthorized: false, // Required for connecting securely to Render's PostgreSQL
    },
  } : {
    connectionString: process.env.EXTERNAL_DATABASE_URL, // Use the DATABASE_URL provided by Render
    ssl: {
      rejectUnauthorized: false, // Required for connecting securely to Render's PostgreSQL
    },
  }

/*const pool = new Pool({
    user: DB_USER,
    host: 'localhost',
    database: DATABASE,
    password: PASSWORD,
    port: 5432,
})*/
const pool = new Pool(poolConfig);

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
}

module.exports = { query };