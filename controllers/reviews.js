const { reviewsGet } = require('../models/reviews');

const getReviews = async (req, res) => {
    const { product_id } = req.query;
    try {
        const result = await reviewsGet(product_id);
        if (result) {
            res.status(200).json({ reviews: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getReviews
}