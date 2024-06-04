const { productsGet, selectedProductGet, variantsGetAll } = require('../models/products');

const getProducts = async (req, res) => {
    const { subcategory } = req.query;
    try {
        const result = await productsGet(subcategory);
        if (result) {
            res.status(200).json({ products: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getSelectedProduct = async (req, res) => {
    const { name, variant } = req.query;
    try {
        const result = await selectedProductGet(name, variant);
        if (result) {
            res.status(200).json({ selectedProduct: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getAllVariants = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await variantsGetAll(id);
        if (result) {
            res.status(200).json({ variants: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getProducts,
    getSelectedProduct,
    getAllVariants
}