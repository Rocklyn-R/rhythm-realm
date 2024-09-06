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
        const response = await fetch(`http://localhost:4000/address-book/add`, {
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
        const response = await fetch(`http://localhost:4000/address-book/`, {
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
        const response = await fetch(`http://localhost:4000/address-book/`, {
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