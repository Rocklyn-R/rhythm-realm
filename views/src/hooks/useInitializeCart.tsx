import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemsFromCart } from "../api/cart";
import { setCart } from "../redux-store/CartSlice";
import { selectIsAuthenticated } from "../redux-store/UserSlice";
import { Cart } from "../types/types";

export const useInitializeCart = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated)

    useEffect(() => {
        if (!isAuthenticated) {
            const savedCartState = localStorage.getItem('cartState');
            console.log('Loaded cartState from localStorage:', savedCartState); // Debugging line
            if (savedCartState) {
                const cartState = JSON.parse(savedCartState);
                dispatch(setCart(cartState));
            }
        }
        if (isAuthenticated) {
            localStorage.clear();
            const cartFetch = async () => {
                const result = await getItemsFromCart();
                if (result) {
                    const totalPrice: string = result.cart.reduce((total: number, product: Cart) => {
                        // Parse price or sale_price to number
                        const priceToUse = product.sale_price !== null ? parseFloat(product.sale_price) : parseFloat(product.price);
                        
                        // Multiply priceToUse by product.quantity
                        const totalPriceForProduct = priceToUse * product.quantity;
                    
                        // Add to total
                        return total + totalPriceForProduct;
                    }, 0).toFixed(2);

                    const totalItems =  result.cart.reduce((total: number, product: Cart) => {
                            return total + product.quantity;
                        }, 0);
                    
                    const cartState = {
                        cart: result.cart,
                        total_items: totalItems,
                        total: totalPrice
                    };
                    dispatch(setCart(cartState));
                }
            } 
            cartFetch();
        }
    }, [dispatch, isAuthenticated]);
}

