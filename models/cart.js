const db = require('../config/db');

const itemAddToCart = async (user_id, product_id, variant_id, quantity) => {
    const checkForItemInCartQuery = `SELECT 1 FROM cart WHERE product_id = $1 AND variant_id = $2 and user_id = $3`;
    try {
        const itemAlreadyInCart = await db.query(checkForItemInCartQuery, [product_id, variant_id, user_id]);
        if (itemAlreadyInCart.rows.length === 0) {
            const insertQuery = `INSERT INTO cart (user_id, product_id, variant_id, quantity) VALUES ($1, $2, $3, $4)`;
            const insertResult = await db.query(insertQuery, [user_id, product_id, variant_id, quantity]);
            return insertResult;
        } else if (itemAlreadyInCart.rows.length > 0) {
            const updateQuantityQuery = `UPDATE cart SET quantity = quantity + $1 WHERE product_id = $2 AND variant_id = $3 AND user_id = $4`;
            const updateQuantityResult = await db.query(updateQuantityQuery, [quantity, product_id, variant_id, user_id]);
            return updateQuantityResult;
        }
    } catch (error) {
        throw (error)
    }
}

const itemRemoveFromCart = async (user_id, product_id, variant_id) => {
    const getQuantityQuery = `SELECT quantity FROM cart WHERE product_id = $1 AND variant_id = $2 AND user_id = $3`;
    try {
        const getQuantityResult = await db.query(getQuantityQuery, [product_id, variant_id, user_id]);
        if (getQuantityResult.rows[0].quantity > 1) {
            const subtractQuantityQuery = `UPDATE cart SET quantity = quantity - $1 WHERE product_id = $2 AND variant_id = $3 AND user_id = $4`;
            const subtractQuantityResult = await db.query(subtractQuantityQuery, [1, product_id, variant_id, user_id]);
            return subtractQuantityResult;
        } else {
            const removeItemQuery = `DELETE FROM cart WHERE product_id = $1 AND variant_id = $2 AND user_id = $3`;
            const removeItemResult = await db.query(removeItemQuery, [product_id, variant_id, user_id]);
            return removeItemResult;
        }
    } catch (error) {
        throw (error);
    }
}

const itemsGetFromCart = async (user_id) => {
    const query = `
    SELECT
    p.name AS name,
    p.price AS price,
    ct.quantity,
    p.description AS description,
    p.manufacturer AS manufacturer,
    v.id AS variant_id,
    v.variant_name AS variant_name,
    v.image1 AS image1,
    v.image2 AS image2,
    v.image3 AS image3,
    v.sale_price AS sale_price,
    c.name AS category_name,
    s.name AS subcategory_name
FROM
    cart ct
JOIN
    products p ON ct.product_id = p.id
JOIN
    categories c ON p.category_id = c.id
JOIN
    subcategories s ON p.subcategory_id = s.id
LEFT JOIN
    variants v ON ct.variant_id = v.id
WHERE
    ct.user_id = $1;
    `;
    try {
        const result = await db.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    itemAddToCart,
    itemRemoveFromCart,
    itemsGetFromCart
}