import { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FiftyStates } from "./50states";
import { Select, Input } from 'antd';
import { SelectProps } from 'antd/es/select';
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotal, selectTotalWithCoupon, setTotalWithTax, selectTotalWithTax, selectSalesTax, setSalesTax } from "../../../redux-store/CartSlice";
import { useDispatch } from "react-redux";
import { formatPrice } from "../../../utilities/utilities";
import { fetchStateByZipCode } from "../../../api/cart";
import { SelectState } from "./SelectState";
import { setSelectedState, setSelectedZipCode, selectZipCode, selectShippingCost, selectSelectedState } from "../../../redux-store/ShippingSlice";

interface ShippingProps {
    page: "Cart" | "Checkout";
    setTotal_With_Tax?: (arg0: string) => void;
    sales_tax?: string;
    setSales_Tax?: (arg0: string) => void;
}

export const Shipping: React.FC<ShippingProps> = ({ page, setTotal_With_Tax, sales_tax, setSales_Tax }) => {
    const [showShippingInput, setShowShippingInput] = useState(false);
    const [US_state, setUS_state] = useState<string>("");
    const [US_stateInput, setUS_stateInput] = useState("");
    const [zipCode, setZipCode] = useState<string>("");
    const [zipCodeInput, setZipCodeInput] = useState("")
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const dispatch = useDispatch();
    const [missingZipCodeMessage, setMissingZipCodeMessage] = useState("");
    const [missingStateMessage, setMissingStateMessage] = useState("");
    const shippingCost = useSelector(selectShippingCost);
    const selectedState = useSelector(selectSelectedState);
    const isInitialRender = useRef(true);

    const handleShowShippingInput = () => {
        setShowShippingInput(!showShippingInput);
        setZipCodeInput("");
        setUS_stateInput("");
    }

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_stateInput(value as string);
    }
    const calculateTaxRate = (USStateAbbrev: string) => {
        const taxRate = FiftyStates.find(state => state.abbreviation === USStateAbbrev)?.tax_rate;
        if (taxRate) {
            let totalTax;
            let totalWithTax;
            if (appliedCoupon) {
                totalTax = parseFloat(totalWithCoupon) * taxRate;
                totalWithTax = parseFloat(totalWithCoupon) + totalTax;
            } else {
                totalTax = parseFloat(total) * taxRate;
                totalWithTax = parseFloat(total) + totalTax;
            }
            if (page === "Cart") {
                if (setSales_Tax && setTotal_With_Tax) {
                    setSales_Tax(totalTax.toFixed(2));
                    setTotal_With_Tax(totalWithTax.toFixed(2));
                }
            } else {
                //console.log("RR")
                dispatch(setSalesTax(totalTax.toFixed(2)));
                dispatch(setTotalWithTax(totalWithTax.toFixed(2)))
            }

        }
    }

    const calculateSalesTaxAndTotal = async () => {
        if (US_stateInput && zipCodeInput) {
            setZipCode(zipCodeInput);
            setUS_state(US_stateInput);
            setMissingStateMessage("");
            setMissingZipCodeMessage("");
            const fetchState = await fetchStateByZipCode(zipCodeInput);
            if (fetchState) {
                calculateTaxRate(fetchState);
                setShowShippingInput(false);
            } else {
                setMissingZipCodeMessage("Invalid Zip Code")
            }
        } else if (!US_state && zipCodeInput) {
            setMissingStateMessage("Please select a state");
            setMissingZipCodeMessage("");
        } else if (US_state && !zipCodeInput) {
            setMissingStateMessage("");
            setMissingZipCodeMessage("Zip Code is required")
        } else {
            setMissingStateMessage("Please select a state");
            setMissingZipCodeMessage("Zip Code is required")
        }
    }

    useEffect(() => {
        if (page === "Cart" && zipCode || page === "Checkout" && selectedState) {
            calculateTaxRate(US_state)
        }
    }, [total]);


    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        if (page === "Cart") {
            calculateTaxRate(US_state);
        } else {
            console.log("RUNNIN");
            console.log(selectedState);
            calculateTaxRate(selectedState);
        }
    }, [appliedCoupon])


    return (
        <div className="flex flex-col pt-4 w-full">
            <div className="flex justify-between">
                <div className="flex mb-4">
                    <p>{page === "Cart" ? "Ship to" : "Shipping"}:</p>
                    {page === "Cart" ? (
                        <button
                            onClick={() => handleShowShippingInput()}
                            className="flex items-center mx-2 text-blue-500 font-medium">
                            {sales_tax === "0" ? "Enter Location" : zipCode}
                            <FaCaretDown className="text-gray-600" />
                        </button>
                    ) : ""}
                </div>
                <p className="font-semibold"> {page === "Cart" ? "Free" : (page === "Checkout" && !shippingCost) ? "Free" : `$${shippingCost}`}</p>
            </div>
            {showShippingInput ? (
                <div className="w-full flex flex-wrap">
                    <SelectState
                        missingStateMessage={missingStateMessage}
                        handleSelectState={handleSelectState}
                        page="Cart"
                        US_state={US_state}
                    />
                    <div className="w-1/3">
                        <Input
                            placeholder="Zip Code"
                            className="ml-2"
                            onChange={(e) => setZipCodeInput(e.target.value)}
                        />
                        {missingZipCodeMessage ? <p className="text-red-700 text-xs mx-2 my-1">{missingZipCodeMessage}</p> : ""}
                    </div>
                    <button
                        onClick={() => calculateSalesTaxAndTotal()}
                        className="hover:bg-red-800 transition-colors duration-300 ease x-36 p-3 h-[50px] rounded-md mx-4 bg-black text-white"
                    >Update</button>
                </div>

            ) : ""
            }

        </div >
    )
}