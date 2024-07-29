import { useSelector } from "react-redux"
import { selectOrders } from "../../redux-store/UserSlice";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useRef } from "react";
import { formatDateString, formatPrice } from "../../utilities/utilities";
import { useFetchOrderHistory } from "../../hooks/useFetchOrderHistory";

export const OrderHistory = () => {
    useFetchOrderHistory();
    const orders = useSelector(selectOrders);
    const [showOrders, setShowOrders] = useState(orders.map(() => false));
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleViewOrder = (index: number) => {
        setShowOrders(prevShowOrders =>
            prevShowOrders.map((show, idx) => idx === index ? !show : show)
        );
    };


    return (
        <div className="flex flex-col mb-14 w-full items-center px-4">
            <h2 className="text-3xl text-center font-bold mb-6">Order History</h2>
            <div className="flex flex-col bg-white rounded-md shadow-lg w-full md:w-2/3 lg:w-1/2 py-6 lg:p-6 min-h-80">
                <div className="w-full flex justify-between pb-6 xs:text-xl font-semibold px-4">
                    <p>Order No:</p>
                    <p>Status:</p>
                    <p>Date:</p>
                </div>
                {orders.map((order, index) => (
                    <div key={index} className="w-full border-b-2 border-gray-200">
                        <button
                            className="flex w-full justify-between p-4"
                            onClick={() => handleViewOrder(index)}
                        >
                            <div className="flex items-center">
                                <IoIosArrowDown className="xs:text-xl text-md xs:mr-4" />
                                <p className="font-semibold xs:text-base text-xs">{order.id}</p>
                            </div>
                            <p className="font-semibold xs:text-base text-xs">{order.status}</p>
                            <p className="font-semibold xs:text-base text-xs">{formatDateString(order.order_date)}</p>
                        </button>
                        <div
                            ref={el => contentRefs.current[index] = el}
                            className="overflow-hidden transition-all duration-500 ease-in-out"
                            style={{
                                maxHeight: showOrders[index] ? `${contentRefs.current[index]?.scrollHeight}px` : '0px',
                                opacity: showOrders[index] ? 1 : 0,
                                transition: 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out'
                            }}
                        >
                            <div className="px-4 py-4 w-full space-y-6">
                                {order.order_items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex flex-col xs:flex-row items-center">
                                        <img src={item.image1} className="xs:w-1/4 w-1/2" />
                                        <div className="flex flex-col items-center xs:items-start">
                                            <p className="text-center xs:text-start">{item.name} {item.variant_name}</p>
                                            <p>x {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                <p className="font-semibold w-full flex xs:justify-end justify-center">Total Paid: ${formatPrice(order.total_with_tax)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};