import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishList } from "../api/wishList";
import { selectIsAuthenticated, setWishList } from "../redux-store/UserSlice";

export const useFetchWishList = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        } 
        if (isAuthenticated) {
            const wishListFetch = async () => {
                const result = await getWishList();
                if (result) {
                    dispatch(setWishList(result));
                }
            }
            wishListFetch();
        }
    }, [dispatch, isAuthenticated])
}