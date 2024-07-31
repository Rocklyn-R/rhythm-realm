const express = require('express');
const { createOrder, createOrderItems, getOrderHistory, findOrder, getFullOrder } = require('../controllers/orders');

const ordersRouter = express.Router();

ordersRouter.post('/', createOrder);

ordersRouter.post('/order-items', createOrderItems);

ordersRouter.get('/order-history', getOrderHistory);

ordersRouter.get('/return', findOrder);

ordersRouter.get('/get-order', getFullOrder);

module.exports = ordersRouter;