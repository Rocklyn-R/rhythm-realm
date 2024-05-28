import { useState, useRef } from "react";
import { SlTag } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { applyCoupon, removeCoupon, selectActiveCoupons, selectAppliedCoupon, selectSalesTax, selectTotal, selectTotalWithCoupon, selectTotalWithTax } from "../../../redux-store/CartSlice";
import { formatPrice } from "../../../utilities/utilities";
import { MdInfoOutline } from "react-icons/md";
import { Shipping } from "./Shipping/Shipping";
import { CheckoutOrPaypal } from "./CheckoutOrPaypal/CheckoutOrPaypal";


export const OrderSummary = () => {
    const activeCoupons = useSelector(selectActiveCoupons);
    const [showCouponBox, setShowCouponBox] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [couponErrorMessage, setCouponErrorMessage] = useState("");
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const discountedTotal = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const dispatch = useDispatch();
    const [showTaxInfo, setShowTaxInfo] = useState(false);
    const overlayRef = useRef(null);
    const estimated_tax = useSelector(selectSalesTax);
    const total_with_tax = useSelector(selectTotalWithTax);
    let total_to_render;
    if (appliedCoupon) {
        total_to_render = discountedTotal;
    } else {
        total_to_render = total;
    }

    const addedToCart = false;

    const handleApplyCoupon = () => {
        const foundCoupon = activeCoupons.find(coupon => coupon.code === couponInput.toUpperCase());
        if (foundCoupon) {
            dispatch(applyCoupon(foundCoupon.code));
            setCouponErrorMessage("");
        } else {
            setCouponErrorMessage("Coupon code is invalid")
        }
    }

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setShowCouponBox(false);
    }

    const handleShowTaxInfo = () => {
        setShowTaxInfo(true);
    }

    return (
        <div className="sticky top-0 h-full self-start border-2 border-gray-300 mx-8 w-1/3 p-4 ml-10">
            <h1 className="montserrat-bold text-2xl border-b-2 border-b-gray-300 pb-4">Order Summary</h1>
            <div>
                {appliedCoupon ? (
                    <div className="flex items-center justify-between py-4">
                        <span className="flex items-center"><SlTag className="mr-2" />{appliedCoupon.code}</span>
                        <button
                            onClick={() => handleRemoveCoupon()}
                            className="hover:underline text-red-800 text-md font-medium ml-3"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center py-4">
                            <SlTag className="text-gray-500 text-xl" />
                            <button
                                onClick={() => setShowCouponBox(true)}
                                className="text-blue-500 text-md font-medium ml-3"
                            >
                                Have a coupon code?
                            </button>
                        </div>
                        {showCouponBox ? (
                            <div className="flex w-full pb-4">
                                <input
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    maxLength={7}
                                    placeholder="Coupon Code"
                                    className="py-2 px-4 font-medium outline-none border border-gray-400 rounded-l-lg"
                                />
                                <button
                                    onClick={() => handleApplyCoupon()}
                                    className={`${addedToCart ? "bg-red-800" : "bg-black"} hover:bg-red-800 transition-colors duration-300 ease w-1/4 x-36 py-4 rounded-r-lg bg-black text-white self-stretch`}
                                >
                                    Apply
                                </button>
                            </div>
                        ) : ""}

                    </div>

                )}

                {couponErrorMessage ? (
                    <span className="text-sm text-red-700">{couponErrorMessage}</span>
                ) : ""}
                {appliedCoupon ? (
                    <div className="flex justify-between py-4">
                        <p>Discount:</p>
                        <p>- ${formatPrice((parseFloat(total) * appliedCoupon.discount).toFixed(2))}</p>
                    </div>
                ) : ""}
                <div className="flex justify-between py-4">
                    <p>Subtotal:</p>
                    <p className="font-semibold">${formatPrice(total_to_render)}</p>
                </div>
                <Shipping />
                <div className="flex justify-between items-center border-b-2 border-gray-300">
                    <div className="flex items-center py-4 relative">
                        <p>Estimated tax:</p>
                        <button
                            onClick={() => handleShowTaxInfo()}
                            className="mx-2"><MdInfoOutline className="text-lg" />
                        </button>
                        {showTaxInfo && (
                            <div
                                className="flex absolute -top-23 left-15 w-80 bg-white border border-gray-300 shadow-xl z-50 mt-2"
                            >
                                <p className="text-sm p-2">The sales tax for your order is based on state and local tax rates, as well as the shipping and/or service location of your order.</p>
                                <button
                                    onClick={() => setShowTaxInfo(false)}
                                    className="flex items-start px-2">x
                                </button>
                            </div>
                        )}
                    </div>
                    {estimated_tax ? <p className="font-semibold">${formatPrice(estimated_tax)}</p> : ""}
                </div>
                <div className="pt-4 flex justify-between font-bold">
                    <p className="">Estimated Total:</p>
                    <p>${total_with_tax ? formatPrice(total_with_tax) : formatPrice(total_to_render)}</p>
                </div>
                <CheckoutOrPaypal />
            </div>
        </div>
    )
}