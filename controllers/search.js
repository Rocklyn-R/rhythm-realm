const { subcategoriesSearch, manufacturersSearch, productSearch } = require('../models/search');



const searchSubcategories = async (req, res) => {
    const { searchTerm } = req.query;
    //console.log(searchTerm);
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
    //console.log(searchTerm);
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


module.exports = {
    searchSubcategories,
    searchByManufacturers,
    searchByProduct
}