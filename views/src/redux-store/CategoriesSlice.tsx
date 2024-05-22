import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Category, Subcategory } from "../types/types";
import { RootState } from "./store";

export const CategorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [] as Category[],
        subcategories: [] as Subcategory[]
    },
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setSubcategories: (state, action: PayloadAction<Subcategory[]>) => {
            state.subcategories = action.payload;
        }
    }
});

export const {
    setCategories,
    setSubcategories
} = CategorySlice.actions

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectSubcategories = (state: RootState) => state.categories.subcategories;

export default CategorySlice.reducer;