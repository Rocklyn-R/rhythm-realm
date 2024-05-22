const { productsGet, selectedProductGet } = require('../models/products');

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
    const { name } = req.query;
    console.log(name);
    try {
        const result = await selectedProductGet(name);
        console.log(result);
        if (result) {
            res.status(200).json({ selectedProduct: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getProducts,
    getSelectedProduct
}