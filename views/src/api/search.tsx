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

        const response = await fetch(`http://localhost:4000/search/byproduct?searchTerm=${searchTerm}`);
        const data = await response.json();
        if (response.ok) {
            return data.productsResults;
        }
    } catch (error) {
        throw error;
    }
}

export const getRecommendedProducts = async (subcategories: string[], brand?: string) => {
    try {
        let url = `http://localhost:4000/search/recommended-products?brand=${brand}`;
        // Append categories to the URL if provided
        if (subcategories && subcategories.length > 0) {
            const subcategoriesParam = subcategories.join(',');
            url += `&subcategories=${subcategoriesParam}`;
        }

        //console.log(url);
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return data.products;
        } else return "FAILED"
    } catch (error) {
    
        throw error;
    }
}

export const getProductSearchResults = async (subcategories: string[], brand?: string) => {
    try {
        console.log("RUNS");
        let url = `http://localhost:4000/search/search-results?brand=${brand}`;
        // Append categories to the URL if provided
        if (subcategories && subcategories.length > 0) {
            const subcategoriesParam = subcategories.join(',');
            url += `&subcategories=${subcategoriesParam}`;
        }

     
        const response = await fetch(url);
   
        const data = await response.json();
       
        if (response.ok) {
            return data.products;
        } else return "FAILED"
    } catch (error) {
        console.log(error);
        throw error;
    }
}