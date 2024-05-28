import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FiftyStates } from "./50states";
import { Select, Input } from 'antd';
import { SelectProps } from 'antd/es/select';
import { useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotal, selectTotalWithCoupon, setSelectedState, setSelectedZipCode, setSalesTax, setTotalWithTax, selectTotalWithTax, selectSalesTax, selectZipCode } from "../../../../redux-store/CartSlice";
import { useDispatch } from "react-redux";
import { formatPrice } from "../../../../utilities/utilities";


export const Shipping = () => {
    const [showShippingInput, setShowShippingInput] = useState(false);
    const [US_state, setUS_state] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const dispatch = useDispatch();
    const total_with_tax = useSelector(selectTotalWithTax);
    const sales_tax = useSelector(selectSalesTax);
    const selectedZipCode = useSelector(selectZipCode);

    const handleShowShippingInput = () => {
        setShowShippingInput(!showShippingInput);
        setZipCode("");
        setUS_state("");
    }

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
    }

    const calculateSalesTaxAndTotal = () => {
        if (US_state && zipCode) {
            dispatch(setSelectedState(US_state));
            dispatch(setSelectedZipCode(zipCode));
            const taxRate = FiftyStates.find(state => state.abbreviation === US_state)?.tax_rate;
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
        }
    }

    return (
        <div className="flex flex-col pt-4 w-full">
            <div className="flex justify-between">
                <div className="flex mb-4">
                    <p>Ship to:</p>
                    <button
                        onClick={() => handleShowShippingInput()}
                        className="flex items-center mx-2 text-blue-500 font-medium">
                        {sales_tax === "0" ? "Enter Location" : selectedZipCode}
                        <FaCaretDown className="text-gray-600" />
                    </button>
                </div>
                <p className="font-semibold">{sales_tax === "0" ? "" : "Free"}</p>

            </div>
            {showShippingInput ? (
                <div className="w-full items-center flex flex-wrap">
                    <div className="w-1/4">
                        <Select
                            placeholder="State"
                            onChange={handleSelectState}
                            style={{
                                height: "50px",
                                width: "100%",
                                fontFamily: "Montserrat",
                                fontSize: "2rem",
                            }}
                            className="mr-4"
                            options={[
                                ...FiftyStates.map(state => ({ value: state.abbreviation, label: state.abbreviation }))
                            ]}
                        />
                    </div>
                    <div className="w-1/3">
                        <Input
                            placeholder="Zip Code"
                            className="ml-2"
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => calculateSalesTaxAndTotal()}
                        className="hover:bg-red-800 transition-colors duration-300 ease x-36 p-3 rounded-md mx-4 bg-black text-white"
                    >Update</button>
                </div>

            ) : ""
            }

        </div >
    )
}