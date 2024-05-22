const db = require('../config/db');

const productsGet = async (name) => {
    const query = `SELECT products.* FROM products 
    JOIN subcategories ON products.subcategory_id = subcategories.id 
    WHERE subcategories.name = $1
    ORDER BY id`;

    try {
        const result = await db.query(query, [name]);
        console.log(result.rows);
        return result.rows
    } catch (error) {
        throw error;
    }
}

module.exports = {
    productsGet
}