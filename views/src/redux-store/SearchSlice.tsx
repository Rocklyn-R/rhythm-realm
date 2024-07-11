import { createSlice } from "@reduxjs/toolkit"
import { ProductResult, RecommendedProductResult, SubcategoryByBrand, SubcategoryResult } from "../types/types";
import { RootState } from "./store";

export const SearchSlice = createSlice({
    name: "search",
    initialState: {
        subcategoryResults: [] as SubcategoryResult[],
        subcategoryByBrandResults: [] as SubcategoryByBrand[],
        productsResults: [] as ProductResult[],
        recommendedProductResults: [] as RecommendedProductResult[],
    },

    reducers: {
        setSubcategoryResults: (state, action) => {
            state.subcategoryResults = action.payload;
        },
        setSubcategoryByBrandResults: (state, action) => {
            state.subcategoryByBrandResults = action.payload;
        },
        setProductsResults: (state, action) => {
            state.productsResults = action.payload;
        },
        setRecommendedProductResults: (state, action) => {
            state.recommendedProductResults = action.payload;
        }
    }
});

export const {
    setSubcategoryResults,
    setSubcategoryByBrandResults,
    setProductsResults,
    setRecommendedProductResults
} = SearchSlice.actions;

export const selectSubcategoryResults = (state: RootState) => state.search.subcategoryResults;
export const selectSubcategoryByBrandResults = (state: RootState) => state.search.subcategoryByBrandResults;
export const selectProductResults = (state: RootState) => state.search.productsResults;
export const selectRecommendedProductResults = (state: RootState) => state.search.recommendedProductResults;

export default SearchSlice.reducer;