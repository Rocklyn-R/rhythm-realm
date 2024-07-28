const express = require('express');
const { createOrder, createOrderItems, getOrderHistory } = require('../controllers/orders');

const ordersRouter = express.Router();

ordersRouter.post('/', createOrder);

ordersRouter.post('/order-items', createOrderItems);

ordersRouter.get('/order-history', getOrderHistory);

module.exports = ordersRouter;