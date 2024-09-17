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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
        
        try {
            const result = await db.query(query, [user_id, name, address, apartment, city, state, zip_code, phone]);
            if (result) {
                console.log(result);
                return result.rows[0];
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

const addressBookGet = async (user_id) => {
    const query = `SELECT * FROM address_book WHERE user_id = $1`;
    try {
        const result = await db.query(query, [user_id]);
        if (result) {
            return result.rows;
        }
    } catch (error) {
        throw error;
    }
}

const addressDelete = async (user_id, id) => {
    const query = `DELETE FROM address_book WHERE user_id = $1 and id = $2`;
    try {
        const result = await db.query(query, [user_id, id]);
        if (result) {
            return result;
        }
    } catch (error) {
        throw error;
    }
}

const addressEdit = async (
    user_id, 
    id,
    name,
    address,
    apartment,
    city,
    state,
    zip_code,
    phone) => {
        const query = `UPDATE address_book 
        SET name = $1, 
        address = $2, 
        apartment = $3,
        city = $4,
        state = $5,
        zip_code = $6,
        phone = $7
        WHERE user_id = $8 AND id = $9`
        try {
            const result = await db.query(query, [name, address, apartment, city, state, zip_code, phone, user_id, id]);
            if (result) {
                return result;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
}

module.exports = {
    newAddressAdd,
    addressBookGet,
    addressDelete,
    addressEdit
}