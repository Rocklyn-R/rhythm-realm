import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { SlidingLogin } from "./SlidingLogin/SlidingLogin";
import { selectFirstName, selectIsAuthenticated } from "../../redux-store/UserSlice";
import { useSelector } from "react-redux";
import { UserAccount } from "./UserAccount/UserAccount";

export const UserHeader = () => {
    const [userHeaderIsOpen, setUserHeaderIsOpen] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userFirstName = useSelector(selectFirstName);

    const toggleUserHeader = () => {
        setUserHeaderIsOpen(!userHeaderIsOpen)
    }

    return (
        <>
            <button
                className="flex flex-col items-center"
                onClick={() => toggleUserHeader()}
            >
                <FaUser
                    className="text-3xl"
                />
                <p>{isAuthenticated ? `Hi, ${userFirstName}` : "Sign In"}</p>
            </button>
            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform z-50 ${userHeaderIsOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
               {isAuthenticated ? (
                <UserAccount toggleUserAccount={toggleUserHeader} isOpen={userHeaderIsOpen} />
               ) : <SlidingLogin toggleLogin={toggleUserHeader} isOpen={userHeaderIsOpen} />} 
            </div>
            {userHeaderIsOpen && (
                <>
                    <div
                        onClick={toggleUserHeader}
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