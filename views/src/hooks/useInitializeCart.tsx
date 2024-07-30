import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItemsFromCart, insertMultipleIntoCart, replaceCart } from "../api/cart";
import { selectCart, setCart } from "../redux-store/CartSlice";
import { selectCartMode, selectIsAuthenticated, setCartMode } from "../redux-store/UserSlice";
import { Cart } from "../types/types";
import { removeCoupon } from "../redux-store/CartSlice";

export const useInitializeCart = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const cart = useSelector(selectCart);
    const cartMode = useSelector(selectCartMode);

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
            localStorage.clear();
        }
    } 

    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.clear();
            const savedCartState = localStorage.getItem('cartState');
            if (savedCartState) {
                const cartState = JSON.parse(savedCartState);
                dispatch(setCart(cartState));
            }
        }
        if (isAuthenticated && cartMode === "previous") {
               cartFetch(); 
               dispatch(removeCoupon());
               dispatch(setCartMode(""));
        }
        if (isAuthenticated && cartMode === "current") {
       
            const cartReplacement = async () => {
                console.log(cart);
            console.log("RAN");
                const result = await replaceCart(cart);
                console.log(result);
                if (result) {
                    localStorage.clear();
                }
            }
            cartReplacement();
            dispatch(setCartMode(""))
        }

        if (isAuthenticated && cartMode === "combine") {
            const combineCart = async () => {
                const result = await insertMultipleIntoCart(cart);
                if (result) {
                    await cartFetch();
                }
            } 
            combineCart();
            dispatch(setCartMode(""))
            dispatch(removeCoupon());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, isAuthenticated, cartMode]);
}

