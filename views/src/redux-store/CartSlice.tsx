import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Cart, Coupon } from "../types/types";


export const CartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [] as Cart[],
        total: '0',
        total_with_coupon: "0",
        total_items: 0,
        active_coupons: [
            {
                code: 'ROCK20',
                discount: .2
            },
            {
                code: 'NICK15',
                discount: .15
            }] as Coupon[],
        coupon_applied: {} as Coupon,
    },
    reducers: {
        addItemToCart: (state, action: PayloadAction<Cart>) => {
            const foundItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
            if (foundItemIndex !== -1) {
                const sameVariantAlreadyInCart = state.cart[foundItemIndex].variant_name === action.payload.variant_name;
                if (sameVariantAlreadyInCart) {
                    state.cart[foundItemIndex].quantity += action.payload.quantity;
                } else {
                    state.cart.unshift(action.payload);
                }
            } else {
                state.cart.unshift(action.payload);
            }
            const pricePerItem = parseFloat(action.payload.price);
            const totalPriceToAdd = pricePerItem * action.payload.quantity;
            const newTotal = parseFloat(state.total) + totalPriceToAdd;
            state.total = newTotal.toFixed(2);
            state.total_items = state.total_items + action.payload.quantity;
            const couponIsApplied = Object.keys(state.coupon_applied).length !== 0;
            if (couponIsApplied) {
                state.total_with_coupon = (newTotal - (newTotal * state.coupon_applied.discount)).toFixed(2);
            }
        },
        addToQuantity: (state, action: PayloadAction<Cart>) => {
            const foundItemIndex = state.cart.findIndex(item => item.variant_id === action.payload.variant_id);
            if (foundItemIndex !== -1) {
                state.cart[foundItemIndex].quantity += 1;
                const price = parseFloat(action.payload.price);
                const newTotal = parseFloat(state.total) + price;
                state.total = newTotal.toFixed(2);
                state.total_items = state.total_items + 1;
                const couponIsApplied = Object.keys(state.coupon_applied).length !== 0;
                if (couponIsApplied) {
                    state.total_with_coupon = (newTotal - (newTotal * state.coupon_applied.discount)).toFixed(2);
                }
            }
        },
        subtractFromQuantity: (state, action: PayloadAction<Cart>) => {
            const foundItemIndex = state.cart.findIndex(item => item.variant_id === action.payload.variant_id);
            if (foundItemIndex !== -1) {
                if (state.cart[foundItemIndex].quantity === 1) {
                    state.cart.splice(foundItemIndex, 1);
                } else {
                    state.cart[foundItemIndex].quantity -= 1;
                }
                const price = parseFloat(action.payload.price);
                const newTotal = parseFloat(state.total) - price;
                state.total = newTotal.toFixed(2);
                state.total_items = state.total_items - 1;
                const couponIsApplied = Object.keys(state.coupon_applied).length !== 0;
                if (couponIsApplied) {
                    state.total_with_coupon = (newTotal - (newTotal * state.coupon_applied.discount)).toFixed(2);
                }
            }
        },
        applyCoupon: (state, action: PayloadAction<string>) => {
            const foundCoupon = state.active_coupons.find(coupon => coupon.code === action.payload);
            if (foundCoupon) {
                const currentTotal = parseFloat(state.total)
                const newTotal = currentTotal - (currentTotal * foundCoupon.discount);
                state.total_with_coupon = newTotal.toFixed(2);
                state.coupon_applied = foundCoupon;
            }
        }
    }
});

export const {
    addItemToCart,
    addToQuantity,
    subtractFromQuantity,
    applyCoupon
} = CartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectTotal = (state: RootState) => state.cart.total;
export const selectTotalItems = (state: RootState) => state.cart.total_items;
export const selectActiveCoupons = (state: RootState) => state.cart.active_coupons;
export const selectAppliedCoupons = (state: RootState) => state.cart.coupon_applied;
export const selectTotalWithCoupon = (state: RootState) => state.cart.total_with_coupon;

export default CartSlice.reducer;