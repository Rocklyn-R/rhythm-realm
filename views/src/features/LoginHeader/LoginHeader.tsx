import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { SlidingLogin } from "./SlidingLogin/SlidingLogin";

export const LoginHeader = () => {
    const [loginIsOpen, setLoginIsOpen] = useState(false);

    const toggleLogin = () => {
        setLoginIsOpen(!loginIsOpen)
    }

    return (
        <>
            <button
                className="flex flex-col items-center"
                onClick={() => toggleLogin()}
            >
                <FaUser
                    className="text-3xl"
                />
            </button>
            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform z-50 ${loginIsOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <SlidingLogin toggleLogin={toggleLogin} isOpen={loginIsOpen} />
            </div>
            {loginIsOpen && (
                <>
                    <div
                        onClick={toggleLogin}
                        className="fixed inset-0 bg-black opacity-50 z-40"
                    ></div>
                    <style>
                        {`
                            body {
                                overflow: hidden;
                                margin-right: 16px;
                            }
                        `}
                    </style>
                </>
            )}
        </>
    )
}