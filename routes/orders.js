const express = require('express');
const { createOrder, createOrderItems } = require('../controllers/orders');

const ordersRouter = express.Router();

ordersRouter.post('/', createOrder);

ordersRouter.post('/order-items', createOrderItems);



module.exports = ordersRouter;