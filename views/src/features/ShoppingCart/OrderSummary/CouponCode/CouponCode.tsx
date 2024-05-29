import { removeCoupon, selectActiveCoupons, selectAppliedCoupon, selectTotalWithCoupon, applyCoupon, selectTotal } from "../../../../redux-store/CartSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { SlTag } from "react-icons/sl";
import { formatPrice } from "../../../../utilities/utilities";


export const CouponCode = () => {
    const activeCoupons = useSelector(selectActiveCoupons);
    const [showCouponBox, setShowCouponBox] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [couponErrorMessage, setCouponErrorMessage] = useState("");
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const discountedTotal = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const dispatch = useDispatch();
    let total_to_render;
    if (appliedCoupon) {
        total_to_render = discountedTotal;
    } else {
        total_to_render = total;
    }

    const handleApplyCoupon = () => {
        if (couponInput) {
            const foundCoupon = activeCoupons.find(coupon => coupon.code === couponInput.toUpperCase());
            if (foundCoupon) {
                dispatch(applyCoupon(foundCoupon.code));
                setCouponErrorMessage("");
            } else {
                setCouponErrorMessage("Coupon code is invalid")
            }
        } else {
            setCouponErrorMessage("Please enter a coupon");
        }

    }

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setShowCouponBox(false);
    }

    const handleShowCouponBox = () => {
        setCouponErrorMessage("");
        setShowCouponBox(!showCouponBox);
    }

    return (
        <>
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
                                onClick={() => handleShowCouponBox()}
                                className="text-blue-500 text-md font-medium ml-3"
                            >
                                Have a coupon code?
                            </button>
                        </div>
                        {showCouponBox ? (
                            <div className="flex flex-col w-full pb-4">
                                <div className="flex w-full">
                                    <input
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        maxLength={7}
                                        placeholder="Coupon Code"
                                        className="py-2 px-4 font-medium outline-none border border-gray-400 rounded-l-lg"
                                    />
                                    <button
                                        onClick={() => handleApplyCoupon()}
                                        className="hover:bg-red-800 transition-colors duration-300 ease w-1/4 x-36 py-4 rounded-r-lg bg-black text-white self-stretch"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {couponErrorMessage ? (
                                    <span className="text-xs text-red-700 my-1">{couponErrorMessage}</span>
                                ) : ""}
                            </div>

                        ) : ""}
                    </div>
                )}

        </>
    )
}