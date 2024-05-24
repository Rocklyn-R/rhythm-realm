const express = require('express');
const router = express.Router();
const { getProducts, getSelectedProduct, getAllVariants } = require('../controllers/products');

const productsRouter = express.Router();

productsRouter.get('/', getProducts);

productsRouter.get('/selected-product', getSelectedProduct);

productsRouter.get('/variants', getAllVariants);

module.exports = productsRouter;