import { OrderSummary } from "../OrderSummary/OrderSummary"
import { Input, Select, AutoComplete } from "antd";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FiftyStates } from "../OrderSummary/Shipping/50states";
import { SelectState } from "../OrderSummary/Shipping/SelectState";
import { SelectProps } from "antd/es/select";
import { selectZipCode, selectSelectedState, setShipping, setSelectedZipCode, setSelectedState } from "../../redux-store/ShippingSlice";
import { useSelector } from "react-redux";
import { ShippingType } from "./Delivery/ShippingType/ShippingType";
import { useDispatch } from "react-redux";
import { selectAppliedCoupon, selectTotal, selectTotalWithCoupon, setSalesTax, setTotalWithTax } from "../../redux-store/CartSlice";
import { Delivery } from "./Delivery/Delivery";

export const Checkout = () => {
    const [editMode, setEditMode] = useState(false);



    return (
        <div className="flex justify-evenly mx-6 h-full">
            {editMode ? "" : (
                <Delivery
                    setEditMode={setEditMode}
                />
            )}
            <OrderSummary
                page="Checkout"
            />
        </div>
    )
}