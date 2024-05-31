import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { selectTotal, selectTotalWithCoupon } from "../../../../redux-store/CartSlice";
import { setShipping } from "../../../../redux-store/ShippingSlice";

interface ShippingTypeProps {
    US_state: string;
    calculateTaxFromState: (arg0: string, arg1: string, arg2: string) => void;
}

export const ShippingType: React.FC<ShippingTypeProps> = ({ US_state, calculateTaxFromState }) => {
    const [selectedShipping, setSelectedShipping] = useState('Standard Ground');
    const [expressShippingPrice, setExpressShippingPrice] = useState("");
    const [nextDayShippingPrice, setNextDayShippingPrice] = useState("");
    const totalPrice = useSelector(selectTotal);
    const dispatch = useDispatch();
    const totalWithCoupon = useSelector(selectTotalWithCoupon);


    useEffect(() => {
        const expressPrice = 0.018 * parseFloat(totalPrice);
        const nextDayPrice = 0.033 * parseFloat(totalPrice);
        setExpressShippingPrice(expressPrice.toFixed(2));
        setNextDayShippingPrice(nextDayPrice.toFixed(2));
        if (selectedShipping === "Standard Ground") {
            dispatch(setShipping({
                type: "Standard Ground",
                cost: ""
            }))
            calculateTaxFromState(US_state, totalWithCoupon, totalPrice);
        } else if (selectedShipping === "2 Day Express") {
            dispatch(setShipping({
                type: "2 Day Express",
                cost: expressPrice.toFixed(2)
            }))
            const newTotalWithCoupon = (parseFloat(totalWithCoupon) + expressPrice).toFixed(2);
            const newTotal = (parseFloat(totalPrice) + expressPrice).toFixed(2);
            calculateTaxFromState(US_state, newTotalWithCoupon, newTotal)
        } else if (selectedShipping === 'Next-Day') {
            dispatch(setShipping({
                type: "Next-Day",
                cost: nextDayPrice.toFixed(2)
            }))
            const newTotalWithCoupon = (parseFloat(totalWithCoupon) + nextDayPrice).toFixed(2);
            const newTotal = (parseFloat(totalPrice) + nextDayPrice).toFixed(2);
            calculateTaxFromState(US_state, newTotalWithCoupon, newTotal);
        }
    }, [dispatch, totalPrice, selectedShipping]);

    const handleSelectShipping = (shippingType: string) => {
        setSelectedShipping(shippingType);
    }



    return (
        <div className="my-4 w-full">
            <div className="flex justify-between items-center border-b-2 border-gray-300 py-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        name="shipping"
                        value="Standard Ground"
                        checked={selectedShipping === 'Standard Ground'}
                        onChange={() => handleSelectShipping('Standard Ground')}
                        className="mr-3 custom-radio"
                    />
                    <div className="flex">
                        <p className="font-semibold mr-2">Standard Ground</p>
                        <p className="font-light">(3-5 business days)</p>
                    </div>
                </div>
                <p className="font-semibold text-green-600">Free</p>
            </div>
            <div className="flex justify-between items-center border-b-2 border-gray-300 py-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        name="shipping"
                        value="2 Day Express"
                        checked={selectedShipping === '2 Day Express'}
                        onChange={() => handleSelectShipping('2 Day Express')}
                        className="mr-3 custom-radio"
                    />
                    <div className="flex">
                        <p className="font-semibold mr-2">2 Day Express</p>
                        <p className="font-light">(2 business days)</p>
                    </div>
                </div>
                <p className="font-semibold">${expressShippingPrice}</p>
            </div>
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        name="shipping"
                        value="Next-Day"
                        checked={selectedShipping === 'Next-Day'}
                        onChange={() => handleSelectShipping('Next-Day')}
                        className="mr-3 custom-radio"
                    />
                    <div className="flex">
                        <p className="font-semibold mr-2">Next-Day</p>
                        <p className="font-light">(1 business day)</p>
                    </div>
                </div>
                <p className="font-semibold">${nextDayShippingPrice}</p>
            </div>
        </div>
    );
};
