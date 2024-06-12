export const formatCategoryNameForDisplay = (name: string) => {
    const words = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

export const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(price));
  };

