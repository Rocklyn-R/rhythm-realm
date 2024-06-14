const { productsGet, selectedProductGet, variantsGetAll, manufacturersGet } = require('../models/products');

const getProducts = async (req, res) => {
    const { subcategory, manufacturers } = req.query;
    let manufacturersArray = [];

    // If manufacturers is provided in the query, split it into an array
    if (manufacturers) {
        // Check if manufacturers is already an array, otherwise split the string by commas
        manufacturersArray = Array.isArray(manufacturers) ? manufacturers : manufacturers.split(',');
    }
    

    try {
        const result = await productsGet(subcategory, manufacturersArray);
        if (result) {
            res.status(200).json({ products: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

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
            res.status(200).json({ variants: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getManufacturers = async (req, res) => {
    const { subcategory } = req.query;
    try {
        const result = await manufacturersGet(subcategory);
        if (result) {
            res.status(200).json({ manufacturers: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}



module.exports = {
    getProducts,
    getSelectedProduct,
    getAllVariants,
    getManufacturers
}