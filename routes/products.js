const express = require('express');
const router = express.Router();
const { getProducts, getSelectedProduct, getAllVariants, getManufacturers, getSaleItems } = require('../controllers/products');

const productsRouter = express.Router();

productsRouter.get('/', getProducts);

productsRouter.get('/selected-product', getSelectedProduct);

productsRouter.get('/variants', getAllVariants);

productsRouter.get('/manufacturers', getManufacturers);

productsRouter.get('/featured-deals', getSaleItems);

module.exports = productsRouter;