const { orderCreate, orderItemsCreate, orderHistoryGet, orderFind, orderItemsFind, orderShippingCreate } = require('../models/orders');

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

const getOrderHistory = async (req, res) => {
    const user_id = req.user.id
    console.log(user_id);
    try {
        const result = await orderHistoryGet(user_id);
        if (result) {
            res.status(200).json({ orders: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const findOrder = async (req, res) => {
    const { order_id } = req.query;
    try {
        const result = await orderFind(order_id);
        if (result) {
            res.status(200).json({ order: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getFullOrder = async (req, res) => {
    const { order_id } = req.query;
    try {
        const orderResult = await orderFind(order_id);
        const orderItemsResult = await orderItemsFind(order_id);
        if (orderResult && orderItemsResult) {
            res.status(200).json({ order: orderResult, orderItems: orderItemsResult });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const createOrderShipping = async (req, res) => {
  const {order_id, name, address, apartment, city, state, zip_code, phone, email} = req.body;
  try {
    const orderShipping = await orderShippingCreate(order_id, name, address, apartment, city, state, zip_code, phone, email);
    if (orderShipping) {
        res.status(200).json({ orderShipping: orderShipping });
    }
  } catch {
    res.status(500).json({ message: "Internal Server Error" })
  }
}


module.exports = {
    createOrder,
    createOrderItems,
    getOrderHistory,
    findOrder,
    getFullOrder,
    createOrderShipping
}