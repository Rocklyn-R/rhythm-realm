const express = require('express');
const { createOrder, createOrderItems, getOrderHistory, findOrder, getFullOrder, createOrderShipping } = require('../controllers/orders');

const ordersRouter = express.Router();

ordersRouter.post('/', createOrder);

ordersRouter.post('/order-items', createOrderItems);

ordersRouter.post('/order-shipping', createOrderShipping);

ordersRouter.get('/order-history', getOrderHistory);

ordersRouter.get('/return', findOrder);

ordersRouter.get('/get-order', getFullOrder);

module.exports = ordersRouter;