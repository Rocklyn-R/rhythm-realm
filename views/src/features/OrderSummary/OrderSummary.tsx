import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectSalesTax, selectTotal, selectTotalWithCoupon, selectTotalWithTax, setSalesTax, setTotalWithTax, selectShippingCost, selectShippingType } from "../../redux-store/CartSlice";
import { formatPrice } from "../../utilities/utilities";
import { MdInfoOutline } from "react-icons/md";
import { Shipping } from "./Shipping/Shipping";
import { CheckoutOrPaypal } from "./CheckoutOrPaypal/CheckoutOrPaypal";
import { CouponCode } from "./CouponCode/CouponCode";
import { selectSelectedState } from "../../redux-store/ShippingSlice";
import { FiftyStates } from "./Shipping/50states";
import { CartSummary } from "./CartSummary/CartSummary";

interface OrderSummaryProps {
    page: "Cart" | "Checkout"
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ page }) => {
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const discountedTotal = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const [showTaxInfo, setShowTaxInfo] = useState(false);
    const overlayRef = useRef<any>(null);
    const estimated_tax = useSelector(selectSalesTax);
    const [sales_tax, setSales_Tax] = useState("")
    const [total_with_tax, setTotal_With_Tax] = useState("");
    const total_to_render = appliedCoupon ? discountedTotal : total;
    const dispatch = useDispatch();
    const shippingCost = useSelector(selectShippingCost);

    const handleShowTaxInfo = () => {
        setShowTaxInfo(true);
    }

    const handleClickOutside = (event: any) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
          setShowTaxInfo(false);
        }
      };
    
      useEffect(() => {
        if (showTaxInfo) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showTaxInfo]);

    useEffect(() => {
        if (page === "Checkout" && estimated_tax) {
            
            const newTotalWithTax = (parseFloat(total_to_render) + parseFloat(estimated_tax)).toFixed(2);
            setTotal_With_Tax(newTotalWithTax);
            if (shippingCost) {
                const newTotalWithShipping = (parseFloat(newTotalWithTax) + parseFloat(shippingCost)).toFixed(2);
                setTotal_With_Tax(newTotalWithShipping);
            }
        }
    }, [dispatch, estimated_tax, shippingCost]);


    return (
        <div className="sticky top-0 h-full self-start border-2 border-gray-300 w-1/3 p-4 ml-10">
            <h1 className="montserrat-bold text-2xl border-b-2 border-b-gray-300 pb-4">Order Summary</h1>
            <div>
                <CouponCode />

                <div className="flex justify-between py-4">
                    <p>Subtotal:</p>
                    <p className="font-semibold">${formatPrice(total)}</p>
                </div>
                {appliedCoupon ? (
                    <div className="flex justify-between py-4">
                        <p>Discount:</p>
                        <p className="font-semibold">- ${formatPrice((parseFloat(total) * appliedCoupon.discount).toFixed(2))}</p>
                    </div>
                ) : ""}
                <Shipping
                    page={page}
                    setTotal_With_Tax={setTotal_With_Tax}
                    sales_tax={sales_tax}
                    setSales_Tax={setSales_Tax}
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
                                ref={overlayRef}
                                className="flex absolute -top-23 left-15 w-80 text-white bg-black bg-opacity-70 border border-gray-300 shadow-xl z-50 mt-2"
                            >
                                <p className="text-sm p-2">The sales tax for your order is based on state and local tax rates, as well as the shipping and/or service location of your order.</p>
                                <button
                                    onClick={() => setShowTaxInfo(false)}
                                    className="flex items-start px-2">x
                                </button>
                            </div>
                        )}
                    </div>
                    {
                        page === "Cart"
                            ? sales_tax
                                ? <p className="font-semibold">${formatPrice(sales_tax)}</p>
                                : "-"
                            : estimated_tax
                                ? <p className="font-semibold">${formatPrice(estimated_tax)}</p>
                                : "-"
                    }
                </div>
                <div className="pt-4 flex justify-between font-bold">
                    <p className="">Estimated Total:</p>
                    <p>${total_with_tax ? formatPrice(total_with_tax) : formatPrice(total_to_render)}</p>
                </div>
                {page === "Cart" ? (
                    <CheckoutOrPaypal />
                ) : <CartSummary /> }
                
            </div>
        </div>
    )
}