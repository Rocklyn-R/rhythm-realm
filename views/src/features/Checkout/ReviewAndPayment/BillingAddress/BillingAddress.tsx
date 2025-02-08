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
    setBillingValidated: (arg0: boolean) => void;
    showBillingErrors: boolean;
}

export const BillingAddress: React.FC<BillingAddressProps> = ({billingSameAsShipping, setBillingSameAsShipping, setBillingValidated, showBillingErrors}) => {
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
    
    useEffect(() => {
        if (!nameInput || !addressInput || !cityInput || !US_state || !zipCodeInput || !phoneInput) {
            setBillingValidated(false);
        } else {
            setBillingValidated(true);
        }
    }, [setBillingValidated, nameInput, addressInput, cityInput, US_state, zipCodeInput, phoneInput])



    useEffect(() => {
        if (showBillingErrors) {
            const validateFields = () => {
                setErrors((prevErrors: any) => {
                    let newErrors = { ...prevErrors };
    
                    if (!phoneInput) newErrors.phone = "Phone number is required";
                    else delete newErrors.phone;
    
                    if (!nameInput) newErrors.name = "Full name is required";
                    else delete newErrors.name;
    
                    if (!addressInput) newErrors.address = "Address is required";
                    else delete newErrors.address;
    
                    if (!cityInput) newErrors.city = "City is required";
                    else delete newErrors.city;
    
                    if (!US_state) newErrors.US_state = "State is required";
                    else delete newErrors.US_state;
    
                    if (!zipCodeInput) newErrors.zipCode = "Zip code is required";
                    else delete newErrors.zipCode;
    
                    return newErrors;
                });
            };
            validateFields();
        }
    }, [showBillingErrors, phoneInput, nameInput, addressInput, cityInput, US_state, zipCodeInput]);
    

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
        <div className="my-4 ">
            <div className="flex items-center">
                <input
                    id="billingsame"
                    type="checkbox"
                    className="mr-3 w-6 h-6 custom-checkbox"
                    checked={billingSameAsShipping}
                    onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                />
                <label htmlFor="billingsame">Billing address same as shipping</label>
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
                        <div className="w-1/2 flex flex-col relative">
                            <Input
                                name="Full name"
                                placeholder="Full Name"
                                value={nameInput}
                                className="w-full"
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <span className="absolute -bottom-4 left-1 text-red-700 text-xs">{errors.name}</span>}
                        </div>
                        <div className="flex flex-col w-1/2 mr-2 relative">
                            <Input
                                name="Phone"
                                placeholder="Phone number"
                                className="ml-2 w-full"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                            />
                            {errors.phone && <span className="absolute -bottom-4 left-1 text-red-700 text-xs ml-2 mt-1">{errors.phone}</span>}
                        </div>
                    </div>
                    <div className="relative">
                    <Input
                        name="Address"
                        placeholder="Address"
                        className="w-full mt-4 "
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                    />
                    {errors.address && <span className="absolute -bottom-4 left-1 text-red-700 text-xs mt-1">{errors.address}</span>}
                    </div>
                    {showAptInput ? (
                        <Input
                            name="Apt"
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
                        <div className="flex flex-col w-1/3 mr-2 mt-4 relative">
                            <Input
                                name="City"
                                placeholder="City"
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                            />
                            {errors.city && <span className="absolute -bottom-4 left-1 text-red-700 text-xs mt-1 z-50">{errors.city}</span>}
                        </div>

                        <SelectState
                            missingStateMessage={errors.US_state}
                            handleSelectState={handleSelectState}
                            page="Checkout"
                            US_state={US_state}
                        />
                        <div className="flex flex-col w-1/3 ml-2 mt-4 relative">
                            <Input
                                name="Zip Code"
                                placeholder="Zip Code"
                                value={zipCodeInput}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                            {errors.zipCode && <span className="absolute -bottom-4 left-1 text-red-700 text-xs mt-1">{errors.zipCode}</span>}
                        </div>


                    </div>

                </div>
            )}
        </div>
    )
}