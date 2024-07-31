const db = require('../config/db');

const orderCreate = async (
    order_id,
    user_id,
    status,
    total,
    discount,
    total_with_coupon,
    total_tax,
    shipping_type,
    shipping_cost,
    total_with_tax
) => {
    const orderQuery = `INSERT INTO orders 
    (id, user_id, status, total, discount, total_with_coupon, total_tax, shipping_type, shipping_cost, total_with_tax)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;


    try {
        const orderResult = await db.query(orderQuery,
            [
                order_id,
                user_id,
                status,
                total,
                discount,
                total_with_coupon,
                total_tax,
                shipping_type,
                shipping_cost,
                total_with_tax
            ]);
            console.log(orderResult);
        return orderResult.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const orderItemsCreate = async (order_id, variant_id, quantity) => {
    const orderItemsQuery = `
    WITH inserted_order_item AS (
        INSERT INTO order_items (order_id, variant_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING order_id, variant_id, quantity
    )
    SELECT i.order_id, i.variant_id, i.quantity, v.image1, v.sale_price, p.price
    FROM inserted_order_item i
    JOIN variants v ON i.variant_id = v.id
    JOIN products p ON v.product_id = p.id`;
    try {
        const orderItemsResult = await db.query(orderItemsQuery, [order_id, variant_id, quantity]);
        return orderItemsResult.rows[0];
    } catch (error) {
        throw error;
    }
}

const orderHistoryGet = async (user_id) => {
    const query = `SELECT
    orders.id,
    orders.order_date,
    orders.status,
    orders.total_with_tax,
    jsonb_agg(jsonb_build_object(
        'variant_id', order_items.variant_id,
        'quantity', order_items.quantity,
        'variant_name', variants.variant_name,
        'image1', variants.image1,
        'name', products.name
    )) as order_items
FROM orders
JOIN order_items ON orders.id = order_items.order_id
JOIN variants ON variants.id = order_items.variant_id
JOIN products ON products.id = variants.product_id
WHERE orders.user_id = $1
GROUP BY orders.id, orders.order_date, orders.status, orders.total_with_tax`
    try {
        const result = await db.query(query, [user_id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const orderFind = async (order_id) => {
    const query = `SELECT * FROM orders WHERE id = $1`;
    try {
        const result = await db.query(query, [order_id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const orderItemsFind = async (order_id) => {
    const query = `    SELECT order_items.order_id,
    order_items.quantity, variants.image1, 
    variants.id as variant_id, variants.sale_price,
    products.price FROM order_items
    JOIN variants ON order_items.variant_id = variants.id
    JOIN products ON variants.product_id = products.id
    WHERE order_id = $1`;
    console.log(query);
    try {
        const result = await db.query(query, [order_id]);
        console.log(result);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}




module.exports = {
    orderCreate,
    orderItemsCreate,
    orderHistoryGet,
    orderFind,
    orderItemsFind
}