const { reviewsGet, reviewPost } = require('../models/reviews');

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

const postReview = async (req, res) => {
    const {product_id, rating, title, review, name, recommend, order_id} = req.body;
    let user_id;
    let verified;
    if (!req.user) {
        user_id = null;
    } else {
        user_id = req.user.id;
    }
    if (!order_id) {
        verified = false;
    }
    try {
        console.log(req.body);
        const result = await reviewPost(user_id, product_id, rating, title, review, name, recommend, verified, order_id);
        if (result) {
            res.status(201).json({ review: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    getReviews,
    postReview
}