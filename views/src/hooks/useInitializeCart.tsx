import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartFromLocalStorage } from "../redux-store/CartSlice";
import { selectIsAuthenticated } from "../redux-store/UserSlice";

export const useInitializeCart = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated)

    useEffect(() => {
        if (!isAuthenticated) {
            const savedCartState = localStorage.getItem('cartState');
            console.log('Loaded cartState from localStorage:', savedCartState); // Debugging line
            if (savedCartState) {
                const cartState = JSON.parse(savedCartState);
                dispatch(setCartFromLocalStorage(cartState));
            }
        }
        if (isAuthenticated) {
            localStorage.clear();
        }
    }, [dispatch, isAuthenticated]);
}

