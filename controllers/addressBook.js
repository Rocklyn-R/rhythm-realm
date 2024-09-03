const { newAddressAdd } = require('../models/addressBook');

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
            res.status(200).json({ message: "Address successfully added" });
        }
      } catch {
        res.status(500).json({ message: "Internal Server Error" })
      }
}

module.exports = {
    addNewAddress
}