const db = require('../config/db');

const categoriesGet = async () => {
    const query = 'SELECT * FROM categories ORDER BY id';
    try {
        const result = await db.query(query);
        return result.rows
    } catch (error) {
        throw error;
    }
}

const subcategoriesGet = async (id) => {
    const query = 'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY id';
    try {
        const result = await db.query(query, [id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const featuredCategoriesGet = async (marketingLabel) => {
    const query = `
    SELECT DISTINCT c.name AS category_name, c.id
    FROM categories c
    JOIN products p ON p.category_id = c.id
    JOIN variants v ON p.id = v.product_id
    WHERE v.marketing_label = $1
    ORDER BY c.id
`;
   
    try {
        const categoriesResult = await db.query(query, [marketingLabel]);
        const categories = categoriesResult.rows.map(row => row.category_name);
       
        return categories;
    } catch (error) {
        throw error;
    }
}

const featuredSubcategoriesGet = async (marketingLabel, categories = []) => {
    let query = `
    SELECT DISTINCT s.name AS subcategory_name, s.id
    FROM subcategories s
    JOIN categories c ON s.category_id = c.id
    JOIN products p ON p.category_id = c.id
    JOIN variants v ON p.id = v.product_id
    WHERE v.marketing_label = $1
`; 

    const params = [marketingLabel];
    let paramIndex = 2;

    if (categories.length > 0) {
        query += ` AND c.name IN (${categories.map((_, index) => `$${paramIndex++}`).join(',')})`;
        params.push(...categories);
    }

    query += ` ORDER BY s.id`;

    try {
        if (categories.length === 0) {
            return []
        } else {
             const result = await db.query(query, params);
        return result.rows.map(row => row.subcategory_name); // Extract subcategory names
        }
    } catch (error) {

        throw error;
    }
}

module.exports = {
    categoriesGet,
    subcategoriesGet,
    featuredCategoriesGet,
    featuredSubcategoriesGet
}