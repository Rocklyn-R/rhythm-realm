const { categoriesGet, subcategoriesGet } = require('../models/categories');
const { featuredCategoriesGet, featuredSubcategoriesGet } = require('../models/categories');

const getCategories = async (req, res) => {
    try {
        const result = await categoriesGet();
        if (result) {
            res.status(200).json({ categories: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getSubcategories = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await subcategoriesGet(id);
        if (result) {
            res.status(200).json({ subcategories: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}


const getFeaturedCategories = async (req, res) => {
    const { marketingLabel, manufacturers, priceMin, priceMax } = req.query;
    let manufacturersArray = []
     // If manufacturers is provided in the query, split it into an array
     if (manufacturers) {
        manufacturersArray = Array.isArray(manufacturers) ? manufacturers : manufacturers.split(',');
    }

    const parsedPriceMin = priceMin !== undefined ? parseFloat(priceMin) : undefined;
    const parsedPriceMax = priceMax !== undefined ? parseFloat(priceMax) : undefined;

    try {
        const result = await featuredCategoriesGet(marketingLabel, manufacturersArray, parsedPriceMin, parsedPriceMax);
        if (result) {
            res.status(200).json({ categories: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getFeaturedSubcategories = async (req, res) => {
    const { marketingLabel, categories, manufacturers, priceMin, priceMax } = req.query;
    let categoriesArray = [];
  
    if (categories) {
        categoriesArray = Array.isArray(categories) ? categories : categories.split(',');
    }
    let manufacturersArray = []
     // If manufacturers is provided in the query, split it into an array
     if (manufacturers) {
        manufacturersArray = Array.isArray(manufacturers) ? manufacturers : manufacturers.split(',');
    }

    const parsedPriceMin = priceMin !== undefined ? parseFloat(priceMin) : undefined;
    const parsedPriceMax = priceMax !== undefined ? parseFloat(priceMax) : undefined;

    try {
        const result = await featuredSubcategoriesGet(marketingLabel, categoriesArray, manufacturersArray, parsedPriceMin, parsedPriceMax);
        if (result) {
            res.status(200).json({ subcategories: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getCategories,
    getSubcategories,
    getFeaturedCategories,
    getFeaturedSubcategories
}