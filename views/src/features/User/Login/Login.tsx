import { Input } from "antd"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getItemsFromCart } from "../../../api/cart";
import { signInUser } from "../../../api/user";
import { selectCart } from "../../../redux-store/CartSlice";
import { authenticateUser, setCartMode, setCartQuestion, setUserEmail, setUserFirstName, setUserLastName } from "../../../redux-store/UserSlice";
import _ from 'lodash';

interface LoginProps {
    toggleLogin: () => void;
}


export const Login: React.FC<LoginProps> = ({ toggleLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const cart = useSelector(selectCart);


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(setCartMode(""));
        console.log(password);
        console.log(email);
        try {
            // Make a POST request to your server's signup endpoint using fetch
            const response = await signInUser(email, password);
            if (response.error) {
                setErrorMessage('Incorrect email or password. Try again.');
                setEmail('');
                setPassword('');
                return;
            } else {
                setErrorMessage('');
                dispatch(authenticateUser());
                dispatch(setUserFirstName(response.user.first_name));
                dispatch(setUserLastName(response.user.last_name));
                dispatch(setUserEmail(response.user.email));
                if (cart.length === 0) {
                    dispatch(setCartMode("previous"));
                    toggleLogin();
                } else {
                    const previousCart = await getItemsFromCart();
                    if (previousCart.cart.length === 0) {
                        dispatch(setCartMode("current"));
                        toggleLogin();
                    } else if (_.isEqual(previousCart.cart, cart)) {
                        dispatch(setCartMode("previous"));
                        toggleLogin();
                    } else {
                        dispatch(setCartMode(""));
                        dispatch(setCartQuestion(true));
                    }
                }

            }

        } catch (error: any) {
            console.log('Error signing up:', error.message);
        }
    }

    return (
        <div
            className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
        >
            <form
                id="login"
                className="flex flex-col justify-center items-center"
                onSubmit={handleLogin}
            >
                <div className=" bg-red-800 rounded-md w-5/6 p-6">
                    <Input
                        name="email"
                        placeholder="Email"
                        className="mb-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="Email"
                    />
                    <Input.Password
                        name="Password"
                        placeholder="Password"
                        className="text-xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="hover:bg-red-800 transition-colors duration-300 ease p-4 w-5/6 rounded-md bg-black text-white text-xl mt-6"
                >
                    Sign in
                </button>
                {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
            </form>
        </div>

    )
}