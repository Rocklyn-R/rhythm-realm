const express = require('express');
const { addNewAddress, getAddressBook, deleteAddress, editAddress } = require("../controllers/addressBook");

const addressBookRouter = express.Router();

addressBookRouter.post('/add', addNewAddress);

addressBookRouter.get('/', getAddressBook);

addressBookRouter.delete('/', deleteAddress);

addressBookRouter.put('/', editAddress);

module.exports = addressBookRouter;