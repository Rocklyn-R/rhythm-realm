const db = require('../config/db');

const categoriesGet = async () => {
    const query = 'SELECT * FROM categories ORDER BY id';
    try {
        const result = await db.query(query);
        return result.rows
    } catch (error) {
        throw error;
    }
}

const subcategoriesGet = async (id) => {
    const query = 'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY id';
    try {
        const result = await db.query(query, [id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    categoriesGet,
    subcategoriesGet
}