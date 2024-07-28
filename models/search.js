const db = require('../config/db');

const subcategoriesSearch = async (searchTerm) => {
    const query = `
    SELECT subcategories.name as subcategory_name, 
    subcategories.image, 
    subcategories.id, 
    subcategories.alt_name as subcategory_alt_name,
    categories.name as category_name, 
    categories.alt_name as category_alt_name
    FROM subcategories 
    JOIN categories ON categories.id = subcategories.category_id
    WHERE categories.name ILIKE '%' || $1 || '%' OR categories.alt_name ILIKE '%' || $1 || '%' 
    OR subcategories.name ILIKE '%' || $1 || '%' OR subcategories.alt_name ILIKE '%' || $1 || '%'`;
    try {
        const result = await db.query(query, [searchTerm]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const manufacturersSearch = async (searchTerm) => {
    const query = `
    SELECT DISTINCT subcategories.name as subcategory_name, 
    subcategories.image, 
    subcategories.id, 
    categories.name as category_name, 
    categories.alt_name as category_alt_name,
    subcategories.alt_name as subcategory_alt_name,
    products.manufacturer
    FROM subcategories
    JOIN categories ON categories.id = subcategories.category_id
    JOIN products ON products.subcategory_id = subcategories.id
    WHERE products.manufacturer ILIKE '%' || $1 || '%'
    ORDER BY subcategories.id;`;
    try {
        const result = await db.query(query, [searchTerm]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}


const productSearch = async (searchTerm) => {
    const query = `
    SELECT products.id,
    products.name,
    products.price,
    products.avg_rating,
    variants.variant_name,
    variants.image1,
    variants.id as variant_id,
    variants.sale_price,
    subcategories.name as subcategory_name,
    subcategories.alt_name as subcategory_alt_name,
    categories.name as category_name,
    categories.alt_name as category_alt_name,
    products.manufacturer
    FROM products
    JOIN variants ON variants.product_id = products.id
    JOIN subcategories ON subcategories.id = products.subcategory_id
    JOIN categories ON categories.id = products.category_id
    WHERE products.name ILIKE '%' || $1 || '%'
    OR variants.variant_name ILIKE '%' || $1 || '%'
    ORDER BY products.name`;
    try {
        const result = await db.query(query, [searchTerm]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}


const recommendedProductsSearch = async (brand = undefined, subcategories = []) => {
    let query = `
    SELECT DISTINCT ON (products.id)
    products.id,
    products.name,
    products.price,
    variants.id as variant_id,
    variants.variant_name,
    variants.sale_price,
    variants.image1,
    subcategories.name as subcategory_name,
    subcategories.alt_name as subcategory_alt_name,
    categories.name as category_name,
    categories.alt_name as category_alt_name,
    products.manufacturer,
    reviews.rating
FROM products
JOIN (
    SELECT DISTINCT ON (product_id) *
    FROM variants
    
) AS variants ON variants.product_id = products.id
JOIN subcategories ON subcategories.id = products.subcategory_id
JOIN categories ON categories.id = products.category_id
LEFT JOIN reviews ON reviews.product_id = products.id
`;

    let params = [];
    let paramIndex = 1;

    if (brand !== 'undefined') {
        query += ` WHERE products.manufacturer = $1`;
        paramIndex++;
        params.push(brand);
    }

    if (subcategories.length > 0 && brand !== 'undefined') {
        query += ` AND subcategories.name IN (${subcategories.map(() => `$${paramIndex++}`).join(',')})`;
        params.push(...subcategories);
    }

    if (subcategories.length > 0 && brand === 'undefined') {
        query += ` WHERE subcategories.name IN (${subcategories.map(() => `$${paramIndex++}`).join(',')})`;
        params.push(...subcategories);
    }

    query += ` ORDER BY products.id, variants.id`;

    query += ` LIMIT 5`;
  

    try {
        const result = await db.query(query, params);
  
        return result.rows; // Return the rows directly
    } catch (error) {
   
        throw error;
    }
}

const searchResultsGetProducts = async (brand = undefined, subcategories = []) => {
    let query = `
    SELECT DISTINCT ON (variants.id)
      products.id,
      products.name,
      products.price,
      products.avg_rating,
      variants.id as variant_id,
      variants.variant_name,
      variants.image1,
      variants.sale_price,
      variants.marketing_label,
      subcategories.name AS subcategory_name,
      subcategories.alt_name AS subcategory_alt_name,
      categories.name AS category_name,
      categories.alt_name AS category_alt_name,
      products.manufacturer,
      reviews.rating
    FROM products
    JOIN variants ON variants.product_id = products.id
    JOIN subcategories ON subcategories.id = products.subcategory_id
    JOIN categories ON categories.id = products.category_id
    LEFT JOIN reviews ON reviews.product_id = products.id
  `;

    let params = [];
    let paramIndex = 1;

    if (brand !== 'undefined') {
        query += ` WHERE products.manufacturer = $1`;
        paramIndex++;
        params.push(brand);
    }

    if (subcategories.length > 0 && brand !== 'undefined') {
        query += ` AND subcategories.name IN (${subcategories.map(() => `$${paramIndex++}`).join(',')})`;
        params.push(...subcategories);
    }

    if (subcategories.length > 0 && brand === 'undefined') {
        query += ` WHERE subcategories.name IN (${subcategories.map(() => `$${paramIndex++}`).join(',')})`;
        params.push(...subcategories);
    }

    query += ` ORDER BY variants.id, products.id`;

  
    try {
        const result = await db.query(query, params);

        return result.rows; // Return the rows directly
    } catch (error) {
        throw error;
    }
}

module.exports = {
    subcategoriesSearch,
    manufacturersSearch,
    productSearch,
    recommendedProductsSearch,
    searchResultsGetProducts
}