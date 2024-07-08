const express = require('express');
const router = express.Router();
const { getProducts, getSelectedProduct, getAllVariants, getManufacturers, getFeaturedProducts, getFeaturedManufacturers } = require('../controllers/products');
const { getReviews, postReview } = require('../controllers/reviews');

const productsRouter = express.Router();

productsRouter.get('/', getProducts);

productsRouter.get('/selected-product', getSelectedProduct);

productsRouter.get('/variants', getAllVariants);

productsRouter.get('/manufacturers', getManufacturers);

productsRouter.get('/manufacturers-featured', getFeaturedManufacturers);

productsRouter.get('/featured-products', getFeaturedProducts);

productsRouter.get('/reviews', getReviews);

productsRouter.post('/review', postReview);


module.exports = productsRouter;