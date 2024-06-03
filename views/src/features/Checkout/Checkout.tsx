import { OrderSummary } from "../OrderSummary/OrderSummary"
import { useState } from "react";
import { Delivery } from "./Delivery/Delivery";
import { useSelector } from "react-redux";
import { selectAddress, selectApartment, selectCity, selectEmail, selectFullName, selectPhone, selectSelectedState, selectZipCode } from "../../redux-store/ShippingSlice";
import { TbTruck } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import { ReviewAndPayment } from "./Review & Payment/ReviewAndPayment";
import { selectShippingCost, selectShippingType } from "../../redux-store/CartSlice";
import { formatPrice } from "../../utilities/utilities";

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

    const handleEditDelivery = () => {
        setEditMode(true);
        setShowReviewAndPayment(false);
    }

    return (
        <div className="flex justify-evenly mx-6 h-full">
            <div className="flex flex-col w-2/3">
                <div className="h-fit border-2 border-gray-300 p-6">
                    <div className="flex items-end">
                        <h1 className="text-3xl w-full mr-1 font-bold">Delivery</h1>
                        {showReviewAndPayment && !editMode && (
                            <button className="flex items-center text-gray-600" onClick={() => handleEditDelivery()}>
                                <FaRegEdit />
                                <p className="m-2 font-semibold">Edit</p>
                            </button>
                        )}
                    </div>
                    {showReviewAndPayment && !editMode ? (
                        <div className="bg-gray-200 flex flex-col p-2 mt-6">
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
                    ) : (
                        editMode ? (
                            <Delivery
                                setEditMode={setEditMode}
                                editMode={editMode}
                                setShowReviewAndPayment={setShowReviewAndPayment}
                            />
                        ) : (
                            <Delivery
                                setEditMode={setEditMode}
                                editMode={editMode}
                                setShowReviewAndPayment={setShowReviewAndPayment}
                            // Additional props can be added here if needed
                            />
                        )
                    )}

                </div>

                <div className="h-fit border-2 border-gray-300 p-6 mt-4">
                    <div className="flex items-end">
                        <h1 className={`text-3xl w-full mr-1 montserrat-bold ${!showReviewAndPayment ? 'text-gray-500' : ''}`}>Review & Payment</h1>
                    </div>
                    {showReviewAndPayment ? <ReviewAndPayment /> : ""}
        
                </div>

            </div>
            <OrderSummary
                page="Checkout"
            />
        </div>
    )
}