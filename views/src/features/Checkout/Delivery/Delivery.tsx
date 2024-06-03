import { useState, useEffect } from "react";
import { Input, Form, message } from "antd"
import { SelectState } from "../../OrderSummary/Shipping/SelectState"
import { FiPlus } from "react-icons/fi";
import { ShippingType } from "./ShippingType/ShippingType";
import { SelectProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotalWithCoupon, setSalesTax, setTotalWithTax, selectTotal, setShipping, selectShippingCost } from "../../../redux-store/CartSlice";
import {
    setAddress,
    setApartment,
    setCity,
    setEmail,
    setFullName,
    setPhone,
    setSelectedState,
    setSelectedZipCode,
    selectEmail,
    selectPhone,
    selectAddress,
    selectApartment,
    selectCity,
    selectSelectedState,
    selectFullName,
    selectZipCode
} from "../../../redux-store/ShippingSlice";
import { FiftyStates } from "../../OrderSummary/Shipping/50states";
import { fetchStateByZipCode } from "../../../api/cart";

interface DeliveryProps {
    setEditMode: (arg0: boolean) => void;
    editMode: boolean;
    setShowReviewAndPayment: (arg0: boolean) => void;
}

export const Delivery: React.FC<DeliveryProps> = ({ setShowReviewAndPayment, editMode, setEditMode }) => {
    const [showAptInput, setShowAptInput] = useState(false);
    const dispatch = useDispatch();
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const name = useSelector(selectFullName);
    const email = useSelector(selectEmail);
    const phone = useSelector(selectPhone);
    const address = useSelector(selectAddress);
    const apt = useSelector(selectApartment);
    const city = useSelector(selectCity);
    const zipCode = useSelector(selectZipCode);
    const US_State = useSelector(selectSelectedState);
    const [US_state, setUS_state] = useState<string>(editMode ? US_State : "");
    const [emailInput, setEmailInput] = useState(editMode ? email : "");
    const [phoneInput, setPhoneInput] = useState(editMode ? phone : "");
    const [nameInput, setName] = useState(editMode ? name : "");
    const [addressInput, setAddressInput] = useState(editMode ? address : "");
    const [cityInput, setCityInput] = useState(editMode ? city : "");
    const [aptSuite, setAptSuite] = useState(editMode ? apt : "");
    const [zipCodeInput, setZipCode] = useState(editMode ? zipCode : "");
    const [errors, setErrors] = useState<any>({});
    const shipping_cost = useSelector(selectShippingCost);

    const calculateTaxFromState = (value: string, totalWithCoupon: string, total: string, shippingCost: string) => {
        const taxRate = FiftyStates.find(state => state.abbreviation === value)?.tax_rate;
        if (taxRate) {
            let totalTax;
            let totalWithTax;
            if (appliedCoupon) {
                totalTax = shippingCost ? ((parseFloat(totalWithCoupon) + parseFloat(shippingCost)) * taxRate) : parseFloat(totalWithCoupon) * taxRate;
                totalWithTax = parseFloat(totalWithCoupon) + totalTax;
            } else {
                totalTax = shippingCost ? ((parseFloat(total) + parseFloat(shippingCost)) * taxRate) : (parseFloat(total) * taxRate);
                totalWithTax = parseFloat(total) + totalTax;
            }
            dispatch(setSelectedState(value));
            dispatch(setSalesTax(totalTax.toFixed(2)));
            dispatch(setTotalWithTax(totalWithTax.toFixed(2)));
        }
    }

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
        if (shipping_cost) {
            const totalWithShipping = (parseFloat(total) + parseFloat(shipping_cost)).toFixed(2);
            const totalWithCouponAndShipping = (parseFloat(totalWithCoupon) + parseFloat(shipping_cost)).toFixed(2);
            calculateTaxFromState(value, totalWithCouponAndShipping, totalWithShipping, shipping_cost);
        } else {
            calculateTaxFromState(value, totalWithCoupon, total, shipping_cost);
        }
    }

    useEffect(() => {
        if (!editMode) {
            dispatch(setShipping({
                type: "Standard Ground",
                cost: ""
            }));
            dispatch(setSelectedState(""));
            dispatch(setSalesTax(""));
            dispatch(setTotalWithTax(""));
        }
    }, [dispatch]);

    const validateFields = () => {
        let newErrors: any = {};

        if (!emailInput) newErrors.email = "Email is required";
        if (!phoneInput) newErrors.phone = "Phone number is required";
        if (!nameInput) newErrors.name = "Full name is required";
        if (!addressInput) newErrors.address = "Address is required";
        if (!cityInput) newErrors.city = "City is required";
        if (!US_state) newErrors.US_state = "State is required";
        if (!zipCodeInput) newErrors.zipCode = "Zip code is required";
        console.log(errors);
        setErrors(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleContinueToPayment = () => {
        const validate = validateFields();
        if (validate) {
            dispatch(setFullName(nameInput));
            dispatch(setAddress(addressInput));
            dispatch(setApartment(aptSuite));
            dispatch(setCity(cityInput));
            dispatch(setEmail(emailInput));
            dispatch(setPhone(phoneInput));
            dispatch(setSelectedZipCode(zipCodeInput));
            setShowReviewAndPayment(true);
            setEditMode(false);
        }
    }



    useEffect(() => {
        const getState = async () => {
            if (zipCodeInput.length === 5) {
                const fetchState = await fetchStateByZipCode(zipCodeInput);
                if (fetchState) {
                    setUS_state(fetchState)
                    calculateTaxFromState(fetchState, totalWithCoupon, total, shipping_cost);
                }
            }
        }
        getState();
    }, [dispatch, zipCodeInput])

    return (
        <div>
            <div className="w-full my-4">
                <h2 className="pb-4 text-xl font-semibold">Contact Information</h2>
                <div className="flex w-full">
                    <div className="flex flex-col w-1/2">
                        <Input
                            placeholder="Email Address"
                            className="mr-2"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        {errors.email && <span className="text-red-700 text-xs mt-1">{errors.email}</span>}
                    </div>
                    <div className="flex flex-col w-1/2">
                        <Input
                            placeholder="Phone number"
                            className="ml-2"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
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
                    value={nameInput}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="text-red-700 text-xs mt-1">{errors.name}</span>}
                <Input
                    placeholder="Address"
                    className="w-full mt-4"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
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
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                        />
                        {errors.city && <span className="text-red-700 text-xs mt-1">{errors.city}</span>}
                    </div>

                    <SelectState
                        missingStateMessage={errors.US_state}
                        handleSelectState={handleSelectState}
                        page="Checkout"
                        US_state={US_state}
                        editMode={editMode}
                    />
                    <div className="flex flex-col w-1/3 ml-2 mt-4">
                        <Input
                            placeholder="Zip Code"
                            value={zipCodeInput}
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
                            className="hover:bg-red-800 transition-colors duration-300 ease p-4 mx-4 rounded-md bg-black text-white text-xl"
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