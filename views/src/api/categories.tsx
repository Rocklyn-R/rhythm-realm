export const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:4000/categories/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            return data.categories;
        } else return []
    } catch (error) {
        throw error;
    }
}

export const getSubcategories = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:4000/categories/subcategories?id=${id}`);
        const data = await response.json();
        if (response.ok) {
            return data.subcategories;
        } else return []
    } catch (error) {
        throw error;
    }
}

export const getFeaturedCategories = async (
    marketingLabel: string, 
    manufacturers?: string[],
    priceMin?: string,
    priceMax?: string
    ) => {
    try {
        let url = (`http://localhost:4000/categories/featured-categories?marketingLabel=${marketingLabel}`);
        if (manufacturers && manufacturers.length > 0) {
            const manufacturersParam = manufacturers.join(',');
            url += `&manufacturers=${manufacturersParam}`;
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
            return data.categories;
        }
    } catch (error) {
        throw error;
    }
}

export const getFeaturedSubcategories = async (
    marketingLabel: string, 
    categories?: string[], 
    manufacturers?: string[],
    priceMin?: string,
    priceMax?: string
    ) => {
    try {
        let url = `http://localhost:4000/categories/featured-subcategories?marketingLabel=${marketingLabel}`;

        if (categories && categories.length > 0) {
            const categoriesParam = categories.join(',');
            url += `&categories=${categoriesParam}`;
        }
        if (manufacturers && manufacturers.length > 0) {
            const manufacturersParam = manufacturers.join(',');
            url += `&manufacturers=${manufacturersParam}`;
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
            return data.subcategories;
        }
    } catch (error) {
        throw error;
    }
}

