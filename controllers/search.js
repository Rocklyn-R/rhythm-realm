const {
    subcategoriesSearch,
    manufacturersSearch,
    productSearch,
    recommendedProductsSearch
} = require('../models/search');



const searchSubcategories = async (req, res) => {
    const { searchTerm } = req.query;

    try {
        const result = await subcategoriesSearch(searchTerm);
        if (result) {
            res.status(200).json({ subcategories: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const searchByManufacturers = async (req, res) => {
    const { searchTerm } = req.query;

    try {
        const result = await manufacturersSearch(searchTerm);
        if (result) {
            res.status(200).json({ subcategoriesByBrand: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const searchByProduct = async (req, res) => {
    const { searchTerm } = req.query;
    try {
        const result = await productSearch(searchTerm);
        if (result) {
            res.status(200).json({ productsResults: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const searchRecommendedProducts = async (req, res) => {
    const { brand, subcategories } = req.query;
    let subcategoriesArray = [];
    // If manufacturers is provided in the query, split it into an array
    if (subcategories) {
        subcategoriesArray = Array.isArray(subcategories) ? subcategories : subcategories.split(',');
    }

    try {
        // Call productsGet function with parsed parameters
        const result = await recommendedProductsSearch(brand, subcategoriesArray);
        // Check if result is not empty before sending response
        if (result) {
            res.status(200).json({ products: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}


module.exports = {
    searchSubcategories,
    searchByManufacturers,
    searchByProduct,
    searchRecommendedProducts
}