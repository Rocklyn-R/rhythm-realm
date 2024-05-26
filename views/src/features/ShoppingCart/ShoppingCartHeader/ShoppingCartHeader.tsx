import { useState, useEffect } from "react";
import { PiShoppingCartFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotal, selectTotalItems, selectTotalWithCoupon } from "../../../redux-store/CartSlice";
import { SlidingCart } from "../SlidingCart/SlidingCart";
import { formatPrice } from "../../../utilities/utilities";

export const ShoppingCartHeader = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const total = useSelector(selectTotal);
    const totalItems = useSelector(selectTotalItems);
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const totalWithCoupon = useSelector(selectTotalWithCoupon);

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
                <p>{totalItems} items</p>
                <p className="montserrat-bold text-lg">${appliedCoupon ? formatPrice(totalWithCoupon) : formatPrice(total)}</p>
            </button>
            <div
                className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform z-50 ${cartIsOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <SlidingCart toggleCart={toggleCart} isOpen={cartIsOpen} />
            </div>
            {/* Optional: Add an overlay */}
            {cartIsOpen && (
                <>
                    <div
                        onClick={toggleCart}
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
    );
}