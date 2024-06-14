import { Input } from "antd"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signInUser } from "../../../api/user";
import { authenticateUser, setUserEmail, setUserFirstName, setUserLastName } from "../../../redux-store/UserSlice";

interface LoginProps {
    toggleLogin: () => void;
}


export const Login: React.FC<LoginProps> = ({toggleLogin}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                toggleLogin();
            }

            // Redirect to '/tasks' route after successful signup

        } catch (error: any) {
            console.error('Error signing up:', error.message);
            // Handle error (e.g., display error message to user)
        }
    }

    return (
        <div
            className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
        >
            <form
                className="flex flex-col justify-center items-center"
                onSubmit={handleLogin}
            >
                <div className=" bg-red-800 rounded-md w-5/6 p-6">
                    <Input
                        placeholder="Email"
                        className="mb-6"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input.Password
                        placeholder="Password"
                        className="text-xl"
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
            </form>
        </div>

    )
}