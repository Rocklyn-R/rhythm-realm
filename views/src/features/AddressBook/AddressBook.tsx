import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { deleteAddress, getAddressBook, addNewAddress } from "../../api/addressBook"
import {
    selectAddressBook,
    setAddressBook,
    removeAddress,
    addToAddressBook
} from "../../redux-store/UserSlice";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { Input } from "antd";
import { FiPlus } from "react-icons/fi";
import { SelectState } from "../OrderSummary/Shipping/SelectState";
import { SelectProps } from "antd";
import { fetchStateByZipCode } from "../../api/cart";

export const AddressBook = () => {
    const dispatch = useDispatch();
    const addressBook = useSelector(selectAddressBook);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [addressInput, setAddressInput] = useState("");
    const [showAptInput, setShowAptInput] = useState(false);
    const [aptSuite, setAptSuite] = useState("");
    const [cityInput, setCityInput] = useState("");
    const [US_state, setUS_state] = useState("");
    const [zipCodeInput, setZipCodeInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const [addressIdToRemove, setAddressIdToRemove] = useState<number>();
    const [addressExists, setAddressExists] = useState(false);

    const clickDelete = (id: number) => {
        setShowDeleteMessage(true);
        setAddressIdToRemove(id);
    }

    const handleDeleteAddress = async () => {
        if (addressIdToRemove) {
            const removal = await deleteAddress(addressIdToRemove);
            if (removal) {
                dispatch(removeAddress(addressIdToRemove));
                setShowDeleteMessage(false);
            }
        }
    }

    const toggleAddressForm = () => {
        setShowAddressForm(!showAddressForm);
        setNameInput("");
        setAddressInput("");
        setAptSuite("");
        setCityInput("");
        setUS_state("");
        setZipCodeInput("");
        setPhoneInput("");
        setAddressExists(false);
        setShowAptInput(false);
    }

    const validateFields = () => {
        let newErrors: any = {};

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

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
    }

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
    }, [dispatch, zipCodeInput]);

    const checkExistingAddress = () => {
        const doesExist = addressBook.some((existingAddress) => {
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

        return doesExist;
    };

    const handleSaveAddress = async () => {
        const validate = validateFields();
        if (validate) {
            const addressExists = checkExistingAddress();
            if (!addressExists) {
                setAddressExists(false);
                console.log(nameInput);
                console.log(addressInput);
                console.log(aptSuite);
                console.log(cityInput);
                console.log(US_state);
                console.log(zipCodeInput);
                console.log(phoneInput);
                const addressId = await addNewAddress(nameInput, addressInput, aptSuite, cityInput, US_state, zipCodeInput, phoneInput)
                if (addressId) {
                    dispatch(addToAddressBook({
                        id: addressId,
                        name: nameInput,
                        address: addressInput,
                        apartment: aptSuite,
                        city: cityInput,
                        state: US_state,
                        zip_code: zipCodeInput,
                        phone: phoneInput
                    }))
                    toggleAddressForm();
                }
            } else {
                setAddressExists(true);
            }

        }
    }

    useEffect(() => {
        if (showDeleteMessage) {
            // Prevent scrolling
            document.body.style.overflow = "hidden";
        } else {
            // Restore scrolling
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showDeleteMessage]);


    return (
        <div className="flex flex-col mb-14 px-4 w-full items-center">
            <h2 className="text-3xl text-center font-bold mb-6">Address Book</h2>

            {!showAddressForm && (
                <div className="flex flex-col w-full items-center justify-center">
                    <div className="space-y-4 w-full flex flex-col justify-center items-center">
                        {addressBook.map(address => (
                            <div className="flex space-x-6">
                                <div className="flex flex-col bg-white shadow-md p-4">
                                    <p>{address.name}</p>
                                    <p>{address.address}</p>
                                    <div className="flex">
                                        <p>{address.city},</p>
                                        <p>{address.state}</p>
                                    </div>
                                    <p>{address.zip_code}</p>
                                </div>
                                <button onClick={() => clickDelete(address.id)} className="flex flex-col items-center self-center"><FaRegTrashAlt className="text-xl" /></button>

                            </div>

                        ))}
                        {addressBook.length == 0 && (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <p>No addresses saved.</p>
                            </div>
                        )}
                    </div>

                    <button onClick={toggleAddressForm} className="bg-black hover:bg-red-800 transition-colors duration-300 ease w-fit p-4 rounded-md text-white text-xl mt-4">Add new address</button>

                </div>
            )}

            {showAddressForm && (
                <div className='bg-white w-2/3 rounded-md shadow-md flex flex-col p-4'>
                    <div className="flex space-between relative">
                        <h4 className="pb-4 text-xl font-semibold">New Address</h4>
                        <button onClick={toggleAddressForm} className="absolute right-4 top-4 text-xl"><FaX /></button>
                    </div>

                    <div className="w-full mt-4 flex flex-col">
                        <Input
                            placeholder="Full Name"
                            className="w-full"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
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
                            />
                            <div className="flex flex-col w-1/3 ml-2 mt-4">
                                <Input
                                    placeholder="Zip Code"
                                    value={zipCodeInput}
                                    onChange={(e) => setZipCodeInput(e.target.value)}
                                />
                                {errors.zipCode && <span className="text-red-700 text-xs mt-1">{errors.zipCode}</span>}
                            </div>
                            <div className="flex flex-col w-1/3 ml-2 mt-4">
                                <Input
                                    placeholder="Phone number"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                />
                                {errors.phone && <span className="text-red-700 text-xs ml-2 mt-1">{errors.phone}</span>}
                            </div>


                        </div>
                        {addressExists && (
                            <p className="text-red-800">The address you entered is already in your address book.</p>
                        )}
                        <div className="flex w-full justify-center mt-6 mb-2">
                            <button onClick={handleSaveAddress} className="bg-black hover:bg-red-800 transition-colors duration-300 ease w-fit p-4 rounded-md text-white text-xl">Save address</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-full z-50">
                    <div className="bg-white p-8 rounded-md shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Do you wish to delete this address from your address book?</p>
                        <div className="flex space-x-4 justify-center w-full">
                            <button onClick={handleDeleteAddress} className="px-4 py-2 bg-black text-white rounded hover:bg-red-800">Yes</button>
                            <button onClick={() => setShowDeleteMessage(false)} className="px-4 py-2 bg-black text-white rounded hover:bg-red-800">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}