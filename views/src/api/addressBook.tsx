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
    
        return response.ok;

    } catch (error) {
        console.log(error);
        throw error;
    }
}