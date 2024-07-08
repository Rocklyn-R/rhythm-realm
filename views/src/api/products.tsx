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

export const getManufacturers = async (
    subcategory: string,
    sale?: boolean,
    priceMin?: string,
    priceMax?: string
) => {
    try {
        let url = (`http://localhost:4000/products/manufacturers?subcategory=${subcategory}`);

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
            return data.manufacturers;
        }
    } catch (error) {
        throw error;
    }
}

export const getFeaturedDeals = async (
    marketingLabel: string,
    categories?: string[],
    subcategories?: string[],
    manufacturers?: string[],
    sale?: boolean,
    priceMin?: string,
    priceMax?: string
) => {
    try {
        let url = `http://localhost:4000/products/featured-products?marketingLabel=${marketingLabel}`;
        // Append categories to the URL if provided
        if (categories && categories.length > 0) {
            const categoriesParam = categories.join(',');
            url += `&categories=${categoriesParam}`;
        }

        // Append subcategories to the URL if provided
        if (subcategories && subcategories.length > 0) {
            const subcategoriesParam = subcategories.join(',');
            url += `&subcategories=${subcategoriesParam}`;
        }
        // Append manufacturers to the URL if it's provided
        //console.log(manufacturers);
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
        //console.log(url);
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return data.featuredProducts;
        }
    } catch (error) {
        throw error;
    }
}

export const getFeaturedItemManufacturers = async (
    marketingLabel: string,
    categories?: string[],
    subcategories?: string[],
    priceMin?: string,
    priceMax?: string
) => {
    try {
        let url = (`http://localhost:4000/products/manufacturers-featured?marketingLabel=${marketingLabel}`);
        if (categories && categories.length > 0) {
            const categoriesParam = categories.join(',');
            url += `&categories=${categoriesParam}`;
        }

        // Append subcategories to the URL if provided
        if (subcategories && subcategories.length > 0) {
            const subcategoriesParam = subcategories.join(',');
            url += `&subcategories=${subcategoriesParam}`;
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
            return data.manufacturers;
        }
    } catch (error) {
        throw error;
    }
}

export const getReviews = async (product_id: number) => {
    try {
        const response = await fetch(`http://localhost:4000/products/reviews?product_id=${product_id}`);
        const data = await response.json();
        if (response.ok) {
            return data.reviews;
        }
    } catch (error) {
        throw error;
    }
}

export const postReview = async (
    product_id: number,
    rating: number,
    title: string,
    review: string,
    name: string,
    recommend: boolean,
    order_id: string | null
) => {
    try {
        const response = await fetch(`http://localhost:4000/products/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ product_id, rating, title, review, name, recommend, order_id })
        });
        const data = await response.json();
        if (response.ok) {
            return data.review;
        }
    } catch (error) {
        throw error;
    }
}