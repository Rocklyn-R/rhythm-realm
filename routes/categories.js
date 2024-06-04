const express = require('express');
const router = express.Router();

const { getCategories, getSubcategories } = require('../controllers/categories');


const categoriesRouter = express.Router();

categoriesRouter.get("/", getCategories);
categoriesRouter.get('/subcategories', getSubcategories);

module.exports = categoriesRouter;