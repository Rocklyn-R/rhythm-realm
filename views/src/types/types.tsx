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
    //category_id: number;
    //subcategory_id: number;
    name: string;
    price: string;
    description: string;
    manufacturer: string;
    image1: string;
    image2: string;
    image3: string;
    category_name: string;
    subcategory_name: string;
    variant_name: string;
}

export interface Cart extends Product {
    quantity: number;
}


