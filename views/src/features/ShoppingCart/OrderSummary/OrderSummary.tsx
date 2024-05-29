import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectSalesTax, selectTotal, selectTotalWithCoupon, selectTotalWithTax } from "../../../redux-store/CartSlice";
import { formatPrice } from "../../../utilities/utilities";
import { MdInfoOutline } from "react-icons/md";
import { Shipping } from "./Shipping/Shipping";
import { CheckoutOrPaypal } from "./CheckoutOrPaypal/CheckoutOrPaypal";
import { CouponCode } from "./CouponCode/CouponCode";

interface OrderSummaryProps {
    page: "Cart" | "Checkout"
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({page}) => {
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const discountedTotal = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
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



    const handleShowTaxInfo = () => {
        setShowTaxInfo(true);
    }

    return (
        <div className="sticky top-0 h-full self-start border-2 border-gray-300 w-1/3 p-4 ml-10">
            <h1 className="montserrat-bold text-2xl border-b-2 border-b-gray-300 pb-4">Order Summary</h1>
            <div>
                <CouponCode />
             
                <div className="flex justify-between py-4">
                    <p>Subtotal:</p>
                    <p className="font-semibold">${formatPrice(total_to_render)}</p>
                </div>
                {appliedCoupon ? (
                    <div className="flex justify-between py-4">
                        <p>Discount:</p>
                        <p className="font-semibold">- ${formatPrice((parseFloat(total) * appliedCoupon.discount).toFixed(2))}</p>
                    </div>
                ) : ""}
                <Shipping 
                    page={page}
                />
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
                    {estimated_tax ? <p className="font-semibold">${formatPrice(estimated_tax)}</p> : "-"}
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