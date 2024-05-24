export const formatCategoryNameForDisplay = (name: string) => {
    const words = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}