const { productsGet, selectedProductGet, variantsGetAll, manufacturersGet, saleItemsGet, featuredProductsGet, featuredManufacturersGet } = require('../models/products');

const getProducts = async (req, res) => {
    const { subcategory, manufacturers, sale, priceMin, priceMax } = req.query;
    let manufacturersArray = [];

    // If manufacturers is provided in the query, split it into an array
    if (manufacturers) {
        manufacturersArray = Array.isArray(manufacturers) ? manufacturers : manufacturers.split(',');
    }

    // Convert 'sale' to boolean
    const isSale = sale === 'true';

    // Parse priceMin and priceMax to numbers, or leave them as undefined if not provided
    const parsedPriceMin = priceMin !== undefined ? parseFloat(priceMin) : undefined;
    const parsedPriceMax = priceMax !== undefined ? parseFloat(priceMax) : undefined;

    try {
        // Call productsGet function with parsed parameters
        const result = await productsGet(subcategory, manufacturersArray, isSale, parsedPriceMin, parsedPriceMax);
        
        // Check if result is not empty before sending response
      
        res.status(200).json({ products: result });
        
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getSelectedProduct = async (req, res) => {
    const { name, variant } = req.query;
    try {
        const result = await selectedProductGet(name, variant);
        if (result) {
            res.status(200).json({ selectedProduct: result })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getAllVariants = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await variantsGetAll(id);
        if (result) {
            res.status(200).json({ variants: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getManufacturers = async (req, res) => {
    const { subcategory } = req.query;
    try {
        const result = await manufacturersGet(subcategory);
        if (result) {
            res.status(200).json({ manufacturers: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getSaleItems = async (req, res) => {
    try {
        const result = await saleItemsGet();
        if (result) {
            res.status(200).json({ featuredDeals: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getFeaturedProducts = async (req, res) => {
    const {marketingLabel, categories, subcategories, manufacturers, sale, priceMin, priceMax} = req.query;

    let categoriesArray = [];
    let subcategoriesArray = [];
    let manufacturersArray = [];

      // If categories is provided in the query, split it into an array
    if (categories) {
        categoriesArray = Array.isArray(categories) ? categories : categories.split(',');
    }

    // If subcategories is provided in the query, split it into an array
    if (subcategories) {
        subcategoriesArray = Array.isArray(subcategories) ? subcategories : subcategories.split(',');
    }

    // If manufacturers is provided in the query, split it into an array
    if (manufacturers) {
        manufacturersArray = Array.isArray(manufacturers) ? manufacturers : manufacturers.split(',');
    }

    // Convert 'sale' to boolean
    const isSale = sale === 'true';

    // Parse priceMin and priceMax to numbers, or leave them as undefined if not provided
    const parsedPriceMin = priceMin !== undefined ? parseFloat(priceMin) : undefined;
    const parsedPriceMax = priceMax !== undefined ? parseFloat(priceMax) : undefined;
    
    try {
        const result = await featuredProductsGet(
            marketingLabel,
            categoriesArray,
            subcategoriesArray, 
            manufacturersArray, 
            isSale, 
            parsedPriceMin, 
            parsedPriceMax
            );
        if (result) {
            res.status(200).json({ featuredProducts: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getFeaturedManufacturers = async (req, res) => {
    const { marketingLabel } = req.query;
    try {
        const result = await featuredManufacturersGet(marketingLabel);
        if (result) {
            res.status(200).json({ manufacturers: result });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}




module.exports = {
    getProducts,
    getSelectedProduct,
    getAllVariants,
    getManufacturers,
    getSaleItems,
    getFeaturedProducts,
    getFeaturedManufacturers
}