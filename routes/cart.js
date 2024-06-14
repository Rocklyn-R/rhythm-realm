const express = require('express');
const router = express.Router();
const { addItemToCart, removeItemFromCart, getItemsFromCart, replaceCart, insertMultipleIntoCart } = require('../controllers/cart');

const cartRouter = express.Router();

cartRouter.post('/add-to-cart', addItemToCart);

cartRouter.put('/remove-from-cart', removeItemFromCart);

cartRouter.get('/', getItemsFromCart);

cartRouter.put('/replace-cart', replaceCart);

cartRouter.put('/insert-multiple', insertMultipleIntoCart);

module.exports = cartRouter;