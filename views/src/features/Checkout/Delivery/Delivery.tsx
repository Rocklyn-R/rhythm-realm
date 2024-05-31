import { useState, useEffect } from "react";
import { Input, Form, message } from "antd"
import { SelectState } from "../../OrderSummary/Shipping/SelectState"
import { FiPlus } from "react-icons/fi";
import { ShippingType } from "./ShippingType/ShippingType";
import { SelectProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotalWithCoupon, setSalesTax, setTotalWithTax, selectTotal } from "../../../redux-store/CartSlice";
import { setSelectedState, setShipping } from "../../../redux-store/ShippingSlice";
import { FiftyStates } from "../../OrderSummary/Shipping/50states";
import { fetchStateByZipCode } from "../../../api/cart";

interface DeliveryProps {
    setEditMode: (arg0: boolean) => void;
}

export const Delivery: React.FC<DeliveryProps> = () => {
    const [showAptInput, setShowAptInput] = useState(false);
    const [US_state, setUS_state] = useState<string>("");
    const [missingStateMessage, setMissingStateMessage] = useState("");
    const dispatch = useDispatch();
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [aptSuite, setAptSuite] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [errors, setErrors] = useState<any>({});

    const calculateTaxFromState = (value: string, totalWithCoupon: string, total: string) => {
        const taxRate = FiftyStates.find(state => state.abbreviation === value)?.tax_rate;
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
            dispatch(setSelectedState(value));
            dispatch(setSalesTax(totalTax.toFixed(2)));
            dispatch(setTotalWithTax(totalWithTax.toFixed(2)));
        }
    }

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
        calculateTaxFromState(value, totalWithCoupon, total);
    }

    useEffect(() => {
        dispatch(setShipping({
            type: "Standard Ground",
            cost: ""
        }));
        dispatch(setSelectedState(""));
        dispatch(setSalesTax(""));
        dispatch(setTotalWithTax(""));
    }, [dispatch]);

    const validateFields = () => {
        let newErrors: any = {};

        if (!email) newErrors.email = "Email is required";
        if (!phone) newErrors.phone = "Phone number is required";
        if (!name) newErrors.name = "Full name is required";
        if (!address) newErrors.address = "Address is required";
        if (!city) newErrors.city = "City is required";
        if (!US_state) newErrors.US_state = "State is required";
        if (!zipCode) newErrors.zipCode = "Zip code is required";
        console.log(errors);
        setErrors(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleContinueToPayment = () => {
        const validate = validateFields();
        if (validate) {
            console.log("Proceed to payment");
        }
    }

    useEffect(() => {
        const getState = async () => {
            if (zipCode.length === 5) {
                const fetchState = await fetchStateByZipCode(zipCode);
                if (fetchState) {
                    setUS_state(fetchState)
                    calculateTaxFromState(fetchState, totalWithCoupon, total);
                }
            }
        }
        getState();
    }, [dispatch, zipCode])

    return (
        <div className="w-2/3 border-2 border-gray-300 p-6">
            <div className="flex items-end">
                <h1 className="text-3xl w-full mr-1 montserrat-bold">Delivery</h1>
            </div>
            <div className="w-full my-4">
                <h2 className="pb-4 text-xl font-semibold">Contact Information</h2>
                <div className="flex w-full">
                    <div className="flex flex-col w-1/2">
                        <Input
                            placeholder="Email Address"
                            className="mr-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="text-red-700 text-xs mt-1">{errors.email}</span>}
                    </div>
                    <div className="flex flex-col w-1/2">
                        <Input
                            placeholder="Phone number"
                            className="ml-2"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {errors.phone && <span className="text-red-700 text-xs ml-2 mt-1">{errors.phone}</span>}
                    </div>

                </div>
            </div>
            <div className="w-full mt-4 flex flex-col">
                <h2 className="pb-4 text-xl font-semibold">Shipping Address</h2>
                <Input
                    placeholder="Full Name"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="text-red-700 text-xs mt-1">{errors.name}</span>}
                <Input
                    placeholder="Address"
                    className="w-full mt-4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                {errors.address && <span className="text-red-700 text-xs mt-1">{errors.address}</span>}
                {showAptInput ? (
                    <Input
                        placeholder="Apt, suite, etc. (Optional)"
                        className="mt-4"
                        value={aptSuite}
                        onChange={(e) => setAptSuite(e.target.value)}
                    />
                ) : (
                    <button
                        className="flex items-center font-light mt-4"
                        onClick={() => setShowAptInput(true)}
                    ><FiPlus className="text-xl mr-2" />Apt, suite, etc. (Optional)</button>
                )}
                <div className="flex">
                    <div className="flex flex-col w-1/3 mr-2 mt-4">
                        <Input
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        {errors.city && <span className="text-red-700 text-xs mt-1">{errors.city}</span>}
                    </div>

                    <SelectState
                        missingStateMessage={errors.US_state}
                        handleSelectState={handleSelectState}
                        page="Checkout"
                        US_state={US_state}
                    />
                    <div className="flex flex-col w-1/3 ml-2 mt-4">
                        <Input
                            placeholder="Zip Code"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                        {errors.zipCode && <span className="text-red-700 text-xs mt-1">{errors.zipCode}</span>}
                    </div>

                </div>
                {US_state ?
                    <div className="flex flex-col items-center w-full">
                        <ShippingType
                            US_state={US_state}
                            calculateTaxFromState={calculateTaxFromState}
                        />
                        <button
                            className="hover:bg-red-800 transition-colors duration-300 ease x-36 py-4 mx-4 w-1/2 rounded-md bg-black text-white text-xl"
                            onClick={() => handleContinueToPayment()}
                        >
                            Continue to Payment
                        </button>
                    </div>
                    : ""}

            </div>
        </div>
    )
}