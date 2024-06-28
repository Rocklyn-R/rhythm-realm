import { useDispatch } from "react-redux";
import { setCartMode, setCartQuestion } from "../../../redux-store/UserSlice";

interface HandleCartProps {
    toggleUserHeader: () => void;
}

export const HandleCart: React.FC<HandleCartProps> = ({ toggleUserHeader }) => {
    const dispatch = useDispatch();

    const handleKeepCurrentCart = async () => {
        dispatch(setCartMode("current"));
        dispatch(setCartQuestion(false));
        toggleUserHeader();
    }
    const handleRestorePreviousCart = async () => {
        dispatch(setCartMode("previous"));
        dispatch(setCartQuestion(false));
        toggleUserHeader();
    }

    const handleCombineCarts = async () => {
        dispatch(setCartMode("combine"));
        dispatch(setCartQuestion(false));
        toggleUserHeader();
    }

    return (
        <div className="flex flex-col items-center w-1/2 bg-white p-8 rounded shadow-lg">
            <p className="text-center">Welcome back! Would you like to keep your current cart, restore your previous cart, or combine both carts?</p>
            <div className="flex flex-col">
                <button
                    className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-md mt-6"
                    onClick={() => handleKeepCurrentCart()}
                >
                    Keep current cart</button>
                <button
                    className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-md mt-6"
                    onClick={() => handleRestorePreviousCart()}
                >
                    Restore previous cart
                </button>
                <button
                    className="hover:bg-red-800 transition-colors duration-300 ease p-4 rounded-md bg-black text-white text-md mt-6"
                    onClick={() => handleCombineCarts()}
                >
                    Combine carts
                </button>
            </div>
        </div>
    )
}