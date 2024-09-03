const db = require('../config/db');

const newAddressAdd = async (
    user_id, 
    name,
    address,
    apartment,
    city,
    state,
    zip_code,
    phone
    ) => {
        const query = `INSERT INTO address_book
        (user_id, name, address, apartment, city, state, zip_code, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        
        try {
            const result = await db.query(query, [user_id, name, address, apartment, city, state, zip_code, phone]);
            if (result) {
                console.log(result);
                return result;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

module.exports = {
    newAddressAdd
}