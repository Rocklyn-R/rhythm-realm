import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectFirstName, selectLastName, selectEmail } from "../../../redux-store/UserSlice";

interface UserAccountProps {
    isOpen: boolean;
    toggleUserAccount: () => void;
}


export const UserAccount: React.FC<UserAccountProps> = ({ isOpen, toggleUserAccount }) => {
    const slidingLoginRef = useRef<HTMLDivElement | null>(null);
    const userFirstName = useSelector(selectFirstName);
    const userLastName = useSelector(selectLastName);
    const userEmail = useSelector(selectEmail);

    return (
        <div
            ref={slidingLoginRef}
            className="flex flex-col w-full items-center h-full z-100 overflow-y-auto"
        >
            <div className="flex justify-between bg-red-800 p-4 w-full">
                <h2 className="text-xl font-bold">Hi, {userFirstName}</h2>
                <button
                    onClick={() => toggleUserAccount()}
                >X</button>
            </div>

            <div className="mx-4 py-8 px-4 border border-black mt-8 w-5/6">
                    <h4 className="text-center font-bold text-xl">Account Details</h4>
                    <div className="w-full flex items-start flex-col pt-4">
                        <p>Name: {userFirstName} {userLastName}</p>
                        <p>Email: {userEmail}</p>
                    </div>
            </div>
            <button>My Wish List</button>
        </div>
    )
}