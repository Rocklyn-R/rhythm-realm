export const createOrder = async (
    order_id: string,
    total: string,
    discount: string | null,
    total_with_coupon: string,
    total_tax: string,
    shipping_type: string,
    shipping_cost: string | null,
    total_with_tax: string) => {
    try {
        const response = await fetch(`http://localhost:4000/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                order_id,
                total,
                discount,
                total_with_coupon,
                total_tax,
                shipping_type,
                shipping_cost,
                total_with_tax
            })
        });
        const data = await response.json();
        if (response.ok) {
            return data.order;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createOrderItems = async (
    order_id: string,
    variant_id: number,
    quantity: number) => {
    try {
        const response = await fetch(`http://localhost:4000/orders/order-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ order_id, variant_id, quantity })
        });

        const data = await response.json();
        if (response.ok) {
            return data.order_item;
        }

    } catch (error) {
        throw error;
    }
}

export const getOrderHistory = async () => {
    try {
        const response = await fetch(`http://localhost:4000/orders/order-history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            return data.orders
        }    
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findOrder = async (order_id: string) => {
    try {
        const response = await fetch(`http://localhost:4000/orders/return?order_id=${order_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
            return data.order
        }    
    } catch (error) {
        console.log(error);
        throw error;
    }
}

