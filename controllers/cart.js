const { itemAddToCart, itemRemoveFromCart, itemsGetFromCart, cartDelete, cartInsert } = require('../models/cart');

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
    try {
        const result = await itemRemoveFromCart(id, product_id, variant_id);
        if (result) {
            res.status(200).json({ message: "Item removed from cart" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getItemsFromCart = async (req, res) => {
    const { id } = req.user;
    try {
        const result = await itemsGetFromCart(id);
        if (result) {
            res.status(200).json({ cart: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const replaceCart = async (req, res) => {
    const user_id = req.user.id;
    const { cart } = req.body;
    try {
        const deletion = await cartDelete(user_id);
        if (deletion) {
            for (const item of cart) {
                await cartInsert(user_id, item.id, item.variant_id, item.quantity);
            }
            res.status(200).json({ message: "Cart replaced" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const insertMultipleIntoCart = async (req, res) => {
    const user_id = req.user.id;
    const { cart } = req.body;
    try {
        for (const item of cart) {
            await itemAddToCart(user_id, item.id, item.variant_id, item.quantity);
        }
        res.status(200).json({ message: "Inserted into cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}



module.exports = {
    addItemToCart,
    removeItemFromCart,
    getItemsFromCart,
    replaceCart,
    insertMultipleIntoCart
}