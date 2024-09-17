import { Product } from "../types/types";
import moment from 'moment';

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

export const formatDate = (dateString: string) => {
  const date = moment(dateString);
  const now = moment();

  if (date.isSame(now, 'day')) {
    return 'Today';
  } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  } else if (date.isSame(now.subtract(1, 'week'), 'week')) {
    return date.format('dddd'); // Returns the day of the week (e.g., 'Monday')
  } else if (date.isSame(now.subtract(1, 'month'), 'month')) {
    return 'One week ago';
  } else if (date.isSame(now.subtract(1, 'year'), 'year')) {
    return date.fromNow(); // e.g., '3 weeks ago' or '2 months ago'
  } else {
    return date.fromNow(); // e.g., '1 year ago' or '2 years ago'
  }
};

export const generateOrderNumber = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
  return `RR${randomNumber}`;
};

export const formatDateString = (isoString: string) => {
  const date = new Date(isoString);

  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() is zero-based
  const day = date.getUTCDate().toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2); // get last two digits of the year

  return `${month}/${day}/${year}`;
}


export const formatPhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = ('' + phone).replace(/\D/g, '');

  // Format for 11 digits with country code (starting with '1')
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.replace(/^1(\d{3})(\d{3})(\d{4})$/, '1-$1-$2-$3');
  }
  // Format for 10 digits (without country code)
  else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  // Return the original if it doesn't match 10 or 11 digits
  return phone;
};

