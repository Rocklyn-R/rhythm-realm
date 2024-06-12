const db = require('../config/db');

const productsGet = async (subcategoryName) => {
    const query = `
    SELECT 
        p.name AS name, 
        p.price, 
        p.description, 
        p.manufacturer, 
        p.id, 
        v.id as variant_id,
        v.variant_name, 
        v.image1, 
        v.image2, 
        v.image3, 
        c.name AS category_name, 
        s.name AS subcategory_name
    FROM 
        products p
    JOIN 
        categories c ON p.category_id = c.id
    JOIN 
        subcategories s ON p.subcategory_id = s.id
    JOIN 
        variants v ON p.id = v.product_id
    WHERE 
        s.name = $1
    ORDER BY 
        p.id
    `;
    try {
        const result = await db.query(query, [subcategoryName]);
        console.log(result.rows);
        return result.rows
    } catch (error) {
        throw error;
    }
}

const selectedProductGet = async (name, variant) => {
    const query = `SELECT products.name AS name, 
    products.price, 
    products.description, 
    products.manufacturer, 
    products.id, 
    variants.id as variant_id,
    variants.variant_name, 
    variants.image1, 
    variants.image2, 
    variants.image3, 
    categories.name AS category_name, 
    subcategories.name AS subcategory_name 
    FROM products
    JOIN variants ON products.id = variants.product_id
    JOIN categories ON products.category_id = categories.id
    JOIN subcategories ON products.subcategory_id = subcategories.id
    WHERE products.name = $1 AND variants.variant_name = $2`;
    try {
        const result = await db.query(query, [name, variant]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const variantsGetAll = async (id) => {
    const query = `SELECT products.*, variants.*
    FROM products
    JOIN variants ON products.id = variants.product_id
    WHERE products.id = $1`
    try {
        const result = await db.query(query, [id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    productsGet,
    selectedProductGet,
    variantsGetAll
}