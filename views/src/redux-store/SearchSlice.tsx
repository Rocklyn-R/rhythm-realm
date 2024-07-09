import { createSlice } from "@reduxjs/toolkit"
import { ProductResult, SubcategoryByBrand, SubcategoryResult } from "../types/types";
import { RootState } from "./store";

export const SearchSlice = createSlice({
    name: "search",
    initialState: {
        subcategoryResults: [] as SubcategoryResult[],
        subcategoryByBrandResults: [] as SubcategoryByBrand[],
        productsResults: [] as ProductResult[],
        suggestedProductResults: [],
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
        }
    }
});

export const {
    setSubcategoryResults,
    setSubcategoryByBrandResults,
    setProductsResults
} = SearchSlice.actions;

export const selectSubcategoryResults = (state: RootState) => state.search.subcategoryResults;
export const selectSubcategoryByBrandResults = (state: RootState) => state.search.subcategoryByBrandResults;
export const selectProductResults = (state: RootState) => state.search.productsResults;

export default SearchSlice.reducer;