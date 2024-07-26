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
import { setSelectedProduct } from "../../redux-store/ProductsSlice";
import { useNavigate } from "react-router-dom";

export const ShoppingCart = () => {
    const cart = useSelector(selectCart);
    const totalItems = useSelector(selectTotalItems);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

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

    const selectItem = (product: Cart) => {
        const { quantity, ...itemWithoutQuantity } = product;
        dispatch(setSelectedProduct(itemWithoutQuantity));
        navigate(`/${product.category_name}/${product.subcategory_name}/${product.name}${product.variant_name ? `/${product.variant_name}` : ''}`)
    }

    return (
        <div className="flex justify-center lg:justify-around flex-col lg:flex-row w-full ">
            <div className="lg:w-2/3 lg:ml-4 bg-white px-4 rounded-md shadow-lg">
                <div className="p-4 border-gray-300 flex items-end">
                    <h1 className="text-3xl mr-1 montserrat-bold">Cart</h1>
                    <p className="montserrat-light">({totalItems} items)</p>
                </div>
                <div className="">
                    {cart.map((item, index) => (
                        <div key={index} className="flex border-t-2 justify-between border-gray-300">
                            <div className="flex">
                                <div className="lg:w-44">
                                    <img alt="Item" src={item.image1} className="cursor-pointer m-6 w-44" onClick={() => selectItem(item)} />
                                </div>
                                <div className="flex flex-col ml-6 m-6 items-start">
                                    <span className="font-semibold mb-4 cursor-pointer hover:underline" onClick={() => selectItem(item)}>{item.name} {item.variant_name}</span>
                                    <span className="text-xs">Item# {item.variant_id}</span>
                                    <span className="text-xs mb-2">Condition: New</span>
                                    <span className="text-green-600">In Stock</span>
                                    <div className="flex mt-1">
                                        <div className="flex flex-col items-center pt-4 pr-4">
                                            <img alt="Delivery" src={Delivery} width="22" />
                                            <p className="text-sm">Free shipping</p>
                                        </div>
                                        <div className="flex flex-col items-center p-4">
                                            <img alt="Returns" src={ReturnIcon} width="22" />
                                            <p className="text-sm">45 day returns</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end mr-6">
                                <div className="my-6 flex flex-col items-end">
                                    {item.quantity > 1 ? (
                                        <div className="text-sm">
                                            <span className={`montserrat-light ${item.sale_price ? 'line-through text-red-800 mr-2' : ''}`}>${formatPrice(item.price)}</span>
                                            {item.sale_price ? <span>${formatPrice(item.sale_price)}</span> : ""}
                                            <span>/ea</span>
                                        </div>

                                    ) : (
                                        item.sale_price ? (
                                          <span className="line-through text-red-800 text-sm">
                                            ${formatPrice(item.price)}
                                          </span>
                                        ) : ""
                                      )}
                                    <span className="montserrat-bold text-lg">
                                        ${item.sale_price
                                            ? formatPrice((parseFloat(item.sale_price) * item.quantity).toFixed(2))
                                            : formatPrice((parseFloat(item.price) * item.quantity).toFixed(2))
                                        }
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