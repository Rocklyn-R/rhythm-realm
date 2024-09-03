const express = require('express');
const { addNewAddress } = require("../controllers/addressBook");

const addressBookRouter = express.Router();

addressBookRouter.post('/add', addNewAddress);

module.exports = addressBookRouter;