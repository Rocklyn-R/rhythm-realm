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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;


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

        console.log(orderQuery);
        console.log(orderResult);
        return orderResult.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const orderItemsCreate = async (order_id, variant_id, quantity) => {
    const orderItemsQuery = `INSERT INTO order_items
    (order_id, variant_id, quantity)
    VALUES ($1, $2, $3)`;
    try {
        const orderItemsResult = await db.query(orderItemsQuery, [order_id, variant_id, quantity]);
        return orderItemsResult.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    orderCreate,
    orderItemsCreate
}