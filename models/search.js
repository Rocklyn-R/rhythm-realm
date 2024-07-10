const db = require('../config/db');

const subcategoriesSearch = async (searchTerm) => {
    const query = `
    SELECT subcategories.name as subcategory_name, 
    subcategories.image, 
    subcategories.id, 
    subcategories.alt_name as subcategory_alt_name,
    categories.name as category_name, 
    categories.alt_name as category_alt_name
    FROM subcategories 
    JOIN categories ON categories.id = subcategories.category_id
    WHERE categories.name ILIKE '%' || $1 || '%' OR categories.alt_name ILIKE '%' || $1 || '%' 
    OR subcategories.name ILIKE '%' || $1 || '%' OR subcategories.alt_name ILIKE '%' || $1 || '%'`;
    try {
        const result = await db.query(query, [searchTerm]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const manufacturersSearch = async (searchTerm) => {
    const query = `
    SELECT DISTINCT subcategories.name as subcategory_name, 
    subcategories.image, 
    subcategories.id, 
    categories.name as category_name, 
    categories.alt_name as category_alt_name,
    subcategories.alt_name as subcategory_alt_name,
    products.manufacturer
    FROM subcategories
    JOIN categories ON categories.id = subcategories.category_id
    JOIN products ON products.subcategory_id = subcategories.id
    WHERE products.manufacturer ILIKE '%' || $1 || '%'
    ORDER BY subcategories.id;`;
    try {
        const result = await db.query(query, [searchTerm]);
        console.log(result);
        return result.rows;
    } catch (error) {
        throw error;
    }
}


const productSearch = async (searchTerm) => {
    const query = `
    SELECT products.id,
    products.name,
    variants.variant_name,
    variants.image1,
    subcategories.name as subcategory_name,
    subcategories.alt_name as subcategory_alt_name,
    categories.name as category_name,
    categories.alt_name as category_alt_name,
    products.manufacturer
    FROM products
    JOIN variants ON variants.product_id = products.id
    JOIN subcategories ON subcategories.id = products.subcategory_id
    JOIN categories ON categories.id = products.category_id
    WHERE products.name ILIKE '%' || $1 || '%'
    OR variants.variant_name ILIKE '%' || $1 || '%'
    ORDER BY products.name`;
    try {
        const result = await db.query(query, [searchTerm]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subcategoriesSearch,
    manufacturersSearch,
    productSearch
}