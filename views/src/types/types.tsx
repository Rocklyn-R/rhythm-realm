

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