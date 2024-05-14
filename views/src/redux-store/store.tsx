import { configureStore, combineReducers } from "@reduxjs/toolkit";
import categoriesReducer from "./CategoriesSlice";

export interface RootState {
    categories: ReturnType<typeof categoriesReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        categories: categoriesReducer
    })
});

export default store;