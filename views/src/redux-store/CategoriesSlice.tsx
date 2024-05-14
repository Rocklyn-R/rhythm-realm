import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../types/types";
import { RootState } from "./store";

export const CategorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [] as Category[],
    },
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        }
    }
});

export const {
    setCategories
} = CategorySlice.actions

export const selectCategories = (state: RootState) => state.categories.categories;


export default CategorySlice.reducer;