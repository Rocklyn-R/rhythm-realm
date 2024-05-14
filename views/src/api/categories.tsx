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