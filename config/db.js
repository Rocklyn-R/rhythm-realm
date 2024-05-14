const { Pool } = require('pg');
require('dotenv').config();

const DB_USER = process.env.DB_USER;
const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;

const pool = new Pool({
    user: DB_USER,
    host: 'localhost',
    database: DATABASE,
    password: PASSWORD,
    port: 5432,
})

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
}

module.exports = { query };