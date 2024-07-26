import { useEffect, useState, useRef, useCallback } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { selectTotalItems, selectCart, addToQuantity, subtractFromQuantity, selectShippingType, selectTotal, setShipping, selectAppliedCoupon, setSalesTax, setTotalWithTax, selectTotalWithCoupon } from "../../../redux-store/CartSlice"
import { selectAddress, selectSelectedState, setSelectedState } from "../../../redux-store/ShippingSlice";
import { formatPrice } from "../../../utilities/utilities";
import { Cart } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { FiftyStates } from "../Shipping/50states";
import { selectIsAuthenticated } from "../../../redux-store/UserSlice";
import { addToCart, removeFromCart } from "../../../api/cart";


export const CartSummary = () => {
    const totalItems = useSelector(selectTotalItems);
    const cart = useSelector(selectCart);
    const [showFullCart, setShowFullCart] = useState(true);
    const [showEditQuantity, setShowEditQuantity] = useState(Array(cart.length).fill(false));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedShipping = useSelector(selectShippingType);
    const totalPrice = useSelector(selectTotal);
    const expressPrice = 0.018 * parseFloat(totalPrice);
    const nextDayPrice = 0.033 * parseFloat(totalPrice);
    const appliedCoupon = useSelector(selectAppliedCoupon);
    const isInitialRender = useRef(true);
    const selectedState = useSelector(selectSelectedState);
    const totalWithCoupon = useSelector(selectTotalWithCoupon);
    const address = useSelector(selectAddress);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const calculateTaxFromState = useCallback((value: string, totalWithCoupon: string, total: string, shippingCost: string) => {
        const taxRate = FiftyStates.find(state => state.abbreviation === value)?.tax_rate;
        if (taxRate) {
            let totalTax;
            let totalWithTax;
            if (appliedCoupon) {
                totalTax = shippingCost ? ((parseFloat(totalWithCoupon) + parseFloat(shippingCost)) * taxRate) : parseFloat(totalWithCoupon) * taxRate;
                totalWithTax = parseFloat(totalWithCoupon) + totalTax;
            } else {
                totalTax = parseFloat(total) * taxRate;
                totalWithTax = parseFloat(total) + totalTax;
            }
            dispatch(setSelectedState(value));
            dispatch(setSalesTax(totalTax.toFixed(2)));
            dispatch(setTotalWithTax(totalWithTax.toFixed(2)));
        }
    }, [appliedCoupon, dispatch]);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        if (showFullCart && address) {
            let shippingCost;
            if (selectedShipping === 'Standard Ground') {
                shippingCost = "";
                dispatch(setShipping({
                    type: "Standard Ground",
                    cost: ""
                }))
                calculateTaxFromState(selectedState, totalWithCoupon, totalPrice, shippingCost);
            }
            if (selectedShipping === '2 Day Express') {
                shippingCost = expressPrice.toFixed(2);
                dispatch(setShipping({
                    type: "2 Day Express",
                    cost: shippingCost
                }))
                calculateTaxFromState(selectedState, totalWithCoupon, totalPrice, shippingCost);
            }
            if (selectedShipping === 'Next Day') {
                shippingCost = nextDayPrice.toFixed(2);
                dispatch(setShipping({
                    type: "Next-Day",
                    cost: shippingCost
                }))
                calculateTaxFromState(selectedState, totalWithCoupon, totalPrice, shippingCost);
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, totalPrice, calculateTaxFromState])

    const handleAddQuantity = async (cartItem: Cart) => {
        dispatch(addToQuantity(cartItem));
        if (isAuthenticated) {
            await addToCart(cartItem.id, cartItem.variant_id, 1);
        }
    }

    const handleSubtractQuantity = async (cartItem: Cart) => {
        dispatch(subtractFromQuantity(cartItem));
        if (isAuthenticated) {
            await removeFromCart(cartItem.id, cartItem.variant_id);
        }
    }

    useEffect(() => {
        if (cart.length === 0) {
            navigate("/Cart");
        }
    }, [cart.length, navigate]);

    const handleShowEditQuantity = (index: number) => {
        const newShowEditQuantity = [...showEditQuantity];
        newShowEditQuantity[index] = true;
        setShowEditQuantity(newShowEditQuantity);
    };

    const handleShowFullCart = () => {
        setShowFullCart(!showFullCart);
        setShowEditQuantity(Array(cart.length).fill(false));
    }

    return (
        <div className="flex flex-col pb-4">
            <div className="flex justify-between mt-4">
                <div className="flex items-center">
                    <h2 className="font-bold text-md mr-2">Your Cart</h2>
                    <p className="font-medium text-xs text-gray-500">({totalItems} items)</p>
                </div>
                <button
                    onClick={() => handleShowFullCart()}
                >{showFullCart ? <FiMinus className="text-2xl" /> : <FiPlus className="text-2xl" />}</button>
            </div>
            <div className={`sliding-content ${showFullCart ? 'sliding-content-visible' : 'sliding-content-hidden'}`} >
                {cart.map((item, index) => (
                    <div key={index} className={`flex flex-col ${index !== cart.length - 1 ? "border-b-2 border-gray-300 pb-2" : ""}`}>
                        <div key={index} className="flex justify-between">
                            <div className="flex">
                                <div>
                                    <img alt="Item" src={item.image1} width="80" className="m-6 border-2 border-gray-300" />
                                </div>
                                <div className="flex flex-col ml-2 mt-6 w-1/2 items-start">
                                    <span className="text-sm font-medium">{item.name} {item.variant_name}</span>
                                    <span className="text-xs mt-2 font-light">Item# {item.variant_id}</span>
                                    <span className="text-xs font-light">Condition: New</span>
                                    <span className="text-green-600 text-sm mt-2 font-light">In Stock</span>
                                </div>
                            </div>
                        </div>

                        {showEditQuantity[index] ? (
                            <div className="flex justify-between items-center w-2/3 self-end my-4">
                                <div className="flex items-center">
                                    <button
                                        className="p-3 border border-gray-400 rounded-md"
                                        onClick={() => handleSubtractQuantity(item)}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="mx-5">{item.quantity}</span>
                                    <button
                                        className="p-3 border border-gray-400 rounded-md"
                                        onClick={() => handleAddQuantity(item)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>

                                <span className="text-sm font-semibold">${formatPrice((parseFloat(item.price) * item.quantity).toFixed(2))}</span>
                            </div>
                        ) : (
                            <div className="flex justify-between w-2/3 self-end my-4 pl-2 items-center">
                                <button
                                    className="underline text-red-700"
                                    onClick={() => handleShowEditQuantity(index)}
                                >
                                    <span className="text-sm">Qty: {item.quantity}</span></button>
                                <span className="text-sm font-semibold">${formatPrice((parseFloat(item.price) * item.quantity).toFixed(2))}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>


            <div
                className="overflow-hidden transition-transform duration-500"
                style={{
                    transform: !showFullCart ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'bottom',
                    height: showFullCart ? 'auto' : undefined,
                }}
            >
                {!showFullCart && (
                    <div className="flex justify-start flex-wrap">
                        {cart.map(item => (
                            <img alt="Item" src={item.image1} key={item.variant_id} width="70" className="mr-2 mt-3 border-2 border-gray-300" />
                        ))}
                    </div>
                )}
            </div>
        </div>


    )
}