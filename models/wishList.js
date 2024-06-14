const db = require('../config/db');

const wishListAdd = async (user_id, product_id, variant_id) => {
    const query = 'INSERT INTO wish_list (user_id, product_id, variant_id) VALUES ($1, $2, $3)';
    try {
        const result = await db.query(query, [user_id, product_id, variant_id]);
        return result;
    } catch (error) {
        throw error;
    }
};

const wishListRemove = async (user_id, product_id, variant_id) => {
    const query = `
    DELETE FROM wish_list
    WHERE user_id = $1
    AND product_id = $2
    AND variant_id = $3`
    try {
        const result = await db.query(query, [user_id, product_id, variant_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

const wishListGet = async (user_id) => {
    const query = `
    SELECT 
    p.name AS product_name, 
    p.price, 
    p.description, 
    p.manufacturer, 
    v.id AS variant_id, 
    v.variant_name, 
    v.image1, 
    v.image2, 
    v.image3, 
    v.sale_price, 
    c.name AS category_name, 
    s.name AS subcategory_name
FROM 
    wish_list wl
JOIN 
    products p ON wl.product_id = p.id
JOIN 
    categories c ON p.category_id = c.id
JOIN 
    subcategories s ON p.subcategory_id = s.id
JOIN 
    variants v ON wl.variant_id = v.id
WHERE 
    wl.user_id = $1;
    `
    try {
        const result = await db.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    wishListAdd,
    wishListRemove,
    wishListGet
}