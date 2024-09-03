import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectFirstName, unauthenticateUser } from "../../../redux-store/UserSlice";
import { X } from "lucide-react";
import { logoutUser } from "../../../api/user";
import { useDispatch } from "react-redux";
import { FaHeart, FaHistory, FaRegAddressBook, FaTruck } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


interface UserAccountProps {
    isOpen: boolean;
    toggleUserAccount: () => void;
}


export const UserAccount: React.FC<UserAccountProps> = ({ isOpen, toggleUserAccount }) => {
    const slidingLoginRef = useRef<HTMLDivElement | null>(null);
    const userFirstName = useSelector(selectFirstName);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        dispatch(unauthenticateUser());
        //toggleUserAccount();
    }

    const handleClickWishList = () => {
        toggleUserAccount();
        navigate('/WishList');
    }

    const handleClickProfile = () => {
        toggleUserAccount();
        navigate('/AccountSettings');
    }

    const handleClickOrderHistory = () => {
        toggleUserAccount();
        navigate('/OrderHistory');
    }

    const handleClickReturns = () => {
        toggleUserAccount();
        navigate('/Returns');
    }

    const handleClickAddressBook = () => {
        toggleUserAccount();
        navigate('/AddressBook')
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
                    <FaTruck className="mr-2" /> <p>Track Order</p>
                </div>
                <button
                    onClick={() => handleClickProfile()}
                    className="flex items-center hover:underline cursor-pointer mb-2 text-lg">
                    <IoSettingsSharp className="mr-2" /><p>Account Settings</p>
                </button>
                <button
                    onClick={() => handleClickWishList()}
                    className="flex items-center hover:underline cursor-pointer mb-2 text-lg"
                >
                    <FaHeart className="mr-2 text-red-800" /><p>Wish List</p>
                </button>
                <button
                onClick={() => handleClickAddressBook()}
                    className="flex items-center hover:underline cursor-pointer mb-2 text-lg">
                    <FaRegAddressBook className="mr-2" /><p>Address Book</p>
                </button>
                <button
                    onClick={() => handleClickReturns()}
                    className="flex items-center hover:underline cursor-pointer mb-2 text-lg"
                >
                    <BsArrowReturnLeft className="mr-2" /> <p>Returns</p>
                </button>
                <div className="flex items-center hover:underline cursor-pointer text-lg">
                    <button
                        onClick={() => handleClickOrderHistory()}
                        className="flex items-center hover:underline cursor-pointer mb-2 text-lg"
                    >
                        <FaHistory className="mr-2" /><p>Order History</p>
                    </button>
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