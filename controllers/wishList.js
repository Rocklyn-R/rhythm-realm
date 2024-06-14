const { wishListAdd, wishListRemove, wishListGet } = require('../models/wishList');

const addToWishList = async (req, res) => {
    const { product_id, variant_id } = req.body;
    const user_id = req.user.id;
    try {
        const result = await wishListAdd(user_id, product_id, variant_id);
        if (result) {
            res.status(201).json({message: "Added to wish list"})
        }
    } catch (error) {
        res.status(500).json({message: 'Failed to Add to Wish List'})
    }
};

const removeFromWishList = async (req, res) => {
    const { product_id, variant_id } = req.body;
    const user_id = req.user.id;
    try {
        const result = await wishListRemove(user_id, product_id, variant_id);
        if (result) {
            res.status(200).json({ message: "Removed from wish list" })
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to remove from wish list"})
    }
}

const getWishList = async (req, res) => {
    const { id } = req.user;
    try {
        const result = await wishListGet(id);
        if (result) {
            res.status(200).json({ wishList: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve wish list"})
    }
}

module.exports = {
    addToWishList,
    removeFromWishList,
    getWishList
}