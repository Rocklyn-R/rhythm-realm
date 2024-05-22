const { categoriesGet, subcategoriesGet } = require('../models/categories');

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


module.exports = {
    getCategories,
    getSubcategories
}