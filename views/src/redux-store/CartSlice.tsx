import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Cart } from "../types/types";


export const CartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [] as Cart[],
        total: 0,
        total_items: 0
    },
    reducers: {
        addItemToCart: (state, action: PayloadAction<Cart>) => {
            const foundItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
            if (foundItemIndex !== -1) {
              state.cart[foundItemIndex].quantity += action.payload.quantity;
              console.log(action.payload);
            } else {
                state.cart.unshift(action.payload); 
            }
            const price = parseFloat(action.payload.price);
            const totalPrice = price * action.payload.quantity;
            state.total = state.total + totalPrice;
            state.total_items = state.total_items + action.payload.quantity;
        },

    }
});

export const {
    addItemToCart
} = CartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectTotal = (state: RootState) => state.cart.total;
export const selectTotalItems = (state: RootState) => state.cart.total_items;

export default CartSlice.reducer;