import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const ShippingSlice = createSlice({
    name: "shipping",
    initialState: {
        full_name: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zip_code: "",
        email: "",
        phone: "",
    },
    reducers: {
        setSelectedState: (state, action) => {
            state.state = action.payload;
        },
        setSelectedZipCode: (state, action) => {
            state.zip_code = action.payload;
        },
        setFullName: (state, action) => {
            state.full_name = action.payload;
        },
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setApartment: (state, action) => {
            state.apartment = action.payload;
        },
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPhone: (state, action) => {
            state.phone = action.payload;
        },
        clearShippingInfo: (state, action) => {
            state.full_name = action.payload;
            state.address = action.payload;
            state.apartment = action.payload;
            state.city = action.payload;
            state.state = action.payload;
            state.zip_code = action.payload;
            state.email = action.payload;
            state.phone = action.payload;
        }
}})

export const {
    setSelectedState,
    setSelectedZipCode,
    setFullName,
    setAddress,
    setApartment,
    setCity,
    setEmail,
    setPhone,
    clearShippingInfo
} = ShippingSlice.actions;

export const selectZipCode = (state: RootState) => state.shipping.zip_code;
export const selectSelectedState = (state: RootState) => state.shipping.state;
export const selectFullName = (state: RootState) => state.shipping.full_name;
export const selectAddress = (state: RootState) => state.shipping.address;
export const selectApartment = (state: RootState) => state.shipping.apartment;
export const selectCity = (state: RootState) => state.shipping.city;
export const selectEmail = (state: RootState) => state.shipping.email;
export const selectPhone = (state: RootState) => state.shipping.phone;


export default ShippingSlice.reducer;