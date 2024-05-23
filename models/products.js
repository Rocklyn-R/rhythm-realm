const db = require('../config/db');

const productsGet = async (name) => {
    const query = `SELECT products.*, variants.* FROM products 
    JOIN subcategories ON products.subcategory_id = subcategories.id
    JOIN variants ON products.id = variants.product_id 
    WHERE subcategories.name = $1
    ORDER BY products.id`;

    try {
        const result = await db.query(query, [name]);
        return result.rows
    } catch (error) {
        throw error;
    }
}

const selectedProductGet = async (name, variant) => {
    const query = `SELECT products.*, variants.* FROM products
    JOIN variants ON products.id = variants.product_id
    WHERE products.name = $1 AND variants.variant_name = $2`;
    try {
        const result = await db.query(query, [name, variant]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const variantsGetAll = async (id) => {
    const query = `SELECT prodcuts.*, variants.*
    FROM products 
    JOIN variants ON products.id = variants.product_id
    WHERE product.id = $1`
    try {
        const result = await db.query(query, [id]);
        return result.rows
    } catch (error) {
        throw error;
    }
}

module.exports = {
    productsGet,
    selectedProductGet,
    variantsGetAll
}