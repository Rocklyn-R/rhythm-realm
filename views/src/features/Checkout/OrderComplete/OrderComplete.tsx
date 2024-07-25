import { useEffect } from "react";
import { Order, OrderItem } from "../../../types/types";
import { formatPrice } from "../../../utilities/utilities";

interface OrderCompleteProps {
    currentOrder: Order | undefined;
    currentOrderItems: OrderItem[];
}

export const OrderComplete: React.FC<OrderCompleteProps> = ({ currentOrderItems, currentOrder }) => {

    console.log(currentOrder);
    if (!currentOrder) {
        return <div></div>; // Render a fallback if currentOrder is undefined
    }

    return (
        <div className="flex flex-col items-center w-full bg-gray-100 pb-12">
            <h2 className="text-3xl text-center font-bold mb-8">Order Complete!</h2>
            <h3 className="text-xl font-semibold mb-4">Summary of Order No: {currentOrder.id}</h3>
            <div className="w-full max-w-xs">
                {currentOrderItems.map(item => (
                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4 w-full">
                        <img src={item.image1} width={100} className="rounded-lg shadow-sm" />

                        <div className="flex flex-col items-end w-1/2 ml-4">
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
    )
}