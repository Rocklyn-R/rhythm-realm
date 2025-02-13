import { Input, Button } from "antd";
import { useEffect, useRef, useState } from "react"
import { MdInfoOutline, MdLock } from "react-icons/md";
import { BillingAddress } from "./BillingAddress/BillingAddress";
import PayPalLogo from "../../../images/icons/PaypalLogo.png";
import { createOrder, createOrderItems, createOrderShipping } from "../../../api/order";
import { generateOrderNumber } from "../../../utilities/utilities";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectCart, selectSalesTax, selectShippingCost, selectShippingType, selectTotal, selectTotalWithCoupon, selectTotalWithTax, setCart } from "../../../redux-store/CartSlice";
import { selectIsAuthenticated } from "../../../redux-store/UserSlice";
import { deleteCart } from "../../../api/cart";
import { useDispatch } from "react-redux";
import {
    selectAddress,
    selectApartment,
    selectCity,
    selectFullName,
    selectSelectedState,
    selectZipCode,
    selectEmail,
    selectPhone,
    clearShippingInfo
} from "../../../redux-store/ShippingSlice";


export const ReviewAndPayment = () => {
    const [selectedPayment, setSelectedPayment] = useState("Credit or Debit");
    const [showCreditOrDebit, setShowCreditOrDebit] = useState(true);
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const [showPaypal, setShowPaypal] = useState(false);
    const [showInfoMessage, setShowInfoMessage] = useState(false);
    const infoMessageRef = useRef<any>(null);
    const [creditContentHeight, setCreditContentHeight] = useState('0px');
    const [payPalContentHeight, setPayPalContentHeight] = useState('0px')
    const creditRef = useRef<any>(null);
    const paypalRef = useRef<any>(null);
    const cart = useSelector(selectCart);
    const total_with_tax = useSelector(selectTotalWithTax);
    const total = useSelector(selectTotal);
    const total_with_coupon = useSelector(selectTotalWithCoupon);
    const total_tax = useSelector(selectSalesTax);
    const shipping_cost = useSelector(selectShippingCost);
    const shipping_type = useSelector(selectShippingType);
    const applied_coupon = useSelector(selectAppliedCoupon);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fullName = useSelector(selectFullName);
    const address = useSelector(selectAddress);
    const apartment = useSelector(selectApartment);
    const city = useSelector(selectCity);
    const selectedState = useSelector(selectSelectedState);
    const zip_code = useSelector(selectZipCode);
    const email = useSelector(selectEmail);
    const phone = useSelector(selectPhone);
    const [billingValidated, setBillingValidated] = useState(true);
    const [showBillingErrors, setShowBillingErrors] = useState(false);

    const handleClickOutside = (event: any) => {
        if (infoMessageRef.current && !infoMessageRef.current.contains(event.target)) {
            setShowInfoMessage(false);
        }
    };

    useEffect(() => {
        if (showInfoMessage) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showInfoMessage]);

    const handleSelectPayment = (method: string, renderBoolean: boolean, renderFunction: (arg0: boolean) => void) => {
        renderFunction(!renderBoolean);
        setSelectedPayment(method);
        if (method === 'Credit or Debit') {
            setShowPaypal(false);
        } else {
            setShowCreditOrDebit(false);
        }
    }

    useEffect(() => {
        if (showCreditOrDebit && !showPaypal) {
            setCreditContentHeight(`${creditRef.current.scrollHeight + 100}px`);
        } else {
            setCreditContentHeight('0px');
        }
    }, [showCreditOrDebit, billingSameAsShipping, showPaypal]);

    useEffect(() => {
        if (showPaypal) {
            setPayPalContentHeight(`${paypalRef.current.scrollHeight}px`);
        } else {
            setPayPalContentHeight('0px');
        }
    }, [showPaypal]);

    const handleCompleteOrder = async () => {
        if (!billingValidated) {
            setShowBillingErrors(true);
            return;
        }
        const order_id = generateOrderNumber();
        const discount = applied_coupon ? applied_coupon.discount.toFixed(2) : null;
        const cost_of_shipping = shipping_cost ? shipping_cost : null;
        const completeOrder = await createOrder(order_id,
            total,
            discount,
            total_with_coupon,
            total_tax,
            shipping_type,
            cost_of_shipping,
            total_with_tax
        );
        //setCurrentOrder(completeOrder);
        if (completeOrder) {
            cart.forEach(async (item) => {
                 await createOrderItems(order_id, item.variant_id, item.quantity);
                //setCurrentOrderItems((prevItems: any) => [...prevItems, newItem]);
                //console.log(newItem);
            })
            //console.log(isAuthenticated);
            const defaultCartState = {
                cart: [],
                total_items: 0,
                total: "0"
            };
            const orderShipping = await createOrderShipping(order_id, fullName, address, apartment, city, selectedState, zip_code, phone, email);
            if (orderShipping) {  // Ensure orderShipping is valid
                dispatch(clearShippingInfo(""));
            }

            if (isAuthenticated) {
                const cartDelete = await deleteCart();
                if (cartDelete) {
                    dispatch(setCart(defaultCartState));
                    localStorage.clear();
                }
            } else {
                dispatch(setCart(defaultCartState));
                localStorage.clear();
            }
        }
        navigate(`/Checkout/${order_id}`)
        //setOrderComplete(true);
    }

    return (
        <div className="mt-6 flex flex-col">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <div
                className="flex flex-col py-4 w-full border-b-2 border-gray-300"
            >
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSelectPayment('Credit or Debit', showCreditOrDebit, setShowCreditOrDebit)}
                >
                    <input
                        type="radio"
                        name="credit-or-debit"
                        value="Credit or Debit"
                        className="mr-3 custom-radio"
                        checked={showCreditOrDebit}
                        onChange={() => handleSelectPayment('Credit or Debit', showCreditOrDebit, setShowCreditOrDebit)}
                    />
                    <p>Credit or Debit</p>
                </div>

                <div
                    ref={creditRef}
                    className="overflow-hidden transition-max-height duration-500 ease-in-out"
                    style={{ maxHeight: creditContentHeight }}
                >
                    <div className="relative bg-gray-100 w-full p-4 mt-4 flex">
                        <div className="w-1/2 mr-4 relative">
                            <Input
                                placeholder="Card Number"
                            />
                            <MdLock className="absolute z-50 right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        </div>
                        <Input
                            placeholder="Expiration"
                            className="w-1/4 mr-4"
                        />
                        <Input
                            placeholder="CVV"
                            className="w-1/4"
                        />
                        <Button
                            type="text"
                            shape="circle"
                            icon={<MdInfoOutline className="text-gray-500 text-lg" />}
                            style={{ position: 'absolute', right: 22, top: '50%', transform: 'translateY(-50%)' }}
                            onClick={() => setShowInfoMessage(!showInfoMessage)}
                        />
                        {showInfoMessage ? (
                            <div
                                ref={infoMessageRef}
                                className="flex absolute bottom-16 right-3 w-80 bg-black bg-opacity-70 text-white border border-gray-300 shadow-xl z-50 mt-2"
                            >
                                <div className="flex flex-col p-2">
                                    <p className="text-xs font-semibold mb-2">Where's my CVV?</p>
                                    <p className="text-xs">The last 3 digits on the back of most cards. The 4 digits on the front of Amex cards.</p>
                                </div>

                                <button
                                    onClick={() => setShowInfoMessage(false)}
                                    className="flex items-start px-2">x
                                </button>
                            </div>
                        ) : ""}
                    </div>
                    <BillingAddress
                        billingSameAsShipping={billingSameAsShipping}
                        setBillingSameAsShipping={setBillingSameAsShipping}
                        setBillingValidated={setBillingValidated}
                        showBillingErrors={showBillingErrors}
                    />
                </div>

            </div>

            <div className="flex flex-col py-4 w-full border-b-2 border-gray-300">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSelectPayment('Paypal', showPaypal, setShowPaypal)}
                >
                    <input
                        type="radio"
                        name="credit-or-debit"
                        value="Credit or Debit"
                        className="mr-3 custom-radio"
                        checked={showPaypal}
                        onChange={() => handleSelectPayment('Paypal', showPaypal, setShowPaypal)}
                    />
                    <p>Paypal</p>
                </div>
                <div
                    ref={paypalRef}
                    className="overflow-hidden transition-max-height duration-500 ease-in-out"
                    style={{ maxHeight: payPalContentHeight }}
                >
                    <div className="flex flex-col self-end my-4 items-end">
                        <p className="text-sm text-gray-600 font-semibold">Total:</p>
                        <p className="text-lg font-bold">$1000</p>
                    </div>
                    <div className="w-full flex items-center justify-between gap-4">
                        <p className="p-4 bg-gray-200 border-l-4 border-blue-900 flex-grow">Apply coupon codes before paying with PayPal</p>
                        <div className="w-1/5 py-4 rounded-md bg-yellow-400 text-white text-xl flex justify-center items-center">
                            <img alt="PayPal Logo" src={PayPalLogo} width="110" />
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => handleCompleteOrder()} className="hover:bg-red-800 transition-colors duration-300 ease flex-1 x-36 p-4 mx-4 mt-6 rounded-md bg-black text-white text-xl self-center">Complete My Order</button>
        </div>
    )
}