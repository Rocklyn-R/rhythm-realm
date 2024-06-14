const express = require('express');
const router = express.Router();
const { addItemToCart, removeItemFromCart, getItemsFromCart } = require('../controllers/cart');

const cartRouter = express.Router();

cartRouter.post('/add-to-cart', addItemToCart);

cartRouter.put('/remove-from-cart', removeItemFromCart);

cartRouter.get('/', getItemsFromCart);

module.exports = cartRouter;