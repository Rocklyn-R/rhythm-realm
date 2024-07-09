export const getSearchSubcategories = async (searchTerm: string) => {
    try {
        const response = await fetch(`http://localhost:4000/search/?searchTerm=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
            return data.subcategories;
        }
    } catch (error) {
        throw error;
    }
}

export const getSearchByBrand = async (searchTerm: string) => {
    try {
        const response = await fetch(`http://localhost:4000/search/bybrand?searchTerm=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
            return data.subcategoriesByBrand;
        }
    } catch (error) {
        throw error;
    }
}

export const getSearchByProduct = async (searchTerm: string) => {
    try {
        console.log(searchTerm);
        const response = await fetch(`http://localhost:4000/search/byproduct?searchTerm=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
            return data.productsResults;
        }
    } catch (error) {
        throw error;
    }
}