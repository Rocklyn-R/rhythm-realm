import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productsReducer from "./ProductsSlice";
import cartReducer from "./CartSlice";
import shippingReducer from "./ShippingSlice";
import userReducer from "./UserSlice";
import { localStorageMiddleWare } from "./middleware";

export interface RootState {
    products: ReturnType<typeof productsReducer>;
    cart: ReturnType<typeof cartReducer>;
    shipping: ReturnType<typeof shippingReducer>;
    user: ReturnType<typeof userReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        products: productsReducer,
        cart: cartReducer,
        shipping: shippingReducer,
        user: userReducer
    }),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleWare)
});


export default store;