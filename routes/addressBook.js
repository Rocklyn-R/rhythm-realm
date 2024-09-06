const express = require('express');
const { addNewAddress, getAddressBook, deleteAddress } = require("../controllers/addressBook");

const addressBookRouter = express.Router();

addressBookRouter.post('/add', addNewAddress);

addressBookRouter.get('/', getAddressBook);

addressBookRouter.delete('/', deleteAddress)

module.exports = addressBookRouter;