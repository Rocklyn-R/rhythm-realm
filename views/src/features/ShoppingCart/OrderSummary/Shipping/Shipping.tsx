import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FiftyStates } from "./50states";
import { Select, Input } from 'antd';
import { SelectProps } from 'antd/es/select';
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotal, selectTotalWithCoupon, setSelectedState, setSelectedZipCode, setSalesTax, setTotalWithTax, selectTotalWithTax, selectSalesTax, selectZipCode } from "../../../../redux-store/CartSlice";
import { useDispatch } from "react-redux";
import { formatPrice } from "../../../../utilities/utilities";
import { fetchStateByZipCode } from "../../../../api/cart";
import { SelectState } from "./SelectState";

interface ShippingProps {
    page: "Cart" | "Checkout";
}

export const Shipping: React.FC<ShippingProps> = ({ page }) => {
    const [showShippingInput, setShowShippingInput] = useState(false);
    const [US_state, setUS_state] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const dispatch = useDispatch();
    const sales_tax = useSelector(selectSalesTax);
    const selectedZipCode = useSelector(selectZipCode);
    const [missingZipCodeMessage, setMissingZipCodeMessage] = useState("");
    const [missingStateMessage, setMissingStateMessage] = useState("");


    const handleShowShippingInput = () => {
        setShowShippingInput(!showShippingInput);
        setZipCode("");
        setUS_state("");
    }

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
    }

    const calculateSalesTaxAndTotal = async () => {
        if (US_state && zipCode) {
            setMissingStateMessage("");
            setMissingZipCodeMessage("");
            const fetchState = await fetchStateByZipCode(zipCode);
            if (fetchState) {
                dispatch(setSelectedState(fetchState));
                dispatch(setSelectedZipCode(zipCode));
                const taxRate = FiftyStates.find(state => state.abbreviation === fetchState)?.tax_rate;
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
                    dispatch(setSalesTax(totalTax.toFixed(2)));
                    dispatch(setTotalWithTax(totalWithTax.toFixed(2)));
                    setShowShippingInput(false);
                }
            } else {
                setMissingZipCodeMessage("Invalid Zip Code")
            }
        } else if (!US_state && zipCode) {
            setMissingStateMessage("Please select a state");
            setMissingZipCodeMessage("");
        } else if (US_state && !zipCode) {
            setMissingStateMessage("");
            setMissingZipCodeMessage("Zip Code is required")
        } else {
            setMissingStateMessage("Please select a state");
            setMissingZipCodeMessage("Zip Code is required")
        }
    }

    return (
        <div className="flex flex-col pt-4 w-full">
            <div className="flex justify-between">
                <div className="flex mb-4">
                    <p>{page === "Cart" ? "Ship to" : "Shipping"}:</p>
                    {page === "Cart" ? (
                        <button
                        onClick={() => handleShowShippingInput()}
                        className="flex items-center mx-2 text-blue-500 font-medium">
                        {sales_tax === "0" ? "Enter Location" : selectedZipCode}
                        <FaCaretDown className="text-gray-600" />
                    </button> 
                    ) : ""}
                   
                </div>
                <p className="font-semibold">{sales_tax === "0" ? "" : "Free"}</p>

            </div>
            {showShippingInput ? (
                <div className="w-full flex flex-wrap">
                 <SelectState 
                    missingStateMessage={missingStateMessage}
                    handleSelectState={handleSelectState} 
                    page="Cart"
                />
                    <div className="w-1/3">
                        <Input
                            placeholder="Zip Code"
                            className="ml-2"
                            onChange={(e) => setZipCode(e.target.value)}
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