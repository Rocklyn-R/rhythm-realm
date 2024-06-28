import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectFirstName, selectLastName, selectEmail, unauthenticateUser } from "../../../redux-store/UserSlice";
import { X } from "lucide-react";
import { logoutUser } from "../../../api/user";
import { useDispatch } from "react-redux";
import { FaHeart, FaHistory, FaRegAddressBook, FaTruck } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";


interface UserAccountProps {
    isOpen: boolean;
    toggleUserAccount: () => void;
}


export const UserAccount: React.FC<UserAccountProps> = ({ isOpen, toggleUserAccount }) => {
    const slidingLoginRef = useRef<HTMLDivElement | null>(null);
    const userFirstName = useSelector(selectFirstName);
    const userLastName = useSelector(selectLastName);
    const userEmail = useSelector(selectEmail);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await logoutUser();
        dispatch(unauthenticateUser());
        //toggleUserAccount();
    }

    return (
        <div
            ref={slidingLoginRef}
            className="flex flex-col w-full items-center h-full z-100 overflow-y-auto"
        >
            <div className="flex justify-between bg-red-800 p-4 w-full">
                <h2 className="text-xl font-bold">Hi, {userFirstName}</h2>
                <button
                    onClick={() => toggleUserAccount()}
                ><X /></button>
            </div>

            <div className="mx-4 py-8 px-4 border border-black mt-8 w-5/6">
                <h4 className="text-center font-bold text-xl">My Account</h4>
                <div className="flex items-center hover:underline cursor-pointer mt-4 mb-2 text-lg">
                   <FaTruck className="mr-2"/> <p>Track Order</p> 
                </div>
                <div className="flex items-center hover:underline cursor-pointer mb-2 text-lg">
                    <IoSettingsSharp className="mr-2"/><p>Profile Settings</p>
                </div>
                <div className="flex items-center hover:underline cursor-pointer mb-2 text-lg">
                    <FaHeart className="mr-2 text-red-800" /><p>Wish List</p>
                </div>
                <div className="flex items-center hover:underline cursor-pointer mb-2 text-lg">
                    <FaRegAddressBook className="mr-2"/><p>Address Book</p>
                </div>
                <div className="flex items-center hover:underline cursor-pointer mb-2 text-lg">
                    <BsArrowReturnLeft className="mr-2"/> <p>Returns & Exchanges</p>
                </div>
                <div className="flex items-center hover:underline cursor-pointer text-lg">
                   <FaHistory className="mr-2"/><p>Order History</p>
                </div>
                
            </div>
            <button
                onClick={() => handleLogout()}
                className="mt-10 underline font-bold"
            >
                Log out</button>
        </div>
    )
}