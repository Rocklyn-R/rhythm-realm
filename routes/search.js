const express = require('express');
const router = express.Router();
const { searchSubcategories, searchByManufacturers } = require('../controllers/search');

const searchRouter = express.Router();

searchRouter.get('/', searchSubcategories);

searchRouter.get('/bybrand', searchByManufacturers);

module.exports = searchRouter;