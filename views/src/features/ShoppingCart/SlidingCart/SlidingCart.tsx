import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCart, selectTotal } from "../../../redux-store/CartSlice";
import { GiShoppingCart } from "react-icons/gi";
import { useEffect, useRef } from "react";
import { formatPrice } from "../../../utilities/utilities";

interface SlidingCartProps {
    toggleCart: () => void;
    isOpen: boolean;
}

export const SlidingCart: React.FC<SlidingCartProps> = ({ toggleCart, isOpen }) => {
    const cart = useSelector(selectCart);
    const cartEmpty = cart.length === 0;
    const total = useSelector(selectTotal);
    const slidingCartRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen && slidingCartRef.current) {
            slidingCartRef.current.scrollTop = 0;
        }
    }, [isOpen])

    return (
        <div
            ref={slidingCartRef}
            className="flex flex-col items-center h-full overflow-y-auto"
        >
            <div className="flex justify-between bg-red-800 p-4 w-full">
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <button onClick={() => toggleCart()}><X /></button>
            </div>

            {cartEmpty ? (
                <div className="flex flex-col items-center m-6">
                    <GiShoppingCart className="text-5xl" />
                    <h2 className="text-xl mt-4 text-center">Your cart is currently empty!</h2>
                    <button
                        onClick={() => toggleCart()}
                        className="hover:bg-red-800 transition-colors duration-300 ease mt-6 p-4 w-full bg-black rounded-md text-white"
                    >
                        Continue Shopping
                    </button>
                </div>


            ) : <h2 className="text-xl m-6">Recently Added</h2>}

            {cart.map(item => (
                <div className="flex mb-6 m-6 justify-center">

                    <div className="">
                        <Link
                            className="hover:underline mr-2 w-full"
                            to={`/${item.category_name}/${item.subcategory_name}/${item.name}/${item.variant_name ? `/${item.variant_name}` : ''}`}
                        >
                            <img
                                width="180"
                                src={item.image1}
                                className="border flex justify-center border-black p-2  object-cover"
                                alt={`${item.name} ${item.variant_name}`}
                            />
                        </Link>
                    </div>


                    <div className="w-1/2 m-4">
                        <Link
                            onClick={() => toggleCart()}
                            className="hover:underline"
                            to={`/${item.category_name}/${item.subcategory_name}/${item.name}/${item.variant_name ? `/${item.variant_name}` : ''}`}
                        >
                            {item.name} {item.variant_name}
                        </Link>
                        <p>Quantity: {item.quantity}</p>
                        <p>${formatPrice(item.price)}</p>
                    </div>


                </div>
            ))}

            {cartEmpty ? (
                ""
            ) : (
                <div className="w-2/3 mt-6">
                    <div className="w-full flex justify-between">
                        <p>Total:</p>
                        <p>${formatPrice(total)}</p>
                    </div>

                    <Link to="/Cart">
                        <button
                            onClick={() => toggleCart()}
                            className="hover:bg-red-800 transition-colors duration-300 ease mt-2 p-4 w-full mb-8 bg-black rounded-md text-white"
                        >
                            Cart & Checkout
                        </button>
                    </Link>
                </div>
            )}

        </div>
    )
}