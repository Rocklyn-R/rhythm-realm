import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { selectAddress, selectApartment, selectCity, selectFullName, selectPhone, selectSelectedState, selectZipCode } from "../../../../redux-store/ShippingSlice";
import { Input } from "antd";
import { FiPlus } from "react-icons/fi";
import { SelectState } from "../../../OrderSummary/Shipping/SelectState";
import { SelectProps } from "antd";
import { fetchStateByZipCode } from "../../../../api/cart";

interface BillingAddressProps {
    billingSameAsShipping: boolean;
    setBillingSameAsShipping: (arg0: boolean) => void;
}

export const BillingAddress: React.FC<BillingAddressProps> = ({billingSameAsShipping, setBillingSameAsShipping}) => {
    //const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
    const name = useSelector(selectFullName);
    const address = useSelector(selectAddress);
    const apt = useSelector(selectApartment);
    const city = useSelector(selectCity);
    const US_State = useSelector(selectSelectedState);
    const zipCode = useSelector(selectZipCode);
    const phone = useSelector(selectPhone);
    const [nameInput, setName] = useState(name ? name : "");
    const [addressInput, setAddressInput] = useState(address || "");
    const [cityInput, setCityInput] = useState(city || "");
    const [aptSuite, setAptSuite] = useState(apt || "");
    const [US_state, setUS_state] = useState<string>(US_State || "");
    const [zipCodeInput, setZipCode] = useState(zipCode || "");
    const [phoneInput, setPhoneInput] = useState(phone || "");
    const [errors, setErrors] = useState<any>({});
    const [showAptInput, setShowAptInput] = useState(false);

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
    }

    const validateFields = () => {
        let newErrors: any = {};

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

    useEffect(() => {
        const getState = async () => {
            if (zipCodeInput.length === 5) {
                const fetchState = await fetchStateByZipCode(zipCodeInput);
                if (fetchState) {
                    setUS_state(fetchState)
                }
            }
        }
        getState();
    }, [zipCodeInput])


    return (
        <div className="mt-4">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    className="mr-3 w-6 h-6 custom-checkbox"
                    checked={billingSameAsShipping}
                    onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                />
                <label>Billing address same as shipping</label>
            </div>
            {billingSameAsShipping ? (
                <div className="px-6 pt-4 pb-2">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-sm">{address}</p>
                    <p className="text-sm">{city}, {US_State} {zipCode}</p>
                </div>
            ) : (
                <div className="w-full mt-4 flex flex-col">
                    <h2 className="pb-4 text-xl font-semibold">Billing Address</h2>
                    <div className="w-full flex">
                        <div className="w-1/2 flex flex-col">
                            <Input
                                placeholder="Full Name"
                                value={nameInput}
                                className="w-full"
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <span className="text-red-700 text-xs mt-1">{errors.name}</span>}
                        </div>
                        <div className="flex flex-col w-1/2 mr-2">
                            <Input
                                placeholder="Phone number"
                                className="ml-2 w-full"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                            />
                            {errors.phone && <span className="text-red-700 text-xs ml-2 mt-1">{errors.phone}</span>}
                        </div>
                    </div>

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

                </div>
            )}
        </div>
    )
}