import { useEffect } from "react";
import { Order, OrderItem } from "../../../types/types";
import { formatPrice } from "../../../utilities/utilities";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { findFullOrder } from "../../../api/order";
import { Loading } from "../../Loading/Loading";



export const OrderComplete = () => {
    const { orderNo } = useParams();
    const [currentOrder, setCurrentOrder] = useState<Order>();
    const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentOrder = async () => {
            if (orderNo) {
                const getOrder = await findFullOrder(orderNo);
                if (getOrder) {
                    setCurrentOrder(getOrder.order[0]);
                    setCurrentOrderItems(getOrder.orderItems);
                }
                setIsLoading(false);
            }

        }
        getCurrentOrder();
    }, [])
    //console.log(currentOrder);
    if (!currentOrder) {
        if (!isLoading) {
            navigate('/');
            return <div></div>;
        } else {
            return <div><Loading /></div>
        }
        // Render a fallback if currentOrder is undefined
    }

    return (
        <div className="flex flex-col items-center w-full bg-gray-100 pb-12">
            <h2 className="text-3xl text-center font-bold mb-8">Order Complete!</h2>
            <div className="bg-white min-w-fit lg:w-1/2 md:w-4/6 w-5/6 rounded-md shadow-lg flex flex-col items-center p-6">
                <h3 className="text-xl font-semibold mb-4">Summary of Order No: {currentOrder.id}</h3>
                <div className="w-full max-w-xs">
                    {currentOrderItems.map(item => (
                        <div className="flex justify-center items-center p-4 mb-4">
                            <img src={item.image1} width={100} className="rounded-lg shadow-sm" />

                            <div className="flex flex-col items-end ml-4">
                                {item.quantity > 1 && (
                                    <>
                                        <p className={`${item.sale_price ? "text-red-800 line-through" : "font-semibold"}`}>
                                            ${formatPrice(item.price)}/ea
                                        </p>
                                        {item.sale_price && (
                                            <p className="font-semibold">
                                                ${formatPrice(item.sale_price)}/ea
                                            </p>
                                        )}
                                    </>
                                )}

                                <p className="font-light text-sm">Quantity: {item.quantity}</p>
                                <p className="text-lg font-semibold">
                                    ${formatPrice((parseFloat(item.price) * item.quantity).toFixed(2))}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {currentOrder.discount && (
                    <p className="text-lg font-semibold text-red-800">
                        Discount: - {currentOrder.discount * 100}%
                    </p>
                )}
                <p className="text-lg font-semibold">Tax: ${formatPrice(currentOrder.total_tax)}</p>
                {currentOrder.shipping_cost && (
                    <p className="text-lg font-semibold">Shipping: ${formatPrice(currentOrder.shipping_cost)}</p>
                )}
                <p className="text-xl font-bold mt-4">Total Paid: ${formatPrice(currentOrder.total_with_tax)}</p>
            </div>

        </div>
    )
}