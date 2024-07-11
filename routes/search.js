const express = require('express');
const { getAverageRating } = require('../controllers/reviews');
const router = express.Router();
const { searchSubcategories, searchByManufacturers, searchByProduct, searchRecommendedProducts } = require('../controllers/search');

const searchRouter = express.Router();

searchRouter.get('/', searchSubcategories);

searchRouter.get('/bybrand', searchByManufacturers);

searchRouter.get('/byproduct', searchByProduct);

searchRouter.get('/recommended-products', searchRecommendedProducts);



module.exports = searchRouter;