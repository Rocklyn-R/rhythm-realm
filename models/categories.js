const db = require('../config/db');

const categoriesGet = async () => {
    const query = 'SELECT * FROM categories ORDER BY id';
    try {
        const result = await db.query(query);
        console.log(result.rows)
        return result.rows
    } catch (error) {
        throw error;
    }
}

module.exports = {
    categoriesGet
}