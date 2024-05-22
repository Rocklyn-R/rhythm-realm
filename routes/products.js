const express = require('express');
const router = express.Router();
const { getProducts, getSelectedProduct } = require('../controllers/products');

const productsRouter = express.Router();

productsRouter.get('/', getProducts);

productsRouter.get('/selected-product', getSelectedProduct);

module.exports = productsRouter;