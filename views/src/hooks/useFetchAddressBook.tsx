import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddressBook } from "../api/addressBook";
import { getWishList } from "../api/wishList";
import { selectIsAuthenticated, setAddressBook, setWishList } from "../redux-store/UserSlice";

export const useFetchAddressBook = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        } 
        if (isAuthenticated) {
            const addressBookFetch = async () => {
                const result = await getAddressBook();
                if (result) {
                    dispatch(setAddressBook(result));
                }
            }
            addressBookFetch();
        }
    }, [dispatch, isAuthenticated])
}