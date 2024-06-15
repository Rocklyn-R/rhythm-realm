export const getProducts = async (
    subcategory: string, 
    manufacturers?: string[], 
    sale?: boolean, 
    priceMin?: string, 
    priceMax?: string
) => {
    try {
        let url = `http://localhost:4000/products?subcategory=${subcategory}`;

        // Append manufacturers to the URL if it's provided
        if (manufacturers && manufacturers.length > 0) {
            const manufacturersParam = manufacturers.join(',');
            url += `&manufacturers=${manufacturersParam}`;
        }
        // Append sale to the URL if it's provided
        if (sale) {
            url += `&sale=${sale}`;
        }

        // Append priceMin to the URL if it's provided
        if (priceMin !== undefined) {
            url += `&priceMin=${priceMin}`;
        }

        // Append priceMax to the URL if it's provided
        if (priceMax !== undefined) {
            url += `&priceMax=${priceMax}`;
        }

        const response = await fetch(url);
        const data = await response.json();

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

export const getManufacturers = async (subcategory: string) => {
    try {
        const response = await fetch(`http://localhost:4000/products/manufacturers?subcategory=${subcategory}`);
        const data = await response.json();
        if (response.ok) {
            return data.manufacturers;
        }
    } catch (error) {
        throw error;
    }
}