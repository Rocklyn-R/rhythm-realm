import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const ShippingSlice = createSlice({
    name: "shipping",
    initialState: {
        full_name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        shipping_type: "Standard Ground",
        shipping_cost: "",
        total_to_pay: ""
    },
    reducers: {
        setSelectedState: (state, action) => {
            state.state = action.payload;
        },
        setSelectedZipCode: (state, action) => {
            state.zip_code = action.payload;
        },
        setShipping: (state, action) => {
            state.shipping_type = action.payload.type;
            state.shipping_cost = action.payload.cost;
        },
        setTotalToPay: (state, action) => {
            state.total_to_pay = action.payload;
        }
}})

export const {
    setSelectedState,
    setSelectedZipCode,
    setShipping,
    setTotalToPay
} = ShippingSlice.actions;

export const selectZipCode = (state: RootState) => state.shipping.zip_code;
export const selectSelectedState = (state: RootState) => state.shipping.state;
export const selectShippingType = (state: RootState) => state.shipping.shipping_type;
export const selectShippingCost = (state: RootState) => state.shipping.shipping_cost;
export const selectTotalToPay = (state: RootState) => state.shipping.total_to_pay;

export default ShippingSlice.reducer;