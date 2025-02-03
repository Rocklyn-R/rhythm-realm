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


const userNameUpdate = async (first_name, last_name, user_id) => {
    const query = `UPDATE users
   SET first_name = $1, last_name = $2
   WHERE id = $3`;
    try {
        const result = await db.query(query, [first_name, last_name, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

const emailUpdate = async (email, user_id) => {
    const query = `UPDATE users
   SET email = $1
   WHERE id = $2`;
    try {
        const result = await db.query(query, [email, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

const passwordUpdate = async (password, user_id) => {
    const query = `UPDATE users
    SET password = $1
    WHERE id = $2`
    try {
        const result = await db.query(query, [password, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

const tokenAdd = async (user_id, token, expires_at) => {
    const query = "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)";
    try {
        const result = await db.query(query, [user_id, token, expires_at]);
        return result;
    } catch (error) {
        throw error;
    }
}


const tokenCheck = async (token) => {
    const query = "SELECT * FROM password_resets WHERE token = $1";
    try {
        const result = await db.query(query, [token]);
        if (result.rows.length === 0) {
            return {valid: false, message: "Token not found", user_id: ""};
        }
        const resetData = result.rows[0];
        const currentTime = Date.now();
        const expiresAt = new Date(resetData.expires_at);
        if (currentTime > expiresAt) {
            return {valid: false, message: "Token expired", user_id: ""}
        }
        return {valid: true, message: "Token valid", user_id: resetData.user_id};
    } catch (error) {
        throw error;
    }
}

const passwordReset = async (password, user_id) => {
    const query = "UPDATE users SET password = $1 WHERE id = $2";
    try {
        const result = await db.query(query, [password, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    userCreate,
    findUserByEmail,
    findUserById,
    userNameUpdate,
    emailUpdate,
    passwordUpdate,
    tokenAdd,
    tokenCheck,
    passwordReset
};