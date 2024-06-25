const express = require('express');
const router = express.Router();

const { getCategories, getSubcategories, getFeaturedSubcategories, getFeaturedCategories } = require('../controllers/categories');


const categoriesRouter = express.Router();

categoriesRouter.get("/", getCategories);
categoriesRouter.get('/subcategories', getSubcategories);
categoriesRouter.get('/featured-categories', getFeaturedCategories);
categoriesRouter.get('/featured-subcategories', getFeaturedSubcategories)

module.exports = categoriesRouter;