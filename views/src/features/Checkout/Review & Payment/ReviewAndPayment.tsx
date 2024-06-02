import { Input, Button } from "antd";
import { useEffect, useRef, useState } from "react"
import { MdInfoOutline, MdLock } from "react-icons/md";
import { BillingAddress } from "./BillingAddress/BillingAddress";
import PayPalLogo from "../../../images/icons/PaypalLogo.png";

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
            setCreditContentHeight(`${creditRef.current.scrollHeight}px`);
        } else {
            setCreditContentHeight('0px');
        }
    }, [showCreditOrDebit, billingSameAsShipping]);

    useEffect(() => {
        if (showPaypal) {
            setPayPalContentHeight(`${paypalRef.current.scrollHeight}px`);
        } else {
            setPayPalContentHeight('0px');
        }
    })

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
                        onClick={() => handleSelectPayment('Credit or Debit', showCreditOrDebit, setShowCreditOrDebit)}
                    />
                    <p>Credit or Debit</p>
                </div>

                <div
                    ref={creditRef}
                    className="overflow-hidden transition-max-height duration-500 ease-in-out"
                    style={{ maxHeight: creditContentHeight }}
                >
                    <div className="relative bg-gray-200 w-full p-4 mt-4 flex">
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
                        onClick={() => handleSelectPayment('Paypal', showPaypal, setShowPaypal)}
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
                            <img src={PayPalLogo} width="110" />
                        </div>
                    </div>
                </div>
            </div>

            <button className="hover:bg-red-800 transition-colors duration-300 ease flex-1 x-36 p-4 mx-4 mt-6 rounded-md bg-black text-white text-xl self-center">Complete My Order</button>
        </div>
    )
}