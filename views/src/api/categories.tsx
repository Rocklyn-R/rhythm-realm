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