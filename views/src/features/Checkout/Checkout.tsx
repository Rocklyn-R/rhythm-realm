import { OrderSummary } from "../ShoppingCart/OrderSummary/OrderSummary"
import { Input, Select, AutoComplete } from "antd";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { FiftyStates } from "../ShoppingCart/OrderSummary/Shipping/50states";
import { SelectState } from "../ShoppingCart/OrderSummary/Shipping/SelectState";
import { SelectProps } from "antd/es/select";
import { selectZipCode, selectSelectedState } from "../../redux-store/CartSlice";
import { useSelector } from "react-redux";

export const Checkout = () => {
    const [showAptInput, setShowAptInput] = useState(false);
    const [US_state, setUS_state] = useState<string>("");
    const [missingStateMessage, setMissingStateMessage] = useState("");
    const selectedZipCode = useSelector(selectZipCode);
    const selectedState = useSelector(selectSelectedState);

    const handleSelectState: SelectProps['onChange'] = (value) => {
        setUS_state(value as string);
    }


    return (
        <div className="flex justify-evenly mx-6">
            <div className="w-2/3 border-2 border-gray-300 p-6">
                <div className="flex items-end">
                    <h1 className="text-3xl w-full mr-1 montserrat-bold">Delivery</h1>
                </div>
                <div className="w-full my-4">
                    <h2 className="pb-4 text-xl font-semibold">Contact Information</h2>
                    <div className="flex">
                        <Input
                            placeholder="Email Address"
                            className="w-1/2 mr-2"

                        />
                        <Input
                            placeholder="Phone number"
                            className="w-1/2 ml-2"

                        />
                    </div>
                </div>
                <div className="w-full my-4 flex flex-col">
                    <h2 className="pb-4 text-xl font-semibold">Shipping Address</h2>
                    <Input
                        placeholder="Full Name"
                        className="w-full mb-2"
                    />
                    <Input
                        placeholder="Address"
                        className="w-full my-2"
                    />
                    {showAptInput ? (
                        <Input
                            placeholder="Apt, suite, etc. (Optional)"
                            className="my-2"
                        />
                    ) : (
                        <button
                            className="flex items-center font-light my-2"
                            onClick={() => setShowAptInput(true)}
                        ><FiPlus className="text-xl mr-2" />Apt, suite, etc. (Optional)</button>
                    )}
                    <div className="flex">
                        <Input
                            placeholder="City"
                            className="w-1/3 mr-2 my-2"
                        />

                        <SelectState
                            missingStateMessage={missingStateMessage}
                            handleSelectState={handleSelectState}
                            page="Checkout"
                        />



                        <Input
                            placeholder="Zip Code"
                            className="w-1/3 ml-2 my-2"
                        />
                    </div>

                </div>
            </div>
            <OrderSummary 
                page="Checkout"
            />
        </div>
    )
}