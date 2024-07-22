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

        if (response.ok) {
            return true;
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

        if (response.ok) {
            return true;
        }
    } catch (error) {
        throw error;
    }
}