const { productsGet } = require('../models/products');

const getProducts = async (req, res) => {
    const { subcategory } = req.query;
    try {
        const result = await productsGet(subcategory);
        //console.log(result.rows)
        if (result) {
            res.status(200).json({ products: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getProducts
}