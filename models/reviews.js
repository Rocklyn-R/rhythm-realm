const db = require('../config/db');

const reviewsGet = async (product_id) => {
    const query = 'SELECT * FROM reviews WHERE product_id = $1';
    try {
        const result = await db.query(query, [product_id]);
        return result.rows
    } catch (error) {
        throw error;
    }
}

module.exports = {
    reviewsGet
}