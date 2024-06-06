const express = require('express');
const router = express.Router();
const { addItemToCart, removeItemFromCart } = require('../controllers/cart');

const cartRouter = express.Router();

cartRouter.post('/add-to-cart', addItemToCart);

cartRouter.put('/remove-from-cart', removeItemFromCart);

module.exports = cartRouter;