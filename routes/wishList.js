const express = require('express');
const { addToWishList, removeFromWishList, getWishList } = require('../controllers/wishList');


const wishListRouter = express.Router();

wishListRouter.post("/", addToWishList);

wishListRouter.delete("/", removeFromWishList);

wishListRouter.get("/", getWishList);


module.exports = wishListRouter;