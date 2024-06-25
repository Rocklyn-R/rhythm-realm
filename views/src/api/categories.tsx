export const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:4000/');
        const data = await response.json();
        if (response.ok) {
            console.log(data.categories)
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

export const getFeaturedCategories = async (marketingLabel: string) => {
    try {
        const response = await fetch(`http://localhost:4000/categories/featured-categories?marketingLabel=${marketingLabel}`);
        const data = await response.json();
        if (response.ok) {
            return data.categories;
        }
    } catch (error) {
        throw error;
    }
}

export const getFeaturedSubcategories = async (marketingLabel: string, categories?: string[]) => {
    try {
        let url = `http://localhost:4000/categories/featured-subcategories?marketingLabel=${marketingLabel}`;

        if (categories && categories.length > 0) {
            const categoriesParam = categories.join(',');
            url += `&categories=${categoriesParam}`;
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