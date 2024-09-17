import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { User } from "../types/types";

export const UserSlice = createSlice({
    name: "user",
    initialState: {
        isAuthenticated: false,
        firstName: '',
        lastName: '',
        email: '',
        headerIsOpen: false,
        wish_list: [],
        address_book: [],
        cartMode: "",
        cartQuestion: false,
        isLoadingAuth: true,
        orders: []
    } as User,
    reducers: {
        authenticateUser: (state) => {
            state.isAuthenticated = true;
        },
        unauthenticateUser: (state) => {
            state.isAuthenticated = false;
            state.firstName = "";
            state.lastName = "";
            state.email = "";
        },
        setUserFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setUserLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setUserEmail: (state, action) => {
            state.email = action.payload;
        }, 
        setHeaderIsOpen: (state) => {
            state.headerIsOpen = !state.headerIsOpen
        },
        addToWishList: (state, action) => {
            state.wish_list.unshift(action.payload);
        },
        removeFromWishList: (state, action) => {
            state.wish_list = state.wish_list.filter(item => item.variant_id !== action.payload.variant_id);
        },
        setWishList: (state, action) => {
            state.wish_list = action.payload;
        },
        setCartMode: (state, action) => {
            state.cartMode = action.payload;
        },
        setCartQuestion: (state, action) => {
            state.cartQuestion = action.payload;
        },
        setIsLoadingAuth: (state, action) => {
            state.isLoadingAuth = action.payload;
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        addToAddressBook: (state, action) => {
            state.address_book.push(action.payload);
        },
        setAddressBook: (state, action) => {
            state.address_book = action.payload;
        },
        removeAddress: (state, action) => {
            state.address_book = state.address_book.filter(address => address.id !== action.payload);
        },
        updateAddress: (state, action) => {
            const addressIndex = state.address_book.findIndex(address => address.id === action.payload.id);
            if (addressIndex !== -1) {
                state.address_book[addressIndex] = action.payload;
            }
        }
    }
})

export const {
    authenticateUser,
    unauthenticateUser,
    setUserFirstName,
    setUserLastName,
    setUserEmail,
    setHeaderIsOpen,
    addToWishList,
    removeFromWishList,
    setWishList,
    setCartMode,
    setCartQuestion,
    setIsLoadingAuth,
    setOrders,
    addToAddressBook,
    setAddressBook,
    removeAddress,
    updateAddress
} = UserSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectFirstName = (state: RootState) => state.user.firstName;
export const selectLastName = (state: RootState) => state.user.lastName;
export const selectUserEmail = (state: RootState) => state.user.email;
export const selectHeaderIsOpen = (state: RootState) => state.user.headerIsOpen
export const selectWishList = (state: RootState) => state.user.wish_list;
export const selectCartMode = (state: RootState) => state.user.cartMode;
export const selectCartQuestion = (state: RootState) => state.user.cartQuestion;
export const selectIsLoadingAuth = (state: RootState) => state.user.isLoadingAuth;
export const selectOrders = (state: RootState) => state.user.orders;
export const selectAddressBook = (state: RootState) => state.user.address_book;


export default UserSlice.reducer;