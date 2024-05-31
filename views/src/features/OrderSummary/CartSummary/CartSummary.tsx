import { useEffect, useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { selectTotalItems, selectCart, addToQuantity, subtractFromQuantity } from "../../../redux-store/CartSlice"
import { formatPrice } from "../../../utilities/utilities";
import { Cart } from "../../../types/types";
import { useNavigate } from "react-router-dom";


export const CartSummary = () => {
    const totalItems = useSelector(selectTotalItems);
    const cart = useSelector(selectCart);
    const [showFullCart, setShowFullCart] = useState(true);
    const [showEditQuantity, setShowEditQuantity] = useState(Array(cart.length).fill(false));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddQuantity = (cartItem: Cart) => {
        dispatch(addToQuantity(cartItem))
    }

    const handleSubtractQuantity = (cartItem: Cart) => {
        dispatch(subtractFromQuantity(cartItem))
    }

    useEffect(() => {
        if (cart.length === 0) {
            navigate("/Cart");
        }
    }, []);

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
        <div className="flex flex-col">
            <div className="flex justify-between mt-4">
                <div className="flex items-center">
                    <h2 className="font-bold text-md mr-2">Your Cart</h2>
                    <p className="font-medium text-xs text-gray-500">({totalItems} items)</p>
                </div>
                <button
                    onClick={() => handleShowFullCart()}
                >{showFullCart ? <FiMinus className="text-2xl" /> : <FiPlus className="text-2xl" />}</button>
            </div>
                    <div className={`cart-content ${showFullCart ? 'cart-content-visible' : 'cart-content-hidden'}`} >
                        {cart.map((item, index) => (
                            <div className={`flex flex-col ${index !== cart.length - 1 ? "border-b-2 border-gray-300 pb-2" : ""}`}>
                                <div key={index} className="flex justify-between">
                                    <div className="flex">
                                        <div>
                                            <img src={item.image1} width="80" className="m-6 border-2 border-gray-300" />
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
                            <img src={item.image1} key={item.variant_id} width="70" className="mr-2 mt-3 border-2 border-gray-300" />
                        ))}
                    </div>
                )}
            </div>
        </div>


    )
}