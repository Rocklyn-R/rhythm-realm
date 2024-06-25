import { Product } from "../types/types";

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

export const shuffleArray = (array: Product[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getUniqueValues = (array: any[], value: string): string[] => {
  const uniqueValueSet = array.reduce((acc, product) => {
    if (product[value]) {
      acc.add(product[value]);
    }
    return acc;
  }, new Set<string>());

  return Array.from(uniqueValueSet);
};

export const sortCategoriesArray = (arr: string[]) => {
  const order = ["Guitars", "Basses", "Drums", "Keys", "Strings", "Winds", "Audio", "Accessories"];

  return arr.sort((a, b) => {
    return order.indexOf(a) - order.indexOf(b);
  });
}