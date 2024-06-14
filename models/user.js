const db = require('../config/db');

const userCreate = async (first_name, last_name, email, password) => {
    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await db.query(query, [first_name, last_name, email, password]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users where email = $1';
    try {
        const result = await db.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const findUserById = async (id) => {
    const query = 'SELECT * FROM users where id = $1';
    try {
        const result = await db.query(query, [id]);
        return result.rows[0]
    } catch (error) {
        throw error;
    }
};




module.exports = {
    userCreate,
    findUserByEmail,
    findUserById,
};