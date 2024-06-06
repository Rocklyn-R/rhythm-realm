const { itemAddToCart, itemRemoveFromCart } = require('../models/cart');

const addItemToCart = async (req, res) => {
    const { id } = req.user;
    const { product_id, variant_id, quantity } = req.body;
    try {
        const result = await itemAddToCart(id, product_id, variant_id, quantity);
        if (result) {
            res.status(201).json({ message: "Item added to cart" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const removeItemFromCart = async (req, res) => {
    const { id } = req.user;
    const { product_id, variant_id } = req.body;
    console.log(req.user);
    console.log(req.body);
    try {
        const result = await itemRemoveFromCart(id, product_id, variant_id);
        if (result) {
            res.status(200).json({ message: "Item removed from cart" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}



module.exports = {
    addItemToCart,
    removeItemFromCart
}