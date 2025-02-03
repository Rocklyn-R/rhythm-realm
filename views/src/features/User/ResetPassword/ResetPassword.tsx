import { Input } from "antd"
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { checkToken, createNewPasswordWithToken } from "../../../api/user";
import { setHeaderIsOpen } from "../../../redux-store/UserSlice";
import { Loading } from "../../Loading/Loading";

export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [pending, setPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const [userId, setUserId] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        // Call backend to verify the token
        const validateToken = async () => {
            try {
                if (token) {
                    const response = await checkToken(token);
                    if (response.valid) {
                        setIsValid(true);  // Token is valid, show form
                        setUserId(response.user_id)
                    } else {
                        setIsValid(false);
                        if (response.message === "Token expired") {
                            setError(response.message);
                        } else {
                            setError(response.message)
                        }
                    }
                }
            } catch (error) {
                setError('Error verifying token');
            }
        };

        validateToken();
    }, [token]);

    const submitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setErrorMessage("");
        if (password !== passwordRepeat) {
            setErrorMessage("Passwords don't match. Try again.")
            setPending(false);
        } else {
            if (userId) {
                const passwordUpdate = await createNewPasswordWithToken(password, userId);
                console.log(passwordUpdate);
                if (passwordUpdate) {
                    setSuccessMessage(true);
                }
                setPending(false);
            }
        }
    }

    if (isValid === null) {
        return (
            <Loading />
        )
    }

    if (isValid === false && error === "Token expired") {
        return (
            <div className="mt-2 w-full flex justify-center flex-col items-center">
                <h1 className="mb-8 text-3xl text-center font-bold">Reset Password</h1>
                <p>This link has expired.</p>
            </div>
        )
    }
    if (isValid === false && error === "Token not found") {
        return (
            <div className="mt-2 w-full flex justify-center flex-col items-center">
                <p>This page does not exist.</p>
            </div>
        )
    }
    
    return (
        <div
        className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
    >
        
        <h1 className="mb-8 text-3xl text-center font-bold">Reset Password</h1>
    
            {successMessage ? (
                <div className='reset-password-container'>
                    <p className="reset-text">Password successfully updated! Log in with your new password.</p>
                    <button className="command-button" onClick={() => dispatch(setHeaderIsOpen())}>Go to Login Page</button>
                </div>
            ) :
        <form
            id="login"
            className="flex flex-col justify-center items-center"
            onSubmit={submitNewPassword}
        >
            <div className=" bg-red-800 rounded-md w-5/6 p-6">
                <Input.Password
                    name="password"
                    placeholder="New password"
                    className="text-xl mb-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="Email"
                />
                <Input.Password
                    name="password-repeat"
                    placeholder="Repeat password"
                    className="text-xl"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    required
                />
            </div>
            {pending ? <Loading /> : <button
                type="submit"
                className="hover:bg-red-800 transition-colors duration-300 ease p-4 w-5/6 rounded-md bg-black text-white text-xl mt-8"
            >
               Change Password
            </button>}
            {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
        </form> }
    </div>

    )
}