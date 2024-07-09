const express = require('express');
const router = express.Router();
const { searchSubcategories, searchByManufacturers, searchByProduct } = require('../controllers/search');

const searchRouter = express.Router();

searchRouter.get('/', searchSubcategories);

searchRouter.get('/bybrand', searchByManufacturers);

searchRouter.get('/byproduct', searchByProduct)

module.exports = searchRouter;