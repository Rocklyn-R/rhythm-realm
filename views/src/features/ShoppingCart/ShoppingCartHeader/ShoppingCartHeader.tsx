import { useState } from "react";
import { PiShoppingCartFill } from "react-icons/pi";
import { SlidingCart } from "../SlidingCart/SlidingCart";

export const ShoppingCartHeader = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const toggleCart = () => {
        setCartIsOpen(!cartIsOpen)
    }

    return (
        <>
            <button 
            className="flex flex-col items-center px-3"
            onClick={() => toggleCart()}
            >
                <PiShoppingCartFill className="text-3xl" />
                <p>0 items</p>
                <p>$0.00</p>
            </button>
            <div className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform z-50 ${cartIsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <SlidingCart 
                    toggleCart={toggleCart}
                />
            </div>
            {/* Optional: Add an overlay */}
            {cartIsOpen && (
                <div onClick={toggleCart} className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}
        </>
    )
}