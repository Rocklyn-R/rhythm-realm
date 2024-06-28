import { useSelector } from "react-redux"
import { selectCart, selectTotalItems } from "../../redux-store/CartSlice"
import ReturnIcon from '../../images/icons/back-arrow.png';
import Delivery from "../../images/icons/box.png";
import { FiMinus, FiPlus } from "react-icons/fi";
import { addToQuantity, subtractFromQuantity } from "../../redux-store/CartSlice";
import { useDispatch } from "react-redux";
import { Cart } from "../../types/types";
import { formatPrice } from "../../utilities/utilities";
import { OrderSummary } from "../OrderSummary/OrderSummary";
import { addToCart, removeFromCart } from "../../api/cart";
import { selectIsAuthenticated } from "../../redux-store/UserSlice";

export const ShoppingCart = () => {
    const cart = useSelector(selectCart);
    const totalItems = useSelector(selectTotalItems);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (cart.length === 0) {
        return (
            <div className="flex justify-center text-xl">
                Your cart is currently empty!
            </div>
        )
    }

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

    return (
        <div className="flex">
            <div className="mx-4 w-3/5">
                <div className="p-4 border-b-2 border-gray-300 flex items-end">
                    <h1 className="text-3xl mr-1 montserrat-bold">Cart</h1>
                    <p className="montserrat-light">({totalItems} items)</p>
                </div>
                <div className="">
                    {cart.map((item, index) => (
                        <div key={index} className="flex border-b-2 justify-between border-gray-300">
                            <div className="flex">
                                <div>
                                    <img alt="Item" src={item.image1} width="160" className="m-6 border-2 border-gray-300" />
                                </div>
                                <div className="flex flex-col ml-6 m-6 w-9/20 items-start">
                                    <span>{item.name} {item.variant_name}</span>
                                    <span>Item# {item.variant_id}</span>
                                    <span>Condition: New</span>
                                    <span className="text-green-600">In Stock</span>
                                    <div className="flex">
                                        <div className="flex flex-col items-center pt-4 pr-4">
                                            <img alt="Delivery" src={Delivery} width="25" />
                                            <p>Free shipping</p>
                                        </div>
                                        <div className="flex flex-col items-center p-4">
                                            <img alt="Returns" src={ReturnIcon} width="25" />
                                            <p>45 day returns</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="my-6 flex flex-col items-end">
                                    {item.quantity > 1 ? <span className="montserrat-light">${formatPrice(item.price)}/ea</span> : ""}
                                    <span className="montserrat-bold text-lg">
                                        ${formatPrice((parseFloat(item.price) * item.quantity).toFixed(2))}
                                    </span>
                                </div>
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <OrderSummary
                page="Cart"
            />
        </div>
    )
}