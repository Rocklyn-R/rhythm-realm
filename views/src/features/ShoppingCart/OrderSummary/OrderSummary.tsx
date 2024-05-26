import { useState } from "react";
import { SlTag } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { applyCoupon, selectActiveCoupons, selectAppliedCoupons, selectTotal, selectTotalWithCoupon } from "../../../redux-store/CartSlice";
import { formatPrice } from "../../../utilities/utilities";

export const OrderSummary = () => {
    const activeCoupons = useSelector(selectActiveCoupons);
    const [couponInput, setCouponInput] = useState("");
    const [couponErrorMessage, setCouponErrorMessage] = useState("");
    const appliedCoupon = useSelector(selectAppliedCoupons);
    const couponIsApplied = Object.keys(appliedCoupon).length !== 0;
    const discountedTotal = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const dispatch = useDispatch();

    const addedToCart = false;

    const handleApplyCoupon = () => {
        const foundCoupon = activeCoupons.find(coupon => coupon.code === couponInput);
        if (foundCoupon) {
            dispatch(applyCoupon(foundCoupon.code))
        } else {
            setCouponErrorMessage("Coupon code is invalid")
        }
    }

    return (
        <div className="border-2 border-gray-300 mx-8 w-1/3 p-4 ml-10">
            <h1 className="montserrat-bold text-2xl border-b border-b-gray-400 pb-4">Order Summary</h1>
            <div>
                {couponIsApplied ? (
                    <div>
                        <SlTag />
                        <span>{appliedCoupon.code}</span>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center py-4">
                            <SlTag className="text-gray-500 text-xl" />
                            <span className="text-blue-500 text-md font-medium ml-3">Have a coupon code?</span>
                        </div>
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
                    </div>

                )}

                {couponErrorMessage ? (
                    <span className="text-sm text-red-700">{couponErrorMessage}</span>
                ) : ""}
                {couponIsApplied ? (
                    <div className="flex justify-between">
                        <p>Discount:</p>
                        <p>- ${formatPrice((parseFloat(total) * appliedCoupon.discount).toFixed(2))}</p>
                    </div>
                ) : ""}
                <div className="flex justify-between">
                    <p>Subtotal:</p>
                    <p>${couponIsApplied ? formatPrice(discountedTotal) : formatPrice(total)}</p>
                </div>

                <p>Ship to:</p>
                <p>Estimated tax:</p>
            </div>
        </div>
    )
}