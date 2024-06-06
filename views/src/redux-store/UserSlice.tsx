import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { User } from "../types/types";

export const UserSlice = createSlice({
    name: "user",
    initialState: {
        isAuthenticated: false,
        firstName: '',
        lastName: '',
        email: '',
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
    }
})

export const {
    authenticateUser,
    unauthenticateUser,
    setUserFirstName,
    setUserLastName,
    setUserEmail
} = UserSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectFirstName = (state: RootState) => state.user.firstName;
export const selectLastName = (state: RootState) => state.user.lastName;
export const selectEmail = (state: RootState) => state.user.email;


export default UserSlice.reducer;