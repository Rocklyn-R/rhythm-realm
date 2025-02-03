import { useRef, useState, useEffect } from "react"
import { X } from "lucide-react";
import { Login } from "../Login/Login";
import { Signup } from "../SignUp/Signup";
import { ForgotPassword } from "../ForgotPassword/ForgotPassword";

interface SlidingLoginProps {
    isOpen: boolean;
    toggleLogin: () => void;
}

export const SlidingLogin: React.FC<SlidingLoginProps> = ({ isOpen, toggleLogin }) => {
    const slidingLoginRef = useRef<HTMLDivElement | null>(null);
    const [showLogin, setShowLogin] = useState(true);
    const [animationClass, setAnimationClass] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);

    useEffect(() => {
        setAnimationClass(prev => (prev === 'slide-in-right' ? 'slide-in-left' : 'slide-in-right'));
    }, [showLogin, showResetPassword]);
    

    const resetSlider = () => {
        toggleLogin();
        setShowResetPassword(false);
        setShowLogin(true);
    }

    return (
        <div
            ref={slidingLoginRef}
            className="flex flex-col w-full items-center h-full z-100 overflow-y-auto"
        >
            <div className="flex justify-between bg-red-800 p-4 w-full">
                <h2 className="text-xl font-bold">{showResetPassword ? "Reset Password" : (showLogin ? "Sign In" : "Create New Account")}</h2>
                <button
                    onClick={() => resetSlider()}
                ><X /></button>
            </div>

            <div className={`mx-4 py-8 px-4 ${animationClass} w-full`}>
                {showResetPassword ? (
                    <>
                        <div className="w-full flex justify-center">
                            <ForgotPassword 
                            toggleLogin={resetSlider}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full py-8">
                            <h2 className="font-semibold">Don't have an account?</h2>
                            <button
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-xl mt-6 w-5/6"
                                onClick={() => {
                                    setShowLogin(false)
                                    setShowResetPassword(false);
                                   
                                }}
                            >
                                Create New Account
                            </button>
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="font-semibold">Remember your login credentials?</h2>
                            <button
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-xl mt-6 w-5/6"
                                onClick={() => {
                                    setShowResetPassword(false)
                                    setShowLogin(true)
                                }}
                            >
                                Sign In
                            </button>
                        </div>
                    </>
                ) : showLogin ? (
                    <>
                        <h4 className="text-center font-bold text-xl">Sign in or create a new account in order to save items or add to your wish list.</h4>
                        <div className="w-full flex justify-center">
                            <Login
                                setShowResetPassword={setShowResetPassword}
                                toggleLogin={resetSlider}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full py-8">
                            <h2 className="font-semibold">Don't have an account?</h2>
                            <button
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-xl mt-6 w-5/6"
                                onClick={() => {
                                    setShowLogin(false)
                                }}
                            >
                                Create New Account
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h4 className="text-center font-bold text-xl">Create a Rhythm Realm Account</h4>
                        <div className="w-full flex justify-center">
                            <Signup
                                toggleLogin={resetSlider}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full py-8">
                            <h2 className="font-semibold">Already have an account?</h2>
                            <button
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-xl mt-6 w-5/6"
                                onClick={() => {
                                    setShowLogin(true);
                                }}
                            >
                                Sign In
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}