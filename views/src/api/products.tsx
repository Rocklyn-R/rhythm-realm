export const getProducts = async (subcategory: string, manufacturers?: string[]) => {
    try {
        let url = `http://localhost:4000/products?subcategory=${subcategory}`;

        // Append manufacturers to the URL if it's provided
        if (manufacturers && manufacturers.length > 0) {
            // Join manufacturers array into a comma-separated string
            const manufacturersParam = manufacturers.join(',');
            url += `&manufacturers=${manufacturersParam}`;
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
            console.log(data.manufacturers)
            return data.manufacturers;
        }
    } catch (error) {
        throw error;
    }
}