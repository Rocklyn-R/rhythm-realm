import { OrderSummary } from "../OrderSummary/OrderSummary"
import { useEffect, useRef, useState } from "react";
import { Delivery } from "./Delivery/Delivery";
import { useSelector } from "react-redux";
import { selectAddress, selectApartment, selectCity, selectEmail, selectFullName, selectPhone, selectSelectedState, selectZipCode } from "../../redux-store/ShippingSlice";
import { TbTruck } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import { ReviewAndPayment } from "./ReviewAndPayment/ReviewAndPayment";
import { selectShippingCost, selectShippingType } from "../../redux-store/CartSlice";
import { formatPrice } from "../../utilities/utilities";
import { useNavigate } from "react-router-dom";
import { selectCart } from "../../redux-store/CartSlice";
import { selectAddressBook } from "../../redux-store/UserSlice";

export const Checkout = () => {
    const name = useSelector(selectFullName);
    const email = useSelector(selectEmail);
    const phone = useSelector(selectPhone);
    const address = useSelector(selectAddress);
    const apt = useSelector(selectApartment);
    const city = useSelector(selectCity);
    const zipCode = useSelector(selectZipCode);
    const US_State = useSelector(selectSelectedState);
    const shippingType = useSelector(selectShippingType);
    const shippingCost = useSelector(selectShippingCost);
    const [editMode, setEditMode] = useState(address ? true : false);
    const [showReviewAndPayment, setShowReviewAndPayment] = useState(false);
    const navigate = useNavigate();
    const cart = useSelector(selectCart);
    const addressBook = useSelector(selectAddressBook);
    const [editSavedMode, setEditSavedMode] = useState(false);
    const deliveryRef = useRef<HTMLHeadingElement>(null);

    const scrollToDelivery = () => {
        if (deliveryRef.current) {
            deliveryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const checkExistingAddress = () => {
        const doesExist = addressBook.some((existingAddress) => {
            return (
                existingAddress.name === name.trim() &&
                existingAddress.address === address.trim() &&
                (existingAddress.apartment || "") === apt.trim() && // Handle empty apartment values
                existingAddress.city === city.trim() &&
                existingAddress.state === US_State.trim() &&
                existingAddress.zip_code === zipCode.trim() &&
                existingAddress.phone === phone.trim()
            );
        });

        return doesExist;
    };

    const handleEditDelivery = () => {
        setEditMode(true);
        setShowReviewAndPayment(false);
        const addressExists = checkExistingAddress();
        if (addressExists) {
            setEditSavedMode(true);
        } else {
            setEditSavedMode(false);
        }
    }

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/Cart')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate])

    return (

        <div className="flex lg:flex-row flex-col justify-evenly mx-6 h-full">
            <div className="mb-4 lg:hidden">
                <OrderSummary
                    page="Checkout SM"
                />
            </div>
            <div className="flex flex-col lg:w-2/3">
                <div className="h-fit bg-white rounded-md shadow-lg p-6">
                    <div className="flex items-end">
                        <h1 ref={deliveryRef} className="text-3xl w-full mr-1 font-bold">Delivery</h1>
                        {showReviewAndPayment && !editMode && (
                            <button className="flex items-center text-gray-600" onClick={() => handleEditDelivery()}>
                                <FaRegEdit />
                                <p className="m-2 font-semibold">Edit</p>
                            </button>
                        )}
                    </div>
                    {showReviewAndPayment && !editMode ? (
                        <div className="bg-gray-100 flex flex-col p-2 mt-6">
                            <div className="flex justify-between">
                                <div className="flex items-center my-1">
                                    <TbTruck className="text-xl" />
                                    <p className="px-2 font-semibold text-md">{shippingType}</p>
                                </div>
                                <p className={`font-medium ${shippingCost ? "" : "text-green-700"}`}>{shippingCost ? `$${formatPrice(shippingCost)}` : "Free"}</p>
                            </div>
                            <div className="ml-7">
                                <p>{name}</p>
                                <p>{address},{apt} {city}, {US_State} {zipCode}</p>
                                <p className="font-semibold my-1">Contact Information</p>
                                <p>{email}</p>
                                <p>{phone}</p>
                            </div>
                        </div>
                    ) : 
                            <Delivery
                                setEditMode={setEditMode}
                                editMode={editMode}
                                setShowReviewAndPayment={setShowReviewAndPayment}
                                editSavedMode={editSavedMode}
                                setEditSavedMode={setEditSavedMode}
                                scrollToDelivery={scrollToDelivery}
                            />
    
                    }

                </div>

                <div className="h-fit bg-white rounded-md shadow-lg p-6 mt-4">
                    <div className="flex items-end">
                        <h1 className={`text-3xl w-full mr-1 montserrat-bold ${!showReviewAndPayment ? 'text-gray-500' : ''}`}>Review & Payment</h1>
                    </div>
                    {showReviewAndPayment ? <ReviewAndPayment /> : ""}
                </div>
            </div>
            <div className="lg:w-1/3 ml-10 lg:block hidden">
                <OrderSummary
                    page="Checkout"
                />
            </div>

        </div>

    )
}