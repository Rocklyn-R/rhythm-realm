const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/products');

const productsRouter = express.Router();

productsRouter.get('/', getProducts);

module.exports = productsRouter;