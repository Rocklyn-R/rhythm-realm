import { useState, useEffect, useCallback } from "react";
import { Input } from "antd"
import { SelectState } from "../../OrderSummary/Shipping/SelectState"
import { FiPlus } from "react-icons/fi";
import { ShippingType } from "./ShippingType/ShippingType";
import { useDispatch, useSelector } from "react-redux";
import { selectAppliedCoupon, selectTotalWithCoupon, setSalesTax, setTotalWithTax, selectTotal, setShipping, selectShippingCost } from "../../../redux-store/CartSlice";
import {
    setAddress,
    setApartment,
    setCity,
    setShippingEmail,
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
import { addToAddressBook, removeAddress, selectAddressBook, selectIsAuthenticated, updateAddress } from "../../../redux-store/UserSlice";
import { addNewAddress, deleteAddress, editAddress } from "../../../api/addressBook";
import { formatPhoneNumber } from "../../../utilities/utilities";
import { Address } from "../../../types/types";
import { FaRegEdit } from "react-icons/fa";

interface DeliveryProps {
    setEditMode: (arg0: boolean) => void;
    editMode: boolean;
    setShowReviewAndPayment: (arg0: boolean) => void;
    editSavedMode: boolean;
    setEditSavedMode: (arg0: boolean) => void;
    scrollToDelivery: () => void;
}

export const Delivery: React.FC<DeliveryProps> = ({ setShowReviewAndPayment, editMode, setEditMode, editSavedMode, setEditSavedMode, scrollToDelivery }) => {
    const [showAptInput, setShowAptInput] = useState(false);
    const dispatch = useDispatch();
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const total = useSelector(selectTotal);
    const name = useSelector(selectFullName);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const selectedEmail = useSelector(selectEmail);
    const phone = useSelector(selectPhone);
    const address = useSelector(selectAddress);
    const apt = useSelector(selectApartment);
    const city = useSelector(selectCity);
    const zipCode = useSelector(selectZipCode);
    const US_State = useSelector(selectSelectedState);
    const [US_state, setUS_state] = useState<string>(editMode ? US_State : "");
    const [emailInput, setEmailInput] = useState(selectedEmail);
    const [phoneInput, setPhoneInput] = useState(editMode ? phone : "");
    const [nameInput, setName] = useState(editMode ? name : "");
    const [addressInput, setAddressInput] = useState(editMode ? address : "");
    const [cityInput, setCityInput] = useState(editMode ? city : "");
    const [aptSuite, setAptSuite] = useState(editMode ? apt : "");
    const [zipCodeInput, setZipCode] = useState(editMode ? zipCode : "");
    const [errors, setErrors] = useState<any>({});
    const shipping_cost = useSelector(selectShippingCost);
    const [saveAddress, setSaveAddress] = useState(editMode ? false : true);
    const addressBook = useSelector(selectAddressBook);
    const [selectedAddressId, setSelectedAddressId] = useState<number>();
    const [showDeliveryForm, setShowDeliveryForm] = useState(isAuthenticated && addressBook.length > 0 && !editSavedMode && !editMode ? false : true)
    const disabledContinueButton = isAuthenticated && editSavedMode ? true : false;

    const calculateTaxFromState = useCallback((value: string, totalWithCoupon: string, total: string, shippingCost: string) => {
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
    }, [appliedCoupon, dispatch]);

    const handleSelectState = (value: string) => {
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
    }, [dispatch, editMode]);

    const validateFields = () => {
        let newErrors: any = {};

        if (!emailInput) newErrors.email = "Email is required";
        if (!phoneInput) newErrors.phone = "Phone number is required";
        if (!nameInput) newErrors.name = "Full name is required";
        if (!addressInput) newErrors.address = "Address is required";
        if (!cityInput) newErrors.city = "City is required";
        if (!US_state) newErrors.US_state = "State is required";
        if (!zipCodeInput) newErrors.zipCode = "Zip code is required";
        setErrors(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const checkExistingAddress = () => {
        const matchingAddress = addressBook.find((existingAddress) => {
            return (
                existingAddress.name === nameInput.trim() &&
                existingAddress.address === addressInput.trim() &&
                (existingAddress.apartment || "") === aptSuite.trim() && // Handle empty apartment values
                existingAddress.city === cityInput.trim() &&
                existingAddress.state === US_state.trim() &&
                existingAddress.zip_code === zipCodeInput.trim() &&
                existingAddress.phone === phoneInput.trim()
            );
        });
    
        return matchingAddress ? matchingAddress.id : null;
    };

    const handleContinueToPayment = async () => {
        const validate = validateFields();
        if (validate) {
            if (isAuthenticated && saveAddress && showDeliveryForm) {
                const addressExists = checkExistingAddress();
                if (!addressExists) {
                    const addressId: number = await addNewAddress(nameInput, addressInput, aptSuite, cityInput, US_State, zipCodeInput, phoneInput)
                    if (addressId) {
                        const foundId = addressBook.find(address => address.id === addressId);
                        console.log(addressId);
                        console.log(foundId);
                        if (!foundId) {
                            dispatch(addToAddressBook({
                                id: addressId,
                                name: nameInput,
                                address: addressInput,
                                apartment: aptSuite,
                                city: cityInput,
                                state: US_State,
                                zip_code: zipCodeInput,
                                phone: phoneInput
                            }))
                        } else {
                            console.log("RUNS NOW TGA");
                            console.log(addressId);
                            setSelectedAddressId(foundId.id);
                        }
                    }
                } else {
                    setSelectedAddressId(addressExists);
                }

            }
            dispatch(setFullName(nameInput));
            dispatch(setAddress(addressInput));
            dispatch(setApartment(aptSuite));
            dispatch(setCity(cityInput));
            dispatch(setShippingEmail(emailInput));
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
    }, [dispatch, zipCodeInput, calculateTaxFromState, shipping_cost, totalWithCoupon, total]);



    const selectSavedAddress = (address: Address) => {
        setName(address.name);
        setPhoneInput(address.phone);
        setAddressInput(address.address);
        setAptSuite(address.apartment);
        setCityInput(address.city);
        setZipCode(address.zip_code);
        handleSelectState(address.state);
        setSelectedAddressId(address.id);
    }

    const selectAddNewAddress = () => {
        setShowDeliveryForm(true);
        setName("");
        setPhoneInput("");
        setAddressInput("");
        setAptSuite("");
        setCityInput("");
        setZipCode("");
        handleSelectState("");
        setEditMode(false);
        setEditSavedMode(false);
        setSaveAddress(true);
        scrollToDelivery();
    }

    const editSavedAddress = (address: Address) => {
        setEditSavedMode(true);
        setShowDeliveryForm(true);
        setName(address.name);
        setPhoneInput(address.phone);
        setAddressInput(address.address);
        setAptSuite(address.apartment);
        setCityInput(address.city);
        setZipCode(address.zip_code);
        handleSelectState(address.state);
        if (address.apartment) {
            setShowAptInput(true);
        }
    }


    useEffect(() => {
        if (editMode && isAuthenticated && addressBook.length > 0) {
            const foundAddress = addressBook.find(address =>
                address.address === addressInput &&
                address.name === nameInput &&
                address.city === cityInput &&
                address.phone === phoneInput &&
                address.apartment === aptSuite &&
                address.zip_code === zipCodeInput &&
                address.state === US_state
            );
            if (foundAddress) {
                setSelectedAddressId(foundAddress.id)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editMode, isAuthenticated, addressBook]);

    const saveAddressEdits = async () => {
        console.log(selectedAddressId);
        const duplicateAddressId = checkExistingAddress();
        if (selectedAddressId) {
            const editsSaved = await editAddress(
                selectedAddressId,
                nameInput,
                addressInput,
                aptSuite,
                cityInput,
                US_state,
                zipCodeInput,
                phoneInput);
            if (editsSaved) {
                dispatch(updateAddress({
                    id: selectedAddressId,
                    name: nameInput,
                    address: addressInput,
                    apartment: aptSuite,
                    city: cityInput,
                    state: US_state,
                    zip_code: zipCodeInput,
                    phone: phoneInput
                }))
                setEditMode(false);
                setShowDeliveryForm(false);
                setEditSavedMode(false);
            }
            if (editsSaved && duplicateAddressId && (selectedAddressId !== duplicateAddressId)) {
                const duplicateAddressDelete = await deleteAddress(duplicateAddressId);
                if (duplicateAddressDelete) {
                    dispatch(removeAddress(duplicateAddressId));
                }
            }
        }

    }




    return (
        <div className="w-full">
            {isAuthenticated && addressBook.length > 0 && !showDeliveryForm ? (
                <div className="flex flex-col mt-6 space-y-4 w-full">
                    <h4 className="text-xl font-semibold">Saved Addresses</h4>
                    {addressBook.map(address => (
                        <div onClick={() => selectSavedAddress(address)} className={`${selectedAddressId === address.id ? 'border-2 border-gray-800 shadow-md' : 'border border-gray-300'} flex justify-between w-full cursor-pointer bg-white hover:shadow-md p-4 rounded-md`}>
                            <div className="flex flex-col">
                                <p>{address.name}</p>
                                <p>{address.address}{address.apartment ? "," : ""} {address.apartment}</p>
                                <p>{address.city}, {address.state} {address.zip_code}</p>
                                <p>{formatPhoneNumber(address.phone)}</p>
                            </div>
                            <div>
                                <button className="flex items-center text-gray-600" onClick={() => editSavedAddress(address)}>
                                    <FaRegEdit />
                                    <p className="m-2 font-semibold">Edit</p>
                                </button>
                            </div>

                        </div>
                    ))}
                    <button
                        className="flex items-center font-light mt-4"
                        onClick={selectAddNewAddress}
                    ><FiPlus className="text-xl mr-2" />Add new address</button>
                </div>
            ) : (
                <>
                    <div className="w-full my-4">
                        <h2 className="pb-4 text-xl font-semibold">Contact Information</h2>
                        <div className="flex w-full">
                            <div className="flex flex-col w-1/2">
                                <Input
                                    placeholder="Email Address"
                                    className="mr-2"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    disabled={isAuthenticated}
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
                    </div>
                </>
            )}

            {isAuthenticated && nameInput && addressInput && cityInput && US_State && zipCodeInput && phoneInput && showDeliveryForm && (
                editSavedMode ?
                    <div className="flex items-center mt-6 w-full justify-center space-x-4">
                        <button
                            onClick={() => {
                                setShowDeliveryForm(false)
                                setEditSavedMode(false)
                            }}
                            className="hover:bg-red-800 transition-colors duration-300 ease p-4 mx-4 rounded-md bg-black text-white text-xl">Cancel</button>
                        <button
                            onClick={saveAddressEdits}
                            className="hover:bg-red-800 transition-colors duration-300 ease p-4 mx-4 rounded-md bg-black text-white text-xl">Save & Continue</button>
                    </div>
                    : <div className="flex items-center mt-6">
                        <input
                            id="savetoaddressbook"
                            type="checkbox"
                            className="mr-3 w-6 h-6 custom-checkbox"
                            checked={saveAddress}
                            onChange={() => setSaveAddress(!saveAddress)}
                        />
                        <label htmlFor="savetoaddressbook">Save to address book.</label>

                    </div>

            )}

            {US_state ?
                <div className="flex flex-col items-center w-full">
                    <ShippingType
                        US_state={US_state}
                        calculateTaxFromState={calculateTaxFromState}
                    />
                    <button
                        className={`p-4 mx-4 rounded-md text-white text-xl transition-colors duration-300 ease ${disabledContinueButton
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-black hover:bg-red-800 cursor-pointer'
                            }`}
                        onClick={() => handleContinueToPayment()}
                        disabled={disabledContinueButton}
                    >
                        Continue to Payment
                    </button>
                </div>
                : ""}


        </div>
    )
}