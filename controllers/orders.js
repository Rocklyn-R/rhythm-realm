const { orderCreate, orderItemsCreate, ordersGetById } = require('../models/orders');

const createOrder = async (req, res) => {
    if (!req.user) {
        user_id = null;
    } else {
        user_id = req.user.id;
    }
    const { 
        order_id,
        total,
        discount,
        total_with_coupon,
        total_tax,
        shipping_type,
        shipping_cost,
        total_with_tax } = req.body;
        console.log(order_id, user_id, total, discount, total_with_coupon, total_tax, shipping_cost, total_tax);
    try {
        const result = await orderCreate(
            order_id, 
            user_id, 
            'pending', 
            total, 
            discount, 
            total_with_coupon,
            total_tax,
            shipping_type,
            shipping_cost,
            total_with_tax);
           
        if (result) {
            res.status(200).json({ order: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const createOrderItems = async (req, res) => {
    const { order_id, variant_id, quantity } = req.body;
    try {
        const result = await orderItemsCreate(order_id, variant_id, quantity);
        if (result) {
            res.status(200).json({ order_item: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}


module.exports = {
    createOrder,
    createOrderItems
}