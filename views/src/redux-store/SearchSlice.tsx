import { createSlice } from "@reduxjs/toolkit"
import { Subcategory, SubcategoryByBrand } from "../types/types";
import { RootState } from "./store";

export const SearchSlice = createSlice({
    name: "search",
    initialState: {
        subcategoryResults: [] as Subcategory[],
        subcategoryByBrandResults: [] as SubcategoryByBrand[],
        products: [],
        brands: [],
    },

    reducers: {
        setSubcategoryResults: (state, action) => {
            state.subcategoryResults = action.payload;
        },
        setSubcategoryByBrandResults: (state, action) => {
            state.subcategoryByBrandResults = action.payload;
        }
    }
});

export const {
    setSubcategoryResults,
    setSubcategoryByBrandResults
} = SearchSlice.actions;

export const selectSubcategoryResults = (state: RootState) => state.search.subcategoryResults;
export const selectSubcategoryByBrandResults = (state: RootState) => state.search.subcategoryByBrandResults;

export default SearchSlice.reducer;