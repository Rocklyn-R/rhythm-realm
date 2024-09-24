

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
    category_name: string;
    category_alt_name?: string;
}

export interface SubcategoryResult extends Subcategory {
    subcategory_name: string;
    subcategory_alt_name: string;
}

export interface SubcategoryByBrand extends SubcategoryResult {
    subcategory_name: string;
    manufacturer: string;
}

export interface ProductResult extends SubcategoryResult, SubcategoryByBrand {
    image1: string;
    name: string;
    variant_name: string;
    variant_id: string;
    sale_price: string;
    price: string;
    product_id: number;
}

export interface RecommendedProductResult extends ProductResult {
    rating: number;
    avg_rating: number;
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

export interface Address {
    name: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    id: number;
}

export interface Shipping extends Address {
    email: string;
    selectedState: string;
}

export interface User {
    isAuthenticated: boolean,
    firstName: string,
    lastName: string,
    email: string;
    headerIsOpen: boolean;
    wish_list: Product[];
    address_book: Address[],
    cartMode: "current" | "previous" | "combine" | "";
    cartQuestion: boolean;
    isLoadingAuth: boolean;
    orders: OrderHistory[];
    loadingWishList: boolean;
    loadingAddressBook: boolean;
    loadingOrderHistory: boolean;
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
    productsForFilters: Product[];
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


export interface OrderItem {
    image1: string;
    order_id: string;
    price: string;
    variant_id: string;
    quantity: number;
    sale_price: string;
}

export interface Order {
    id: string;
    discount: null | number;
    order_date: string;
    shipping_cost: null | string;
    shipping_type: string;
    status: string;
    total: string;
    total_tax: string;
    total_with_coupon: string;
    total_with_tax: string;
    user_id: null | number;
}

export interface OrderHistory {
    id: string;
    order_date: string;
    total_with_tax: string;
    status: string;
    order_items: OrderHistoryItem [];
}


export interface OrderHistoryItem {
    name: string;
    image1: string;
    quantity: number;
    variant_id: string;
    variant_name: string;
}