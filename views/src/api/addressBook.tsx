export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://rhythm-realm-backend.onrender.com'
    : 'http://localhost:4000';


export const addNewAddress = async (
    name: string,
    address: string,
    apartment: string,
    city: string,
    state: string,
    zip_code: string,
    phone: string
) => {
    try {
        const response = await fetch(`${BASE_URL}/address-book/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                name,
                address,
                apartment,
                city,
                state,
                zip_code,
                phone
            })
        });

        const data = await response.json();
        if (response.ok) {
            return data.id.id;
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getAddressBook = async () => {
    try {
        const response = await fetch(`${BASE_URL}/address-book/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
            return data.addressBook;
        }

    } catch (error) {
        throw error;
    }
}

export const deleteAddress = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/address-book/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ id })
        });

        return response.ok;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const editAddress = async (
    id: number,
    name: string,
    address: string,
    apartment: string,
    city: string,
    state: string,
    zip_code: string,
    phone: string
) => {
    try {
        const response = await fetch(`${BASE_URL}/address-book/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                id,
                name,
                address,
                apartment,
                city,
                state,
                zip_code,
                phone
            })
        });


        return response.ok


    } catch (error) {
        throw error;
    }
}