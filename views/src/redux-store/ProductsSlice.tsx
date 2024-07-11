import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Category, Subcategory, Product, Review } from "../types/types";
import { RootState } from "./store";

export const ProductsSlice = createSlice({
    name: "products",
    initialState: {
        categories: [
            { id: 1, name: 'Guitars', image: 'https://i.imgur.com/aHtc8VN.png' },
            { id: 2, name: 'Basses', image: 'https://i.imgur.com/KDHCJ62.png' },
            { id: 3, name: 'Drums', image: 'https://i.imgur.com/mNHgE62.png' },
            { id: 4, name: 'Keys', image: 'https://i.imgur.com/MAbVPnC.png' },
            { id: 5, name: 'Strings', image: 'https://i.imgur.com/W0qKZVu.png' },
            { id: 6, name: 'Winds', image: 'https://i.imgur.com/CTXog7r.png' },
            { id: 7, name: 'Audio', image: 'https://i.imgur.com/YYh1ldS.png' },
            { id: 8, name: 'Accessories', image: 'https://i.imgur.com/U7JOlym.png' },
            { id: 9, name: 'Featured', image: ""}
        ] as Category[],
        subcategories: [] as Subcategory[],
        products: [] as Product[],
        selectedProduct: {} as Product,
        variants: [] as Product[],
        reviews: [] as Review[],
        featuredDeals: [] as Product[],
        newArrivals: [] as Product[],
        topSellers: [] as Product[]
    },
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setSubcategories: (state, action: PayloadAction<Subcategory[]>) => {
            state.subcategories = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        setVariants: (state, action) => {
            state.variants = action.payload;
        },
        setFeaturedDeals: (state, action) => {
            state.featuredDeals = action.payload;
        },
        setNewArrivals: (state, action) => {
            state.newArrivals = action.payload;
        },
        setTopSellers: (state, action) => {
            state.topSellers = action.payload
        },
        setReviews: (state, action) => {
            state.reviews = action.payload;
        },
        addReview: (state, action) => {
            state.reviews.unshift(action.payload);
        },
        setAverageRating: (state, action) => {
            state.selectedProduct.avg_rating = action.payload;
        }
    }
});

export const {
    setCategories,
    setSubcategories,
    setProducts,
    setSelectedProduct,
    setVariants,
    setFeaturedDeals,
    setNewArrivals,
    setTopSellers,
    setReviews,
    addReview,
    setAverageRating
} = ProductsSlice.actions

export const selectCategories = (state: RootState) => state.products.categories;
export const selectSubcategories = (state: RootState) => state.products.subcategories;
export const selectProducts = (state: RootState) => state.products.products;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectVariants = (state: RootState) => state.products.variants;
export const selectFeaturedDeals = (state: RootState) => state.products.featuredDeals;
export const selectNewArrivals = (state: RootState) => state.products.newArrivals;
export const selectTopSellers = (state: RootState) => state.products.topSellers;
export const selectReviews = (state: RootState) => state.products.reviews;

export default ProductsSlice.reducer;