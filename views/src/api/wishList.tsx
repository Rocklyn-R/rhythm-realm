export const addItemToWishList = async (product_id: number, variant_id: number) => {
    try {
        const response = await fetch(`http://localhost:4000/wish-list/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ product_id, variant_id })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

export const removeItemFromWishList = async (product_id: number, variant_id: number) => {

    try {
        const response = await fetch(`http://localhost:4000/wish-list/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ product_id, variant_id })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

export const getWishList = async () => {
    try {
        const response = await fetch(`http://localhost:4000/wish-list/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            return data.wishList;
        }
    } catch (error) {
        throw error;
    }
}