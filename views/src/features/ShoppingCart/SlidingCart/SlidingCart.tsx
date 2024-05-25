import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCart, selectTotal } from "../../../redux-store/CartSlice";

interface SlidingCartProps {
    toggleCart: () => void;
}

export const SlidingCart: React.FC<SlidingCartProps> = ({ toggleCart }) => {
    const cart = useSelector(selectCart);
    const cartEmpty = cart.length === 0;
    const total = useSelector(selectTotal);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between bg-red-800 p-4">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button onClick={() => toggleCart()}><X /></button>
            </div>

            {cartEmpty && (
                <div>

                    <p>Your cart is empty</p>
                </div>
            )}
            {cart.map(item => (
                <div className="flex m-4 flex-col items-center">
                    <h2 className="text-xl mb-6">Recently Added</h2>
                    <div className="flex">
                        <button className="border border-black mr-2 p-2">
                            <img src={item.image1} width="130" />
                        </button>
                        <div>
                            <Link to="">{item.name} {item.variant_name}</Link>
                            <p>Quantity: {item.quantity}</p>
                            <p>{item.price}</p>
                        </div>
                    </div>
                    <div className="w-1/2 mt-6">
                        <div className="w-full flex justify-between">
                            <p>Total:</p>
                            <p>{total}</p>
                        </div>
                        <button className="mt-2 p-4 w-full bg-black rounded-md text-white">Cart & Checkout</button>
                    </div>
                </div>
            ))}

        </div>
    )
}