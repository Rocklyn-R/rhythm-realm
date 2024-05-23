import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productsReducer from "./ProductsSlice";

export interface RootState {
    products: ReturnType<typeof productsReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        products: productsReducer
    })
});

export default store;