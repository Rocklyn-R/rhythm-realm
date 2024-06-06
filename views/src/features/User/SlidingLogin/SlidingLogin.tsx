import { useRef, useState, useEffect } from "react"
import { X } from "lucide-react";
import { Login } from "../Login/Login";
import { Signup } from "../SignUp/Signup";

interface SlidingLoginProps {
    isOpen: boolean;
    toggleLogin: () => void;
}

export const SlidingLogin: React.FC<SlidingLoginProps> = ({ isOpen, toggleLogin }) => {
    const slidingLoginRef = useRef<HTMLDivElement | null>(null);
    const [showLogin, setShowLogin] = useState(true);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        setAnimationClass(showLogin ? 'slide-in-right' : 'slide-in-left');
    }, [showLogin]);

    return (
        <div
            ref={slidingLoginRef}
            className="flex flex-col w-full items-center h-full z-100 overflow-y-auto"
        >
            <div className="flex justify-between bg-red-800 p-4 w-full">
                <h2 className="text-xl font-bold">{showLogin ? "Sign In" : "Create New Account"}</h2>
                <button
                    onClick={() => toggleLogin()}
                ><X /></button>
            </div>
            <div className={`mx-4 py-8 px-4 ${animationClass}`}>
                {showLogin ? (
                    <>
                        <h4 className="text-center font-bold text-xl">Sign in or create a new account in order to save items or add to your wish list.</h4>
                        <div className="w-full flex justify-center">
                            <Login 
                                toggleLogin={toggleLogin}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full py-8">
                            <h2 className="font-semibold">Don't have an account?</h2>
                            <button
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-xl mt-6 w-5/6"
                                onClick={() => setShowLogin(false)}
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
                                toggleLogin={toggleLogin}
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full py-8">
                            <h2 className="font-semibold">Already have an account?</h2>
                            <button
                                className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-xl mt-6 w-5/6"
                                onClick={() => setShowLogin(true)}
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