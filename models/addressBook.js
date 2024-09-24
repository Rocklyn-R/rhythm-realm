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
    const checkQuery = `SELECT id FROM address_book 
        WHERE user_id = $1 
        AND name = $2 
        AND address = $3 
        AND city = $4 
        AND state = $5 
        AND zip_code = $6 
        AND phone = $7
        ${apartment ? 'AND apartment = $8' : 'AND apartment IS NULL'}`;


    const checkParams = [user_id, name, address, city, state, zip_code, phone];
    if (apartment) {
        checkParams.push(apartment);
    }

    const insertQuery = `INSERT INTO address_book
        (user_id, name, address, apartment, city, state, zip_code, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

    const insertParams = [user_id, name, address, apartment, city, state, zip_code, phone];

    try {
        const checkResult = await db.query(checkQuery, checkParams);

        if (checkResult.rows.length > 0) {
            console.log("Address already exists, returning existing ID:", checkResult.rows[0].id);
            return checkResult.rows[0];
        }

        const result = await db.query(insertQuery, insertParams);

        if (result) {
            console.log("New address added:", result.rows[0]);
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

    /*  const checkQuery = `SELECT id FROM address_book 
          WHERE user_id = $1 
          AND name = $2 
          AND address = $3 
          AND city = $4 
          AND state = $5 
          AND zip_code = $6 
          AND phone = $7
          ${apartment ? 'AND apartment = $8' : 'AND apartment IS NULL'}`;
      */

    //const checkParams = [user_id, name, address, city, state, zip_code, phone];
    /*  if (apartment) {
          checkParams.push(apartment);
      }*/

    const query = `UPDATE address_book 
        SET name = $1, 
        address = $2, 
        apartment = $3,
        city = $4,
        state = $5,
        zip_code = $6,
        phone = $7
        WHERE user_id = $8 AND id = $9`;

    //const deleteQuery = `DELETE FROM address_book WHERE id = $1`;
    try {

        const result = await db.query(query, [name, address, apartment, city, state, zip_code, phone, user_id, id]);
        if (result) {
            return result;
        }

    } catch (error) {

        throw error;
    }
}

module.exports = {
    newAddressAdd,
    addressBookGet,
    addressDelete,
    addressEdit
}