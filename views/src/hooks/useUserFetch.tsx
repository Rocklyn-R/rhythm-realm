import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { checkAuthentication } from "../api/user";
import { authenticateUser, unauthenticateUser, setUserFirstName, setUserLastName, setUserEmail, setCartMode, setIsLoadingAuth } from "../redux-store/UserSlice";

export const useUserFetch = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const authorizationCheck = async () => {
            const response = await checkAuthentication();
            if (response.user) {
                dispatch(setIsLoadingAuth(false));
                dispatch(authenticateUser());
                dispatch(setUserFirstName(response.user.first_name));
                dispatch(setUserLastName(response.user.last_name));
                dispatch(setUserEmail(response.user.email));
                dispatch(setCartMode("previous"));
            }
            else if (response.error) {
                dispatch(setIsLoadingAuth(false));
                dispatch(unauthenticateUser())
            } 
        }
        authorizationCheck();
    }, [dispatch])
}