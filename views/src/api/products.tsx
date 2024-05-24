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

export const getSelectedProduct = async (name: string, variant: string) => {
    try {
        const response = await fetch(`http://localhost:4000/products/selected-product?name=${name}&variant=${variant}`);
        const data = await response.json();
        if (response.ok) {
            return data.selectedProduct[0];
        }
    } catch (error) {
        throw error;
    }
}

export const getAllVariants = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:4000/products/variants?id=${id}`);
        const data = await response.json();
        if (response.ok) {
            return data.variants;
        }
    } catch (error) {
        throw error;
    }
}