import { Input } from "antd"
import { useState } from "react";
import { createNewUser } from "../../../api/user";
import { authenticateUser, setUserEmail, setUserFirstName, setUserLastName } from "../../../redux-store/UserSlice";
import { useDispatch } from "react-redux";

interface SignUpProps {
    toggleLogin: () => void;
}

export const Signup: React.FC<SignUpProps> = ({toggleLogin}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();


    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setErrorMessage("Passwords don't match.")
            return;
        }
        try {
            const response = await createNewUser(firstName, lastName, email, password);
            if (response.error) {
                if (response.error === 'User with this email already exists') {
                    setErrorMessage("User with this email already exists. Try a different email.");
                } else {
                    setErrorMessage('Failed to sign up');
                }
            } else if (response.user) {
                dispatch(authenticateUser());
                setErrorMessage("");
                dispatch(setUserFirstName(response.user.first_name));
                dispatch(setUserLastName(response.user.last_name));
                dispatch(setUserEmail(response.user.email));
                toggleLogin();
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        } catch (error: any) {
            setErrorMessage("Failed to sign up");
        }
    }

    return (
        <div
            className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
        >
            <form
                id="signup"
                className="flex flex-col justify-center items-center"
                onSubmit={handleCreateUser}
            >
                <div className=" bg-red-800 rounded-md w-5/6 p-6">
                    <Input
                        name="First name"
                        placeholder="First name"
                        className="mb-6"
                        value={firstName}
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                        name="Last name"
                        placeholder="Last name"
                        className="mb-6"
                        value={lastName}
                        required
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Input
                        name="email"
                        placeholder="Email"
                        className="mb-6"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="Email"
                    />
                    <Input.Password
                        name="Password"
                        placeholder="Password"
                        className="mb-6 text-xl"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                     <Input.Password
                        name="Password-repeat"
                        placeholder="Repeat Password"
                        className="mb-6 text-xl"
                        value={repeatPassword}
                        required
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                </div>
                <p className="text-xs pt-4 w-5/6 font-light text-center">By creating an account, you have agreed to Rhythm Realm's Purchase Terms and Conditions, and you have reviewed Rhythm Realm's Privacy Policy.
                </p>
                <button
                    type="submit"
                    className="hover:bg-red-800 transition-colors duration-300 ease p-4 w-5/6 rounded-md bg-black text-white text-xl mt-6"
                >
                    Create Account
                </button>
                {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
            </form>
        </div>
    )
}