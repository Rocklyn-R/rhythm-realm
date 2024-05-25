import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productsReducer from "./ProductsSlice";
import cartReducer from "./CartSlice";

export interface RootState {
    products: ReturnType<typeof productsReducer>;
    cart: ReturnType<typeof cartReducer>
}

const store = configureStore({
    reducer: combineReducers({
        products: productsReducer,
        cart: cartReducer
    })
});

export default store;