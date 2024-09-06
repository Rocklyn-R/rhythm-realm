const { newAddressAdd, addressBookGet, addressDelete } = require('../models/addressBook');

const addNewAddress = async (req, res) => {
    const user_id = req.user.id;
    const { 
        name,
        address, 
        apartment, 
        city, 
        state, 
        zip_code, 
        phone } = req.body;
        console.log(user_id);
        console.log(name);
        console.log(address);
        console.log(apartment);
        console.log(city);
        console.log(state);
        console.log(zip_code);
        console.log(phone);
        const apartmentValue = apartment === "" ? null : apartment;
    try {
       
        const result = await newAddressAdd(user_id, name, address, apartmentValue, city, state, zip_code, phone);
        console.log(result);
        if (result) {
            res.status(200).json({ id: result });
        }
      } catch {
        res.status(500).json({ message: "Internal Server Error" })
      }
}

const getAddressBook = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await addressBookGet(user_id);
        
        if (result) {
            res.status(200).json({ addressBook: result });
        }
      } catch {
        res.status(500).json({ message: "Internal Server Error" })
      }
}

const deleteAddress = async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.body;
    try {
        const result = await addressDelete(user_id, id);
        
        if (result) {
            res.status(200).json({ message: "Address successfully deleted" });
        }
      } catch {
        res.status(500).json({ message: "Internal Server Error" })
      }
}

module.exports = {
    addNewAddress,
    getAddressBook,
    deleteAddress
}