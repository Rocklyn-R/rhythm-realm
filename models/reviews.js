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

const reviewPost = async (user_id, product_id, rating, title, review, name, recommend, verified, order_id) => {
    const query = `
    INSERT INTO reviews (user_id, product_id, rating, title, review, name, recommend, verified, order_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
    try {
      
        const result = await db.query(query, [user_id, product_id, rating, title, review, name, recommend, verified, order_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    reviewsGet,
    reviewPost
}