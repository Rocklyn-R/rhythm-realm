export const getProducts = async (subcategory: string) => {
    try {
        const response = await fetch(`http://localhost:4000/products?subcategory=${subcategory}`);
        const data = await response.json();
        console.log(data.products)
        if (response.ok) {
            return data.products;
        }
    } catch (error) {
        throw error;
    }
}