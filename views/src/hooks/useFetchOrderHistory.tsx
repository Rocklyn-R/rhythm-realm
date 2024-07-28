import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, setOrders } from "../redux-store/UserSlice";
import { useEffect } from "react";
import { getOrderHistory } from "../api/order";


export const useFetchOrderHistory = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        } 
        if (isAuthenticated) {
            const orderHistoryFetch = async () => {
                console.log("RUNNING NOW")
               const result = await getOrderHistory();
               if (result) {
                dispatch(setOrders(result));
               }
            }
            orderHistoryFetch();
        }
    }, [dispatch, isAuthenticated])
}