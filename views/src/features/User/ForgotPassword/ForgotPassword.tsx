import { Input } from "antd";
import { useState } from "react";
import { checkForUserEmail } from "../../../api/user";
import { sendResetEmail } from "../../../api/user";
import { Loading } from "../../Loading/Loading";

interface ForgotPasswordProps {
    toggleLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ toggleLogin }) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [pending, setPending] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPending(true);
        setErrorMessage("");
        const lowerCaseEmail = email.toLocaleLowerCase()
        console.log(lowerCaseEmail);
        const emailCheckResult = await checkForUserEmail(lowerCaseEmail);
        if (emailCheckResult === "User not found") {
            setErrorMessage("No account associated with that email. Please try again.");
            setPending(false);
        }
        if (emailCheckResult === "User found") {
            console.log(emailCheckResult);
            const resetEmail = await sendResetEmail(lowerCaseEmail);
            console.log(resetEmail)
            setPending(false);
            setSuccessMessage(true)
        }
    }

    return (
        <div className="w-full">
            <h4 className="text-black text-center font-bold text-xl">{successMessage ? "An email has been sent to:" : "Enter your email to reset your password:"}</h4>

            <div
                className="flex flex-col justify-center items-center w-full pt-6 pb-8 border-b-2 border-gray-300"
            >

                {successMessage ? <div className=''>
                    <p className="font-semibold">{email.toLocaleLowerCase()}</p>
                </div> : (
                    <form
                        onSubmit={handleSubmitEmail}
                        id="reset-password"
                        className="flex flex-col justify-center items-center w-full"
                    >
                        <div className=" bg-red-800 rounded-md w-5/6 p-6 mb-6">
                            <Input
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="Email"
                            />
                        </div>
                        {pending ? <Loading size="h-12 w-12" /> :
                            <button
                                type="submit"
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 w-5/6 rounded-md bg-black text-white text-xl"
                            >
                                Submit
                            </button>}
                        {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
                    </form>
                )}
            </div>
        </div>
    )
}