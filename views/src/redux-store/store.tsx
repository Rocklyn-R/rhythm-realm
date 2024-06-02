import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productsReducer from "./ProductsSlice";
import cartReducer from "./CartSlice";
import shippingReducer from "./ShippingSlice";
import { updateTax } from "./storeSubscriptions";

export interface RootState {
    products: ReturnType<typeof productsReducer>;
    cart: ReturnType<typeof cartReducer>;
    shipping: ReturnType<typeof shippingReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        products: productsReducer,
        cart: cartReducer,
        shipping: shippingReducer
    })
});


export default store;