

export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface Subcategory {
    id: number;
    name: string;
    category_id: number;
    image: string;
    category_name?: string;
    category_alt_name?: string;
}

export interface SubcategoryResult extends Subcategory {
    subcategory_name: string;
}

export interface SubcategoryByBrand extends SubcategoryResult {
    subcategory_name: string;
    manufacturer: string;
}

export interface ProductResult extends SubcategoryResult, SubcategoryByBrand {
    image1: string;
    name: string;
    variant_name: string;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    manufacturer: string;
    image1: string;
    image2: string;
    image3: string;
    sale_price: string;
    category_name: string;
    subcategory_name: string;
    variant_name: string;
    variant_id: number;
    marketing_label: string;
    avg_rating: number;
}

export interface Cart extends Product {
    quantity: number;
}

export interface Coupon {
    code: string;
    discount: number;
}

export interface User {
    isAuthenticated: boolean,
    firstName: string,
    lastName: string,
    email: string;
    headerIsOpen: boolean;
    wish_list: Product[];
    cartMode: "current" | "previous" | "combine" | "";
    cartQuestion: boolean;
}

export interface FilterState {
    manufacturers: string[];
    selectedManufacturers: string[];
    priceDrop: boolean;
    priceMin: string | undefined;
    priceMax: string | undefined;
    categories: string[];
    selectedCategories: string[];
    subcategories: string[];
    selectedSubcategories: string[];
}

export interface Review {
    id: number;
    user_id: string;
    product_id: string;
    rating: number;
    title: string;
    review: string;
    name: string;
    recommend: boolean;
    date_created: string;
    verified: boolean;
}

